import React, { useState } from "react";
import { mastraClient } from "../../lib/mastra";

interface Message {
  role: "user" | "assistant";
  message: string;
}

const SuspendResumeWorkflowPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [suspended, setSuspended] = useState<any>(null);
  const [runId, setRunId] = useState<string | null>(null);
  const [userInput, setUserInput] = useState("");

  const handleStart = async () => {
    setLoading(true);
    setMessages([{ role: "assistant", message: "Starting workflow..." }]);
    try {
      const workflow = mastraClient.getWorkflow("suspendResumeWorkflow");
      const { runId } = await workflow.createRun();
      setRunId(runId);
      const response: any = await workflow.startAsync({ runId, inputData: {} });

      if (response.status === 'suspended') {
        setSuspended(response?.suspended?.[0]);
        setMessages(prev => [...prev, { role: "assistant", message: "Workflow suspended. Please provide input:" }]);
      } else if (response.status === 'success') {
        setMessages(prev => [...prev, { role: "assistant", message: `Workflow completed with result: ${JSON.stringify(response.result)}` }]);
      }
    } catch (err: any) {
      setMessages(prev => [...prev, { role: "assistant", message: `[Error: ${String(err)}]` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || !runId) return;
    setLoading(true);
    setMessages(prev => [...prev, { role: "user", message: userInput }]);
    try {
      const workflow = mastraClient.getWorkflow("suspendResumeWorkflow");
      const response: any = await workflow.resumeAsync({ runId, step: suspended, resumeData: { userValue: userInput } });

      console.log({response});
      console.log(JSON.stringify(response, null, 2));
      if (response.status === 'success') {
        setMessages(prev => [...prev, { role: "assistant", message: `${JSON.stringify(response.result)}` }]);
      }
      setSuspended(null);
      setUserInput("");
    } catch (err: any) {
      setMessages(prev => [...prev, { role: "assistant", message: `[Error: ${String(err)}]` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", border: "1px solid #ddd", borderRadius: 8, padding: 24, background: "#fafbfc" }}>
      <h2>Suspend/Resume Workflow</h2>
      <div style={{ minHeight: 200, marginBottom: 16, background: "#fff", borderRadius: 4, padding: 12, boxShadow: "0 1px 2px #eee", overflowY: "auto" }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: 10, textAlign: msg.role === "user" ? "right" : "left" }}>
            <span style={{ fontWeight: "bold", color: msg.role === "user" ? "#1976d2" : "#388e3c" }}>{msg.role}:</span> {msg.message}
          </div>
        ))}
      </div>
      {!runId && <button onClick={handleStart} disabled={loading}>Start Workflow</button>}
      {suspended && (
        <form onSubmit={handleResume} style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            placeholder="Enter value to resume..."
            style={{ flex: 1, padding: 8, borderRadius: 4, border: "1px solid #bbb" }}
          />
          <button disabled={loading} type="submit" style={{ padding: "8px 16px", borderRadius: 4, background: "#1976d2", color: "#fff", border: "none" }}>
            Resume
          </button>
        </form>
      )}
    </div>
  );
};

export default SuspendResumeWorkflowPage;
