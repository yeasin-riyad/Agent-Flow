import { ChatGroq } from "@langchain/groq";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";
import { MongoClient } from "mongodb";

const llm = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0,
  maxRetries: 2,
});

// MongoDB connection
const client = new MongoClient(process.env.MONGODB_URI);

const checkpointer = new MongoDBSaver({
  client,
  dbName: "langgraph",
});

// Chat node
const chatNode = async (state) => {
  const response = await llm.invoke(state.messages);

  return {
    messages: [response],
  };
};

// Build workflow
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("chatNode", chatNode)
  .addEdge("__start__", "chatNode")
  .addEdge("chatNode", "__end__");

// Compile graph with persistent memory
const chatGraph = workflow.compile({
  checkpointer,
});

export default chatGraph;