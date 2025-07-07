import { useState } from 'react';
import { mastraClient } from "../../lib/mastra";

export default function WeatherStream() {
  const [city, setCity] = useState('');
  const [result, setResult] = useState('');   
  const [jsonResult, setJsonResult] = useState({});   

  const handleSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const agent = mastraClient.getAgent("weatherAgent");
    const response = await agent.stream({
        // threadId: "conversation-123",
        // resourceId: "user-pavan-456", // Same user across different threads
        messages: [{ role: "user", content: `What's the weather like in ${city}?` }],
    });
    response.processDataStream({
      onToolResultPart(streamPart) {
        setJsonResult(streamPart.result);
      },
      onTextPart: (text) => {
        setResult((prev) => prev + text);
      },
      onFilePart: (file) => {
        console.log({file});
      },
      onDataPart: (data) => {
        console.log({data});
      },
      onErrorPart: (error) => {
        console.error({error});
      },
      onToolCallPart: (toolCall) => console.log('Tool called:', toolCall.toolName),
    });
}

  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        textAlign: 'center',
      }}
    >
      <h1>Weather Checker with Stream</h1>
      <form onSubmit={handleSubmitForm} style={{ marginTop: '1rem' }}>
        <label htmlFor="city" style={{ marginRight: '0.5rem' }}>
          Enter city name you want to check the weather for
        </label>
        <input
          id="city"
          name='city'
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{ padding: '0.5rem', fontSize: '1rem' }}
        />
        <button
          type="submit"
          style={{ marginLeft: '0.5rem', padding: '0.5rem 1rem', fontSize: '1rem' }}
        >
          Submit
        </button>
        <button
          type="button"
          onClick={() => {
            setCity('');
            setResult('');
          }}
          style={{ marginLeft: '0.5rem', padding: '0.5rem 1rem', fontSize: '1rem' }}
        >
          Clear
        </button>
      </form>
      {result && <p style={{ marginTop: '1rem' }}>
        {result}
      </p>}
      {Object.keys(jsonResult).length > 0 && <p style={{ marginTop: '1rem' }}>
        {JSON.stringify(jsonResult)}
      </p>}
    </section>
  );
}
