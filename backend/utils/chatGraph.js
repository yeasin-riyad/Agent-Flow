import "dotenv/config";
import { ChatGroq } from "@langchain/groq";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";
import { MongoClient } from "mongodb";

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

const chatNode = async (state) => {
  const response = await llm.invoke(state.messages);

  return {
    messages: [response],
  };
};

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("chatNode", chatNode)
  .addEdge("__start__", "chatNode")
  .addEdge("chatNode", "__end__");

const chatGraph = workflow.compile({
  checkpointer,
});

export default chatGraph;