import { useState } from 'react';
import { mastraClient } from '../../lib/mastra';
import { WorkflowWatchResult } from '@mastra/client-js';

export default function GenerateWorkflow() {
  const [city, setCity] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setResult('');
    try {
      const workflow = mastraClient.getWorkflow('weatherWorkflow'); // fixed ID
      const { runId } = await workflow.createRun();
      // Start the workflow with a city
      // This will fetch weather and plan activities based on conditions
      const workflowResult = await workflow.startAsync({ runId, inputData: { city } });

      // workflow.watch({runId}, (record: WorkflowWatchResult) => {
      //   if (record.payload?.workflowState?.status === 'success') {
      //     console.log('Workflow completed');
      //     console.log(record.payload?.workflowState?.result);
      //     console.log(record.payload?.workflowState?.payload);
      //   }
      // });

      console.log({workflowResult}, { depth: null });
      if (workflowResult?.status === 'success') {
        setResult(
          typeof workflowResult?.result === 'string'
            ? workflowResult?.result
            : workflowResult?.result.activities
        );
      } else {
        setError('Workflow failed');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to start workflow');
    } finally {
      setLoading(false);
    }
  };

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
      <h1>Generate Weather Workflow to plan activities</h1>
      <form onSubmit={handleSubmitForm} style={{ marginTop: '1rem' }}>
        {loading && <div style={{ margin: '1rem', color: 'blue' }}>Running workflow...</div>}
        {error && <div style={{ margin: '1rem', color: 'red' }}>{error}</div>}
        {result && (
          <pre style={{ margin: '1rem', color: 'green', textAlign: 'left', maxWidth: 600 }}>
            {result}
          </pre>
        )}
        <label htmlFor="city" style={{ marginRight: '0.5rem' }}>
          Enter your city name
        </label>
        <input
          id="city"
          name="city"
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{ padding: '0.5rem', fontSize: '1rem' }}
        />
        <button
          type="submit"
          disabled={loading}
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
    </section>
  );
}
