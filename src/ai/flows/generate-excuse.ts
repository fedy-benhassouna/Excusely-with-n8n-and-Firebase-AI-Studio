// src/ai/flows/generate-excuse.ts
'use server';

/**
 * @fileOverview Excuse generation flow using an external API.
 *
 * - generateExcuse - A function to generate an excuse by calling an external API.
 * - GenerateExcuseInput - The input type for the generateExcuse function.
 * - GenerateExcuseOutput - The return type for the generateExcuse function.
 */

import {z} from 'genkit'; // Genkit re-exports Zod, this was the existing import.

const GenerateExcuseInputSchema = z.object({
  context: z.string().describe('The context or situation for which an excuse is needed.'),
});
export type GenerateExcuseInput = z.infer<typeof GenerateExcuseInputSchema>;

const GenerateExcuseOutputSchema = z.object({
  excuse: z.string().describe('The generated excuse based on the provided context.'),
});
export type GenerateExcuseOutput = z.infer<typeof GenerateExcuseOutputSchema>;

const EXCUSE_API_URL = 'https://fedybenhassouna2.app.n8n.cloud/webhook-test/e2c1fc8a-9d68-4e56-99f7-d2c732cae006';

export async function generateExcuse(input: GenerateExcuseInput): Promise<GenerateExcuseOutput> {
  try {
    const response = await fetch(EXCUSE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ context: input.context }),
    });

    if (!response.ok) {
      let errorBody = 'No additional error information from API.';
      try {
        const text = await response.text();
        if (text) {
            errorBody = text;
        }
      } catch (e) {
        console.error("Failed to read error response body:", e);
      }
      throw new Error(`API request failed: ${response.status} ${response.statusText}. Details: ${errorBody}`);
    }

    // The API returns a JSON object like { "Excuse": "..." }
    // We need to transform it to match GenerateExcuseOutputSchema which expects { "excuse": "..." }
    const apiResponseData: any = await response.json();

    const transformedData = {
      excuse: apiResponseData?.Excuse // Access 'Excuse' (capital E) from API response
    };

    const parsedOutput = GenerateExcuseOutputSchema.safeParse(transformedData);
    if (parsedOutput.success) {
      return parsedOutput.data;
    } else {
      console.error(
        'Transformed API response did not match expected schema:', 
        parsedOutput.error, 
        'Original API data:', 
        apiResponseData,
        'Transformed data for parsing:',
        transformedData
      );
      throw new Error(`API response format is invalid after transformation: ${parsedOutput.error.message}`);
    }

  } catch (error) {
    console.error('Error calling excuse API or processing response:', error);
    if (error instanceof Error) {
      // Avoid double-wrapping if it's already a custom API error message
      if (!error.message.startsWith('API request failed') && !error.message.startsWith('API response format is invalid')) {
        throw new Error(`Failed to generate excuse: ${error.message}`);
      }
      throw error; // Re-throw the specific error
    }
    throw new Error('An unknown error occurred while generating excuse.');
  }
}
