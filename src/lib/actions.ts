'use server';

import {
  generateAffirmation,
  type GenerateAffirmationInput,
} from '@/ai/flows/daily-affirmations';
import {
  empatheticResponseToDailyCheckin,
  type EmpatheticResponseToDailyCheckinInput,
} from '@/ai/flows/empathetic-response-to-daily-checkin';
import {
  contextualResourceRecommendation
} from '@/ai/flows/contextual-resource-recommendation';

export async function getAffirmation(input: GenerateAffirmationInput) {
  const { affirmation } = await generateAffirmation(input);
  return affirmation;
}

export async function getCheckInResponse(
  input: EmpatheticResponseToDailyCheckinInput & { checkInData: string }
) {
  const { checkInData, ...empatheticInput } = input;
  const [empatheticResponse, resourceRecommendation] = await Promise.all([
    empatheticResponseToDailyCheckin(empatheticInput),
    contextualResourceRecommendation({ checkInData }),
  ]);
  return {
    response: empatheticResponse.response,
    recommendation: resourceRecommendation.resourceRecommendation,
  };
}
