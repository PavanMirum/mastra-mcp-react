import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

/**
 * Singleton instance of the OpenAI compatible provider
 */
let providerInstance: ReturnType<typeof createOpenAICompatible> | null = null;

/**
 * Creates or returns the existing singleton instance of the provider
 * @returns The OpenAI compatible provider instance
 */
export const createVMLProvider = () => {
  if (providerInstance) return providerInstance;

  if (!process.env.VML_AI_GATEWAY_URL || !process.env.VML_AI_GATEWAY_KEY) {
    throw new Error('Missing env vars: VML_AI_GATEWAY_URL and VML_AI_GATEWAY_KEY');
  }

  providerInstance = createOpenAICompatible({
    baseURL: process.env.VML_AI_GATEWAY_URL,
    apiKey: process.env.VML_AI_GATEWAY_KEY,
    name: 'vml',
  });

  return providerInstance;
};