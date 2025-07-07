
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';

import { weatherAgent } from './agents/weather-agent';
import { browserAgent } from './agents/browser-agent';
import { personalAssistantAgent } from './agents/memory-agent';
import { weatherWorkflow } from './workflows/weather-workflow';
import { suspendResumeWorkflow } from './workflows/suspend-resume-example';

export const mastra = new Mastra({
  agents: { weatherAgent, browserAgent, personalAssistantAgent },
  workflows: { weatherWorkflow, suspendResumeWorkflow },
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
