'use server';
/**
 * @fileOverview Provides contextual recommendations for wellness resources based on user check-in data.
 *
 * - contextualResourceRecommendation - A function that generates resource recommendations.
 * - ContextualResourceRecommendationInput - The input type for the contextualResourceRecommendation function.
 * - ContextualResourceRecommendationOutput - The return type for the contextualResourceRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContextualResourceRecommendationInputSchema = z.object({
  checkInData: z
    .string()
    .describe(
      'A string containing the youth\'s check-in data, including mood and feelings.'
    ),
});
export type ContextualResourceRecommendationInput = z.infer<
  typeof ContextualResourceRecommendationInputSchema
>;

const ContextualResourceRecommendationOutputSchema = z.object({
  resourceRecommendation: z.string().describe('A recommendation for a relevant wellness resource.'),
});
export type ContextualResourceRecommendationOutput = z.infer<
  typeof ContextualResourceRecommendationOutputSchema
>;

export async function contextualResourceRecommendation(
  input: ContextualResourceRecommendationInput
): Promise<ContextualResourceRecommendationOutput> {
  return contextualResourceRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contextualResourceRecommendationPrompt',
  input: {schema: ContextualResourceRecommendationInputSchema},
  output: {schema: ContextualResourceRecommendationOutputSchema},
  prompt: `Based on the youth's check-in data: {{{checkInData}}}, recommend a relevant wellness resource and explain why it would be helpful.`,
});

const contextualResourceRecommendationFlow = ai.defineFlow(
  {
    name: 'contextualResourceRecommendationFlow',
    inputSchema: ContextualResourceRecommendationInputSchema,
    outputSchema: ContextualResourceRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
