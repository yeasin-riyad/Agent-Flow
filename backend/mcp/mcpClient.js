
import { MCPAdapter } from "@langchain/mcp-adapters";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MCP Server path
const serverPath = path.join(__dirname, "server.js");

// MCP Client Adapter
const adapter = new MCPAdapter({
  servers: {
    automate: {
      transport: "stdio",
      command: process.execPath,
      args: [serverPath],
    },
  },
});

// Get MCP Tools
export const getMcpTools = async () => {
  try {
    const tools = await adapter.listTools();

    return tools;
  } catch (error) {
    console.error("Failed to load MCP tools:", error);
    throw error;
  }
};
