import React, { useState, useEffect } from "react";
import { Message, useChatMemory } from "../contexts/ChatMemoryContext";
import { mastraClient } from "../../lib/mastra";
import { v4 as uuidv4 } from "uuid";

const StreamMemChat: React.FC = () => {
  const [input, setInput] = useState("");
  const [resourceId, setResourceId] = useState<string>("");
  const { 
    messages, 
    addMessage, 
    updateMessage,
    threadId, 
    isLoading, 
    setLoading 
  } = useChatMemory();

  // Initialize resource ID on component mount
  useEffect(() => {
    // Try to get existing resource ID from localStorage, or create a new one
    const storedResourceId = localStorage.getItem('chatResourceId') || `user-${uuidv4()}`;
    setResourceId(storedResourceId);
    localStorage.setItem('chatResourceId', storedResourceId);
  }, []);

  // Helper: Append or update the latest assistant message as streaming occurs
  const appendAssistantStream = (messageId: string, text: string) => {
    if (!messageId) {
      console.error('No message ID provided for assistant stream');
      return;
    }

    console.log({messageId, text});
    updateMessage(messageId, {
      content: text
    });
  };

//   // Helper: Append or update the latest assistant message as streaming occurs
//   const appendAssistantStream = (text: string) => {
//     const lastMessage = messages[messages.length - 1];
//     if (lastMessage?.sender === 'agent') {
//       // Remove the last message and add a new one with the updated content
//       const updatedMessages = messages.slice(0, -1);
//       addMessage(lastMessage.content + text, 'agent');
//     } else {
//       addMessage(text, 'agent');
//     }
//   };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !resourceId) return;
    
    // const userMessage = input;
     
    const userMessage = {
        id: uuidv4(),
        content: input,
        sender: 'user' as const,
        // timestamp: new Date().toISOString()
    } as unknown as Message;
      
      const assistantMessage = {
          id: uuidv4(),
          content: '',
          sender: 'agent' as const,
        //   timestamp: new Date().toISOString()
      } as unknown as Message;

      // Add user message and empty assistant message
    addMessage(userMessage);
    addMessage(assistantMessage);
    setInput("");
    setLoading(true);

    // addMessage(userMessage, 'user');
    
    try {
      const agent = mastraClient.getAgent("weatherAgent");
      const response = await agent.stream({
        resourceId,  // Attach the unique resource ID
        threadId,    // Current thread ID
        // messages: [
        //   ...messages.map(m => ({ 
        //     role: m.sender as 'user' | 'assistant', 
        //     content: m.content 
        //   })),
        //   { role: "user" as const, content: userMessage },
        // ],
        messages: [{ role: "user" as const, content: input, id: userMessage.id }]
      });
      
      await response.processDataStream({
        onTextPart: (text: string) => {
        //   appendAssistantStream(text);
        if (assistantMessage?.id) {
            appendAssistantStream(assistantMessage.id, text);
          }
        },
        onToolResultPart: (streamPart: any) => {
          console.log({streamPart});
          // Handle tool results if needed
        },
        onFilePart: (file: any) => {
          // Handle file parts if needed
        },
        onDataPart: (data: any) => {
          // Handle data parts if needed
        },
        onErrorPart: (error: any) => {
        //   appendAssistantStream(`[Error: ${error.message || 'An error occurred'}]`);
          console.error('Stream error:', error);
          if (assistantMessage?.id) {
            updateMessage(assistantMessage.id, {
              content: `[Error: ${error.message || 'An error occurred'}]`
            });
          }
        }
      });
    } catch (err: any) {
      console.error("Error sending message:", err);
    //   addMessage(`Error: ${err.message || 'Failed to send message'}`, 'agent');
      if (assistantMessage?.id) {
        updateMessage(assistantMessage.id, {
          content: `[Error: ${err.message || 'Failed to send message'}]`
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: "20px" }}>
      <h2>Memory Chat</h2>
      <div style={{ marginBottom: '10px' }}>
        <div>Resource ID: <code>{resourceId}</code></div>
        <div>Thread ID: <code>{threadId}</code></div>
      </div>
      <div style={{ 
        minHeight: 300, 
        border: "1px solid #ddd", 
        borderRadius: 8, 
        padding: 16, 
        marginBottom: 16,
        overflowY: "auto" 
      }}>
        {messages.length === 0 ? (
          <div style={{ color: "#666" }}>Start a conversation...</div>
        ) : (
          messages.map((msg, idx) => (
            <div 
              key={idx} 
              style={{ 
                margin: "8px 0",
                textAlign: msg.sender === "user" ? "right" : "left"
              }}
            >
              <div style={{ 
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: 8,
                background: msg.sender === "user" ? "#e3f2fd" : "#f5f5f5",
                maxWidth: "80%"
              }}>
                <div style={{ 
                  fontWeight: "bold", 
                  color: msg.sender === "user" ? "#1976d2" : "#388e3c" 
                }}>
                  {msg.sender}
                </div>
                <div>{msg.content}</div>
              </div>
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleSend} style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{ 
            flex: 1, 
            padding: "10px 12px", 
            borderRadius: 4, 
            border: "1px solid #ccc" 
          }}
          disabled={isLoading}
        />
        <button 
          type="submit" 
          disabled={isLoading}
          style={{ 
            padding: "10px 20px", 
            background: "#1976d2", 
            color: "white", 
            border: "none", 
            borderRadius: 4,
            cursor: "pointer"
          }}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default StreamMemChat;