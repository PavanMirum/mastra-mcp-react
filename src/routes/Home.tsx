import { useState } from 'react';
// import { mastraClient } from "../../lib/mastra";
import { generateWeatherWithCity } from "../services/weatherService/generateText";

export default function Home() {
  const [city, setCity] = useState<string>('');
  const [result, setResult] = useState<string>('');   

const handleSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // const agent = mastraClient.getAgent("weatherAgent");
    // const response = await agent.generate({
    //     messages: [{ role: "user", content: `What's the weather like in ${city}?` }]
    // });
    const response = await generateWeatherWithCity(city);
    setResult(response);
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
      <h1>Weather Checker Generate with Client</h1>
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
      {result && <p style={{ marginTop: '1rem' }}>{result}</p>}
    </section>
  );
}
