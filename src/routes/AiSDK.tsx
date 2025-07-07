import { useChat } from '@ai-sdk/react';

export default function AiSDK() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
      api: 'http://localhost:4111/api/agents/weatherAgent/stream',
      onToolCall: (toolCall) => {
        console.log({toolCall});
      },
      onResponse: (response) => {
        console.log({response});
      },
      onFinish: (finish) => {
        console.log({finish});
      },
      onError: (error) => {
        console.log({error});
      },
    });

    return (
      <div>
        <h1>Weather Stream with Ai SDK Hook - useChat</h1>
        {messages.map(m => (
          <div key={m.id}>
            {m.role}: {m.content}
          </div>
        ))}
        <form onSubmit={handleSubmit}>
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Say something..."
          />
        </form>
      </div>
    );
}
