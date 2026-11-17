
import { HumanMessage } from "@langchain/core/messages";
import chatGraph from "../utils/chatGraph.js";

export const chatAgent = async (req, res) => {
  try {
    const { message } = req.body;

    // Validate message
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    // Authenticated user's ID
    const threadId = String(req.user._id);

    // Invoke LangGraph
    const data = await chatGraph.invoke(
      {
        messages: [new HumanMessage(message.trim())],
      },
      {
        configurable: {
          thread_id: threadId,
        },
      }
    );

    // Get AI response
    const lastMessage = data.messages[data.messages.length - 1];

    return res.status(200).json({
      success: true,
      aiMessage: lastMessage.content,
    });

  } catch (error) {
    console.error("Chat Agent Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while processing your message.",
    });
  }
};


// Get all messages from the current user's conversation
export const getAllChats = async (req, res) => {
  try {
    const threadId = String(req.user._id);

    const state = await chatGraph.getState({
      configurable: {
        thread_id: threadId,
      },
    });

    const messages = state.values?.messages || [];

    const formattedMessages = messages.map((message, index) => ({
      id: message.id || `${threadId}-${index}`,
      role:
        message.getType?.() === "human"
          ? "user"
          : message.getType?.() === "ai"
            ? "assistant"
            : "system",
      content: message.content,
    }));

    return res.status(200).json({
      success: true,
      messages: formattedMessages,
    });
  } catch (error) {
    console.error("Get All Chats Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve chat history.",
    });
  }
};