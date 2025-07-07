import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { createVMLProvider } from '../provider';
import { LibSQLStore } from '@mastra/libsql';

const vml = createVMLProvider();

export const browserAgent = new Agent({
    name: 'Test Agent',
    instructions: 'You are a browser client agent. You execute tools in the browser.',
    model: vml('us.anthropic.claude-sonnet-4-20250514-v1:0'),
    memory: new Memory({
        storage: new LibSQLStore({
          url: 'file:../mastra.db', // path is relative to the .mastra/output directory
        }),
      }),
  });