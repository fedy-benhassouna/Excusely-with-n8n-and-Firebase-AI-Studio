// src/ai/flows/generate-excuse.ts
'use server';

/**
 * @fileOverview Excuse generation flow based on user-provided context.
 *
 * - generateExcuse - A function to generate an excuse based on the provided context.
 * - GenerateExcuseInput - The input type for the generateExcuse function.
 * - GenerateExcuseOutput - The return type for the generateExcuse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateExcuseInputSchema = z.object({
  context: z.string().describe('The context or situation for which an excuse is needed.'),
});
export type GenerateExcuseInput = z.infer<typeof GenerateExcuseInputSchema>;

const GenerateExcuseOutputSchema = z.object({
  excuse: z.string().describe('The generated excuse based on the provided context.'),
});
export type GenerateExcuseOutput = z.infer<typeof GenerateExcuseOutputSchema>;

export async function generateExcuse(input: GenerateExcuseInput): Promise<GenerateExcuseOutput> {
  return generateExcuseFlow(input);
}

const generateExcusePrompt = ai.definePrompt(
  {
    name: 'generateExcusePrompt',
    input: {schema: GenerateExcuseInputSchema},
    output: {schema: GenerateExcuseOutputSchema},
    prompt: `You are an AI assistant specialized in generating excuses. Given the following context, generate a plausible and relevant excuse:

Context: {{{context}}}

Excuse:`
  }
);

const generateExcuseFlow = ai.defineFlow(
  {
    name: 'generateExcuseFlow',
    inputSchema: GenerateExcuseInputSchema,
    outputSchema: GenerateExcuseOutputSchema,
  },
  async (input: GenerateExcuseInput) => {
    const {output} = await generateExcusePrompt(input);
    if (!output) {
      // This case should ideally be handled, e.g. by throwing an error or returning a specific error structure.
      throw new Error('AI failed to generate an excuse.');
    }
    return output;
  }
);
