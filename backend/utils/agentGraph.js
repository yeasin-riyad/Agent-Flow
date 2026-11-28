
import "dotenv/config";

import { ChatGroq } from "@langchain/groq";

import {
  StateGraph,
  MessagesAnnotation,
  Command,
  interrupt,
  START,
  END,
} from "@langchain/langgraph";

import {
  SystemMessage,
  ToolMessage,
} from "@langchain/core/messages";

import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { MongoClient } from "mongodb";

import { getMcpTools } from "../mcp/mcpClient.js";

import { createBasePrompt } from "./basePrompt.js";
import { TOOL_PROMPTS } from "./toolPrompts.js";

// ==========================================
// 1. ENVIRONMENT VALIDATION
// ==========================================

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is missing.");
}

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is missing.");
}

// ==========================================
// 2. LLM CONFIGURATION
// ==========================================

const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "openai/gpt-oss-120b",
  temperature: 0,
  maxRetries: 2,
});

// ==========================================
// 3. MONGODB CHECKPOINTER
// ==========================================

const mongoClient = new MongoClient(process.env.MONGODB_URI);

await mongoClient.connect();

console.log("AgentFlow MongoDB Checkpointer Connected");

const checkpointer = new MongoDBSaver({
  client: mongoClient,
  dbName: "langgraph",
});

// ==========================================
// 4. TOOL NAME NORMALIZATION
// ==========================================

const normalizeToolName = (name = "") => {
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
};

// ==========================================
// 5. TOOL NAME ALIASES
// ==========================================

const TOOL_NAME_ALIASES = {
  "web.search": [
    "web_search",
    "web.search",
    "automate_web_search",
  ],

  "gmail.read": [
    "gmail.read",
  ],

  "gmail.send": [
    "gmail.send",
  ],

  calculator: [
    "calculator",
  ],
};

// ==========================================
// 6. TOOL SELECTION
// ==========================================

const selectAgentTools = (availableTools, agentTools = []) => {
  if (!Array.isArray(agentTools) || agentTools.length === 0) {
    return [];
  }

  if (!Array.isArray(availableTools)) {
    throw new Error("Available MCP tools must be an array.");
  }

  const selectedTools = agentTools
    .map((item) => {
      return typeof item === "string" ? item : item?.name;
    })
    .filter(Boolean);

  const matchedTools = [];
  const missingTools = [];

  for (const selectedName of selectedTools) {
    const aliases =
      TOOL_NAME_ALIASES[selectedName.toLowerCase()] || [
        selectedName,
      ];

    const normalizedAliases = aliases.map(normalizeToolName);

    const matchedTool = availableTools.find((tool) => {
      return normalizedAliases.includes(
        normalizeToolName(tool.name)
      );
    });

    if (!matchedTool) {
      missingTools.push(selectedName);
      continue;
    }

    const alreadyAdded = matchedTools.some(
      (tool) => tool.name === matchedTool.name
    );

    if (!alreadyAdded) {
      matchedTools.push(matchedTool);
    }
  }

  if (missingTools.length > 0) {
    throw new Error(
      `Agent tools not found in MCP servers: ${missingTools.join(", ")}`
    );
  }

  return matchedTools;
};

// ==========================================
// 7. TOOL APPROVAL POLICY
// ==========================================

// Explicit read-only tools.
// Unknown tools require approval by default.

const READ_ONLY_TOOLS = [
  "automate_web_search",
  "web_search",
  "gmail_read",
  "calculator",
];

const isApprovalRequired = (toolName) => {
  const normalizedName = normalizeToolName(toolName);

  return !READ_ONLY_TOOLS.some(
    (name) => normalizeToolName(name) === normalizedName
  );
};

// ==========================================
// 8. DYNAMIC SYSTEM PROMPT
// ==========================================

const createSystemPrompt = (agent, selectedTools = []) => {
  const currentDateTime = new Intl.DateTimeFormat("en-BD", {
    timeZone: "Asia/Dhaka",
    dateStyle: "full",
    timeStyle: "long",
  }).format(new Date());

  // Base system instructions

  const basePrompt = createBasePrompt(
    agent,
    currentDateTime
  );

  // Actual tools available to this agent

  const toolNames = selectedTools.map(
    (tool) => tool.name
  );

  const additionalPrompts = [];

  const hasTool = (pattern) => {
    return toolNames.some((name) => pattern.test(name));
  };

  // Gmail instructions

  if (hasTool(/gmail|email/i)) {
    additionalPrompts.push(TOOL_PROMPTS.gmail);
  }

  // Calendar instructions

  if (hasTool(/calendar/i)) {
    additionalPrompts.push(TOOL_PROMPTS.calendar);
  }

  // Web search instructions

  if (hasTool(/search|tavily/i)) {
    additionalPrompts.push(TOOL_PROMPTS.web);
  }

  // Instagram instructions

  if (hasTool(/instagram|social/i)) {
    additionalPrompts.push(TOOL_PROMPTS.instagram);
  }

  return [
    basePrompt,
    ...additionalPrompts,
  ]
    .filter(Boolean)
    .join("\n\n");
};

