import React, { useState } from "react";
import { mastraClient } from "../../lib/mastra";

interface Message {
  role: "user" | "assistant";
  message: string;
}

const StreamChatWorkflow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Helper: Append or update the latest assistant message as streaming occurs
  const appendAssistantStream = (text: string) => {
    setMessages(prev => {
      // If last message is assistant, append to it
      if (prev.length > 0 && prev[prev.length - 1].role === "assistant") {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          message: updated[updated.length - 1].message + text,
        };
        return updated;
      } else {
        // Otherwise, add new assistant message
        return [...prev, { role: "assistant", message: text }];
      }
    });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = input;
    setMessages(prev => [...prev, { role: "user", message: userMessage }]);
    setInput("");
    setLoading(true);
    try {
      const agent = mastraClient.getAgent("weatherAgent");
      // Send all messages so far, user/assistant
      const response = await agent.stream({
        threadId: "conversation-123",
        resourceId: "user-pavan-chat-123", // Same user across different threads
        messages: [
          ...messages.map(m => ({ role: m.role, content: m.message })),
          { role: "user", content: userMessage },
        ],
      });
      await response.processDataStream({
        onTextPart: (text: string) => {
          appendAssistantStream(text);
        },
        onToolResultPart: (streamPart: any) => {
          console.log({streamPart});
          // Optionally handle tool result (not required for basic chat)
        },
        onFilePart: (file: any) => {
          // Optionally handle file part
        },
        onDataPart: (data: any) => {
          // Optionally handle data part
        },
        onErrorPart: (error: any) => {
          appendAssistantStream("[Error: " + String(error) + "]");
        },
        onToolCallPart: (toolCall: any) => {
          // Optionally handle tool call part
        },
      });
    } catch (err: any) {
      appendAssistantStream("[Error: " + String(err) + "]");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{ maxWidth: 500, margin: "40px auto", border: "1px solid #ddd", borderRadius: 8, padding: 24, background: "#fafbfc" }}>
      <h2>Stream Chat Workflow</h2>
      <div style={{ minHeight: 200, marginBottom: 16, background: "#fff", borderRadius: 4, padding: 12, boxShadow: "0 1px 2px #eee", overflowY: "auto" }}>
        {messages.length === 0 ? (
          <div style={{ color: "#888" }}>No messages yet. Start the conversation!</div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} style={{ marginBottom: 10, textAlign: msg.role === "user" ? "right" : "left" }}>
              <span style={{ fontWeight: "bold", color: msg.role === "user" ? "#1976d2" : "#388e3c" }}>{msg.role}:</span> {msg.message}
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
          style={{ flex: 1, padding: 8, borderRadius: 4, border: "1px solid #bbb" }}
        />
        <button disabled={loading} type="submit" style={{ padding: "8px 16px", borderRadius: 4, background: "#1976d2", color: "#fff", border: "none" }}>
          Send
        </button>
      </form>
    </div>
  );
};

export default StreamChatWorkflow;
