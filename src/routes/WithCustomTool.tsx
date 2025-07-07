import { mastraClient } from "@/lib/mastra";
import { useState } from "react";

export default function WithCustomTool() {
  const [color, setColor] = useState<string>("red");
  const [responseText, setResponseText] = useState<string>("");
  const [message, setMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const clientSideToolCallsMap: Record<string, any> = {
    changeColor: {
      id: "changeColor",
      description: "Changes the text color",
      inputSchema: {
        type: "object",
        properties: {
          color: { type: "string" },
        },
        required: ["color"],
      },
      execute: (props: { context: {color: string} }) => {
        setColor(props?.context?.color);
        return { success: true };
      },
    },
  };

  const handleStream = async ({ prompt = "" }: { prompt: string }) => {
    const agent = mastraClient.getAgent("browserAgent");
    const response = await agent.stream({
      messages: [{role: "user", content: prompt}],
      clientTools: clientSideToolCallsMap,
    });

    response.processDataStream({
      onToolCallPart: (part) => {
        const toolCall = clientSideToolCallsMap[part.toolName].execute(
          part.args
        );

        console.log("Tool Call", toolCall);
      },
      onToolResultPart: (part) => {
        console.log("Result", part);
      },
      onToolCallDeltaPart: (part) => {
        console.log("Delta", part);
      },
      onTextPart: (part: string) => {
        setResponseText((prev) => prev + part + "\n");
      },
    });
  };

  return (
    <div>
      <h1 style={{ color }}>With Custom Tool</h1>

      {responseText && (
        <div
          className="card"
          style={{
            marginTop: "1rem",
            padding: "1rem",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
          }}
        >
          <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{responseText}</p>
        </div>
      )}

      <div className="card" style={{ marginTop: "2rem" }}>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message..."
            style={{
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "100%",
            }}
          />
          <button
            onClick={() => {
              if (message.trim()) {
                setIsStreaming(true);
                setResponseText(""); // Clear previous response
                handleStream({ prompt: message })
                  .catch(console.error)
                  .finally(() => setIsStreaming(false));
              }
            }}
            disabled={isStreaming}
            style={{ minWidth: "100px" }}
          >
            {isStreaming ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
