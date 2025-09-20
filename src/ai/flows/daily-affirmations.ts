'use server';

/**
 * @fileOverview A flow for generating daily affirmations for youth.
 *
 * - generateAffirmation - A function that generates an encouraging affirmation.
 * - GenerateAffirmationInput - The input type for the generateAffirmation function.
 * - GenerateAffirmationOutput - The return type for the generateAffirmation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAffirmationInputSchema = z.object({
  mood: z
    .string()
    .optional()
    .describe('The current mood of the user, can be positive or negative.'),
});
export type GenerateAffirmationInput = z.infer<typeof GenerateAffirmationInputSchema>;

const GenerateAffirmationOutputSchema = z.object({
  affirmation: z.string().describe('An encouraging and supportive affirmation.'),
});
export type GenerateAffirmationOutput = z.infer<typeof GenerateAffirmationOutputSchema>;

export async function generateAffirmation(
  input: GenerateAffirmationInput
): Promise<GenerateAffirmationOutput> {
  return generateAffirmationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAffirmationPrompt',
  input: {schema: GenerateAffirmationInputSchema},
  output: {schema: GenerateAffirmationOutputSchema},
  prompt: `You are a mental wellness assistant for youths, skilled at providing encouraging and supportive affirmations.

  Based on the user's current mood, generate a personalized affirmation to uplift and motivate them. The affirmation should be short, positive, and relevant to the user's potential emotional state.

  Mood: {{{mood}}}

  Affirmation:`,
});

const generateAffirmationFlow = ai.defineFlow(
  {
    name: 'generateAffirmationFlow',
    inputSchema: GenerateAffirmationInputSchema,
    outputSchema: GenerateAffirmationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