// ==========================================
// 9. CREATE AGENT GRAPH
// ==========================================

export const createAgentGraph = async (agent, userId) => {
  if (!agent) {
    throw new Error("Agent configuration is required.");
  }

  if (!userId) {
    throw new Error("User ID is required.");
  }

  // ========================================
  // DISCOVER MCP TOOLS
  // ========================================

  const availableTools = await getMcpTools();

  console.log(
    "Available MCP Tools:",
    availableTools.map((tool) => tool.name)
  );

  // ========================================
  // SELECT AGENT ASSIGNED TOOLS
  // ========================================

  const selectedTools = selectAgentTools(
    availableTools,
    agent.tools || []
  );

  console.log(
    `Selected tools for ${agent.name}:`,
    selectedTools.map((tool) => tool.name)
  );

  // ========================================
  // DYNAMIC SYSTEM PROMPT
  // ========================================

  const systemPrompt = createSystemPrompt(
    agent,
    selectedTools
  );

  // ========================================
  // BIND TOOLS TO LLM
  // ========================================

  const llmWithTools =
    selectedTools.length > 0
      ? llm.bindTools(selectedTools)
      : llm;

  // ========================================
  // CREATE TOOL NODE
  // ========================================

  const toolNode =
    selectedTools.length > 0
      ? new ToolNode(selectedTools)
      : null;

  // ========================================
  // CHAT NODE
  // ========================================

  const chatNode = async (state) => {
    const response = await llmWithTools.invoke([
      new SystemMessage(systemPrompt),
      ...state.messages,
    ]);

    return {
      messages: [response],
    };
  };

  // ========================================
  // ROUTE AFTER CHAT
  // ========================================

  const routeAfterChat = (state) => {
    const lastMessage = state.messages.at(-1);

    const toolCalls = lastMessage?.tool_calls || [];

    // No tool calls: finish the graph.

    if (toolCalls.length === 0) {
      return END;
    }

    // Check whether any tool requires approval.

    const requiresApproval = toolCalls.some(
      (toolCall) => isApprovalRequired(toolCall.name)
    );

    return requiresApproval ? "approvalNode" : "tools";
  };

  // ========================================
  // APPROVAL NODE
  // ========================================

  const approvalNode = async (state) => {
    const lastMessage = state.messages.at(-1);

    const toolCalls = lastMessage?.tool_calls || [];

    if (toolCalls.length === 0) {
      return new Command({
        goto: "chatNode",
      });
    }

    const approvalRequiredTools = toolCalls.filter(
      (toolCall) => isApprovalRequired(toolCall.name)
    );

    // Pause execution and request user approval.

    const approvalResult = interrupt({
      type: "tool_approval",

      title: "Agent wants to perform an action",

      agentId: String(agent._id),

      agentName: agent.name,

      userId: String(userId),

      actions: approvalRequiredTools.map((toolCall) => ({
        id: toolCall.id,
        name: toolCall.name,
        arguments: toolCall.args,
      })),

      message:
        "Review these requested actions and approve or reject them.",
    });

    // ========================================
    // REJECT ACTIONS
    // ========================================

    if (approvalResult?.approved !== true) {
      const rejectedMessages = toolCalls.map(
        (toolCall) => {
          return new ToolMessage({
            tool_call_id: toolCall.id,

            content: isApprovalRequired(toolCall.name)
              ? "Action rejected by the user. The tool was not executed."
              : "The tool execution was cancelled because another action in the same batch was rejected.",
          });
        }
      );

      return new Command({
        update: {
          messages: rejectedMessages,
        },

        goto: "chatNode",
      });
    }

    // ========================================
    // APPROVED ACTIONS
    // ========================================

    return new Command({
      goto: "tools",
    });
  };

  // ==========================================
  // 10. BUILD LANGGRAPH WORKFLOW
  // ==========================================

  const workflow = new StateGraph(MessagesAnnotation)
    .addNode("chatNode", chatNode)
    .addNode("approvalNode", approvalNode)
    .addNode(
      "tools",
      toolNode ||
        (async () => ({
          messages: [],
        }))
    )
    .addEdge(START, "chatNode")
    .addConditionalEdges(
      "chatNode",
      routeAfterChat,
      {
        [END]: END,
        tools: "tools",
        approvalNode: "approvalNode",
      }
    )
    .addEdge("tools", "chatNode");

  // ==========================================
  // 11. COMPILE GRAPH
  // ==========================================

  return workflow.compile({
    checkpointer,
  });
};
