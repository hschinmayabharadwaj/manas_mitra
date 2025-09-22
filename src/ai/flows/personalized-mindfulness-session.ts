'use server';

/**
 * @fileOverview Generates personalized mindfulness sessions based on user preferences and current state.
 *
 * - generateMindfulnessSession - A function that creates customized mindfulness content.
 * - PersonalizedMindfulnessSessionInput - The input type for the generateMindfulnessSession function.
 * - PersonalizedMindfulnessSessionOutput - The return type for the generateMindfulnessSession function.
 */

import { ai } from '@/ai/genkit'; // Import ai from the local genkit.ts file
import * as z from 'zod'; // If z comes from zod, not genkit

// Initialize the AI instance
const PersonalizedMindfulnessSessionInputSchema = z.object({
  mood: z
    .string()
    .describe('The current mood of the user (e.g., anxious, stressed, calm, sad, excited)'),
  sessionType: z
    .enum(['breathing', 'meditation', 'body-scan', 'mindful-moment'])
    .describe('The type of mindfulness session requested'),
  duration: z
    .number()
    .min(1)
    .max(30)
    .describe('Duration of the session in minutes'),
  experience: z
    .enum(['beginner', 'intermediate', 'advanced'])
    .optional()
    .describe('User experience level with mindfulness practices'),
});
export type PersonalizedMindfulnessSessionInput = z.infer<
  typeof PersonalizedMindfulnessSessionInputSchema
>;

const PersonalizedMindfulnessSessionOutputSchema = z.object({
  title: z.string().describe('A personalized title for the mindfulness session'),
  description: z.string().describe('A brief description of what the session will help with'),
  instructions: z.array(z.string()).describe('Step-by-step instructions for the session'),
  guidance: z.array(z.object({
    timeMarker: z.string().describe('When to say this during the session (e.g., "0:30", "2:00")'),
    text: z.string().describe('Calming guidance text to read at this time'),
  })).describe('Timed guidance phrases for the session'),
  benefits: z.array(z.string()).describe('Expected benefits of completing this session'),
});
export type PersonalizedMindfulnessSessionOutput = z.infer<
  typeof PersonalizedMindfulnessSessionOutputSchema
>;

export async function generateMindfulnessSession(
  input: PersonalizedMindfulnessSessionInput
): Promise<PersonalizedMindfulnessSessionOutput> {
  return personalizedMindfulnessSessionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedMindfulnessSessionPrompt',
  input: {schema: PersonalizedMindfulnessSessionInputSchema},
  output: {schema: PersonalizedMindfulnessSessionOutputSchema},
  prompt: `You are a skilled mindfulness instructor creating a personalized session for a youth experiencing {{{mood}}} feelings.

Create a {{{duration}}}-minute {{{sessionType}}} session that is appropriate for someone with {{#if experience}}{{{experience}}}{{else}}beginner{{/if}} experience level.

Guidelines:
- Use gentle, encouraging language appropriate for young people
- Tailor the session to help with the specific mood: {{{mood}}}
- Create timed guidance that flows naturally throughout the {{{duration}}} minutes
- For breathing exercises, include specific breathing patterns and counts
- For meditation, focus on simple techniques like breath awareness or loving-kindness
- For body-scan, guide systematically through different body parts
- For mindful-moment, create present-moment awareness activities

The session should feel supportive, non-judgmental, and accessible to youth who may be new to mindfulness.`,
});

const personalizedMindfulnessSessionFlow = ai.defineFlow(
  {
    name: 'personalizedMindfulnessSessionFlow',
    inputSchema: PersonalizedMindfulnessSessionInputSchema,
    outputSchema: PersonalizedMindfulnessSessionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);