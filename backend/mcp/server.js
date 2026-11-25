import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";
import { TavilySearch } from "@langchain/tavily";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const tavilySearch = new TavilySearch({
  maxResults: 5,
  topic: "general",
});

const createMcpServer = () => {
  const server = new McpServer({
    name: "agent-flow-mcp-server",
    version: "1.0.0",
  });

  server.registerTool(
    "web_search",
    {
      description:
        "Search the web for current information, tutorials, and news.",

      inputSchema: z.object({
        query: z.string().min(1).describe("Search query"),
      }),
    },

    async ({ query }) => {
      try {
        const result = await tavilySearch.invoke({ query });

        return {
          content: [
            {
              type: "text",
              text:
                typeof result === "string"
                  ? result
                  : JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        console.error("Web search error:", error);

        return {
          content: [
            {
              type: "text",
              text: "Web search failed. Please try again.",
            },
          ],
          isError: true,
        };
      }
    }
  );

  return server;
};

// Start MCP Server
serveStdio(createMcpServer);

console.error("AgentFlow MCP Server started successfully.");
