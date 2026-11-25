import "dotenv/config";
import { ChatGroq } from "@langchain/groq";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";
import { ToolNode } from "@langchain/langgraph/prebuilt";

import { MongoClient } from "mongodb";
import { getMcpTools } from "../mcp/mcpClient.js";

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is missing. Check your backend .env file.");
}

const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "openai/gpt-oss-120b",
  temperature: 0,
  maxRetries: 2,
});

const client = new MongoClient(process.env.MONGODB_URI);

const checkpointer = new MongoDBSaver({
  client,
  dbName: "langgraph",
});

export const createAgentGraph= async(agent,userId)=>{

  const mcpTools= await getMcpTools();
  console.log(mcpTools.map(tool=>tool.name));
  const llmWithTools= llm.bindTools(mcpTools)


const currentDateTime= Intl.DateTimeFormat("en-BD",{
    timeZone:"Asia/Dhaka",
    dateStyle:"full",
    timeStyle:"long",
}).format(new Date());

const systemPrompt= `
${agent.instructions || "You are agentFlow, a helpful personal assistant"}.

CURRENT DATE AND TIME
- Current date and time in Asia/Dhake ${currentDateTime}.
- Resolve today,tommorow and weekday references using this timestamp.
- Do not ask the user to confirm a date that can be resolved.

DEFAULT SETTINGS:
- Timezone: Asia/Dhaka.
- Default Calender Event duration : 30 minutes.
- Infer meaningful event titles.
- Ask Only for essential missing information.
- Never fabricate tool results

IMPORTANT ACTION RULE:
- When the user directly requests an action, call the relevant tool.
- The application handles approval through an approval card.
- Do not ask for approval in your chat response. 
- Never claim an action succeeded unless the tool confirms success.

EMAIL SENDING RULES:
1. Call send_email when the required deatils are avilable.
2. Ask for the recipient only when it is missing and cannot be inferred.
3. Never ask for passwords, tokens , Api_keys or user IDs.
4. The application requests approval before sending.
5. Never claim an email was sent without tool confirmation.

CALENDER RULES:
1. Call create_calender_event when sufficient details are available.
2. Do not ask "Would you like me to crate it?".
3. Reslove relative dates using the current date above.
4. Default duration is 30 minutes.
5.
6.
7.
8.
9.
10.

GMAIL EMAIL READING RULES:

1. use list_emails when the user asks to see, lists or search emails.
2. use "in:inbox" for the latest inbox emails when appropriate.
3. Use "is:unread" for unread emails.
4. Use gamil search syntax for sender,subject,date and other email searches.
5. Use read_email to retrive a specific email's content.
6. If the message ID is unknown, call list_emails first. 
7. Summarize actual retrieved email content.
8. Never invent email content or pretend to have read an email.
9. Reading and Searching emails are read-only actions.
10. Use list_emails and read_email rather than raw MCP tool names.

WEB SEARCH RULES:

INSTAGRAM PUBLISHING RULES:

IMAGE ANALYSIS RULES:

GENERAL TOOL RULES:




`

const chatNode = async (state) => {
  const response = await llmWithTools.invoke(state.messages);

  return {
    messages: [response],
  };
};

const toolNode= new ToolNode(mcpTools)

const actionApprovalNode= async(state)=>{

}

const routeAfterChat= async(state)=>{

}

const routeAfterApproval= async(state)=>{

}

const workflow = new StateGraph(MessagesAnnotation)
.addNode("chatNode",chatNode)
.addNode("tools",toolNode)
.addNode("actionApprovalNode",actionApprovalNode)
.addNode("routeAfterChat",routeAfterChat)
.addNode("routeAfterApproval",routeAfterApproval)
.addEdge("__start__","chatNode")
.addConditionalEdges("chatNode","routeAfterChat")
.addEdge("tools","chatNode")
.addConditionalEdges("actionApprovalNode","routeAfterApproval")
.addEdge("chatNode","__end__") 

const chatGraph = workflow.compile({
  checkpointer,
});

export default chatGraph;

};