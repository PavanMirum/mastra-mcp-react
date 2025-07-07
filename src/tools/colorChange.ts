import { createTool } from "@mastra/core";
import { z } from 'zod';

  export const colorChangeTool = createTool({
    id: 'changeColor',
    description: 'Changes the background color',
    inputSchema: z.object({
      color: z.string(),
    }),
    execute: async ({ context }) => {
      document.body.style.backgroundColor = context.color;
      return { success: true };
    },
  });
