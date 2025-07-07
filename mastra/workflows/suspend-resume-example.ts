import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';

// Step 1: Initial step
const startStep = createStep({
  id: 'start',
  description: 'Initial step that starts the workflow',
  inputSchema: z.object({}),
  outputSchema: z.object({
    message: z.string(),
  }),
  async execute() {
    return { message: 'Workflow started. Waiting for user input...' };
  },
});

// Step 2: Await user input
const userInputStep = createStep({
  id: 'user-input',
  description: 'Suspends workflow and waits for user input',
  inputSchema: startStep.outputSchema,
  resumeSchema: z.object({
    userValue: z.string().describe('Input provided by the user'),
  }),
  outputSchema: z.object({
    confirmation: z.string(),
  }),
  async execute({ inputData, resumeData, suspend }) {
    // This code runs after the workflow resumes.
    // resumeData is guaranteed to be valid against resumeSchema.

    if (!(resumeData ?? {}).userValue) {
        await suspend({});
        return { confirmation: "Please provide a user input.." };
    }
  
    return {
      confirmation: `Received user input: '${resumeData?.userValue}'. The previous step said: '${inputData.message}'`,
    };
  },
});

// Step 3: Final step after resume
const finalStep = createStep({
  id: 'final',
  description: 'Final step after user input is received',
  inputSchema: userInputStep.outputSchema,
  outputSchema: z.object({
    result: z.string(),
  }),
  async execute({ inputData }) {
    return { result: `Workflow complete! Confirmation: ${inputData.confirmation}` };
  },
});

// Assemble the workflow
const suspendResumeWorkflow = createWorkflow({
  id: 'suspend-resume-example',
  description: 'A workflow demonstrating suspend and resume with user input',
  inputSchema: z.object({}),
  outputSchema: finalStep.outputSchema,
})
  .then(startStep)
  .then(userInputStep)
  .then(finalStep).commit();

suspendResumeWorkflow.commit();

export { suspendResumeWorkflow };
