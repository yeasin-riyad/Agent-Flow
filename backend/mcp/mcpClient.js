
import { MCPAdapter } from "@langchain/mcp-adapters";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ==========================================
// PATH CONFIGURATION
// ==========================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serverPath = path.join(__dirname, "server.js");

// ==========================================
// SHARED ADAPTER
// ==========================================

// One adapter for the entire application.
const adapter = new MCPAdapter({
  servers: {
    automate: {
      transport: "stdio",
      command: process.execPath,
      args: [serverPath],
    },
  },
});

// ==========================================
// SHARED STATE
// ==========================================

let toolsPromise = null;
let cachedTools = null;
let closing = false;

// ==========================================
// GET MCP TOOLS
// ==========================================

export const getMcpTools = async () => {
  if (closing) {
    throw new Error("MCP adapter is shutting down.");
  }

  // Return cached tools if already discovered.
  if (cachedTools) {
    return cachedTools;
  }

  // Reuse ongoing discovery for concurrent requests.
  if (!toolsPromise) {
    toolsPromise = adapter.listTools()
      .then((tools) => {
        cachedTools = tools;

        console.log(
          "MCP tools loaded:",
          tools.map((tool) => tool.name)
        );

        return tools;
      })
      .catch((error) => {
        // Allow a future request to retry discovery.
        toolsPromise = null;
        cachedTools = null;

        console.error("MCP tool discovery failed:", error);

        throw error;
      });
  }

  return toolsPromise;
};

// ==========================================
// CLOSE MCP ADAPTER
// ==========================================

export const closeMcpAdapter = async () => {
  if (closing) return;

  closing = true;

  try {
    await adapter.close();

    console.log("MCP adapter closed successfully.");
  } catch (error) {
    console.error("MCP adapter shutdown error:", error);
    throw error;
  } finally {
    cachedTools = null;
    toolsPromise = null;
  }
};
