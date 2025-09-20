'use server';

/**
 * @fileOverview Generates an empathetic and personalized response based on the user's daily check-in.
 *
 * - empatheticResponseToDailyCheckin - A function that generates an empathetic response.
 * - EmpatheticResponseToDailyCheckinInput - The input type for the empatheticResponseToDailyCheckin function.
 * - EmpatheticResponseToDailyCheckinOutput - The return type for the empatheticResponseToDailyCheckin function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EmpatheticResponseToDailyCheckinInputSchema = z.object({
  mood: z.string().describe('The mood of the user reported in the daily check-in.'),
  feelings: z.string().describe('The specific feelings the user is experiencing.'),
  details: z.string().optional().describe('Additional details about the user\'s day, if provided.'),
});
export type EmpatheticResponseToDailyCheckinInput = z.infer<typeof EmpatheticResponseToDailyCheckinInputSchema>;

const EmpatheticResponseToDailyCheckinOutputSchema = z.object({
  response: z.string().describe('An empathetic and personalized response to the user\'s daily check-in.'),
});
export type EmpatheticResponseToDailyCheckinOutput = z.infer<typeof EmpatheticResponseToDailyCheckinOutputSchema>;

export async function empatheticResponseToDailyCheckin(input: EmpatheticResponseToDailyCheckinInput): Promise<EmpatheticResponseToDailyCheckinOutput> {
  return empatheticResponseToDailyCheckinFlow(input);
}

const prompt = ai.definePrompt({
  name: 'empatheticResponseToDailyCheckinPrompt',
  input: {schema: EmpatheticResponseToDailyCheckinInputSchema},
  output: {schema: EmpatheticResponseToDailyCheckinOutputSchema},
  prompt: `You are an AI assistant designed to provide empathetic and personalized responses to youth based on their daily check-in.

  Here is the information from their check-in:
  Mood: {{{mood}}}
  Feelings: {{{feelings}}}
  Details: {{{details}}}

  Based on this information, craft a supportive and understanding response. Acknowledge their feelings and offer encouragement.
  Keep the response concise and easy to understand.
  The response should be in first person.
  Do not include any questions in the response.  Do not include any links or references to external resources.
  The response should be no more than 5 sentences.
  `,
});

const empatheticResponseToDailyCheckinFlow = ai.defineFlow(
  {
    name: 'empatheticResponseToDailyCheckinFlow',
    inputSchema: EmpatheticResponseToDailyCheckinInputSchema,
    outputSchema: EmpatheticResponseToDailyCheckinOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
