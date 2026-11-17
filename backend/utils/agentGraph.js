import "dotenv/config";
import { ChatGroq } from "@langchain/groq";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";
import { ToolNode } from "@langchain/langgraph/prebuilt";

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

const systemPrompt= `
${agent.instructions || "You are agentFlow, a helpful personal assistant"}.

`

const chatNode = async (state) => {
  const response = await llm.invoke(state.messages);

  return {
    messages: [response],
  };
};

const toolNode= new ToolNode()

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