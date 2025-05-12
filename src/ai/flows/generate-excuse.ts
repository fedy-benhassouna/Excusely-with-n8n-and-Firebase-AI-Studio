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

    // Handle successful response (2xx)
    const responseText = await response.text();
    if (!responseText) {
        // API returned 2xx but with an empty body
        console.error('API returned a successful status but with an empty response body.');
        throw new Error('API returned an empty response.');
    }

    let apiResponseData: any;
    try {
        apiResponseData = JSON.parse(responseText);
    } catch (parseError) {
        console.error('Failed to parse API response as JSON. Raw response text:', responseText, 'Parse error:', parseError);
        if (parseError instanceof SyntaxError) { // SyntaxError is the typical error for invalid JSON
             throw new Error(`API response is not valid JSON. Details: ${parseError.message}. Response (first 100 chars): ${responseText.substring(0, 100)}...`);
        }
        // For other errors during parsing, if any.
        throw new Error(`Failed to process API response. Response (first 100 chars): ${responseText.substring(0, 100)}...`);
    }
    

    // The API might return { "Excuse": "..." } or { "excuse": "..." }
    // We need to transform it to match GenerateExcuseOutputSchema which expects { "excuse": "..." }
    const transformedData = {
      excuse: apiResponseData?.Excuse || apiResponseData?.excuse
    };

    // Validate against Zod schema
    const parsedOutput = GenerateExcuseOutputSchema.safeParse(transformedData);
    if (parsedOutput.success) {
      // Ensure excuse is not null or undefined, and is a non-empty string
      if (parsedOutput.data.excuse && typeof parsedOutput.data.excuse === 'string' && parsedOutput.data.excuse.trim() !== '') {
        return parsedOutput.data;
      } else {
        console.error(
            'Transformed API response resulted in an empty or invalid excuse string.',
            'Original API data:', apiResponseData,
            'Transformed data for parsing:', transformedData
        );
        throw new Error('API returned an empty or invalid excuse.');
      }
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
    console.error('Error in generateExcuse function:', error);
    if (error instanceof Error) {
      // Avoid double-wrapping specific, informative error messages thrown above.
      if (
        error.message.startsWith('API request failed') ||
        error.message.startsWith('API returned an empty response') ||
        error.message.startsWith('API response is not valid JSON') ||
        error.message.startsWith('Failed to process API response') ||
        error.message.startsWith('API response format is invalid after transformation') ||
        error.message.startsWith('API returned an empty or invalid excuse')
      ) {
        throw error; // Re-throw the specific error as is
      }
      // For other generic errors, wrap them
      throw new Error(`Failed to generate excuse: ${error.message}`);
    }
    // Fallback for non-Error objects thrown
    throw new Error('An unknown error occurred while generating excuse.');
  }
}
