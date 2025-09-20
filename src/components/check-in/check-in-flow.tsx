'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { getCheckInResponse } from '@/lib/actions';
import { useCheckIns } from '@/lib/hooks/use-check-ins';
import { ArrowLeft, Loader2, Sparkles, BookOpen } from 'lucide-react';
import { type Mood, type Feeling } from '@/lib/types';
import Link from 'next/link';

const moods: Mood[] = [
  { name: 'Happy', emoji: '😄' },
  { name: 'Okay', emoji: '🙂' },
  { name: 'Sad', emoji: '😢' },
  { name: 'Anxious', emoji: '😟' },
  { name: 'Angry', emoji: '😠' },
];

const feelings: Feeling[] = [
  'Grateful',
  'Stressed',
  'Lonely',
  'Optimistic',
  'Tired',
  'Motivated',
  'Overwhelmed',
  'Peaceful',
];

type AIResponseType = {
    response: string;
    recommendation: string;
} | null;

export function CheckInFlow() {
  const [step, setStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedFeelings, setSelectedFeelings] = useState<Feeling[]>([]);
  const [details, setDetails] = useState('');
  const [aiResponse, setAiResponse] = useState<AIResponseType>(null);
  const [isPending, startTransition] = useTransition();
  const { addCheckIn } = useCheckIns();

  const handleFeelingToggle = (feeling: Feeling) => {
    setSelectedFeelings((prev) =>
      prev.includes(feeling)
        ? prev.filter((f) => f !== feeling)
        : [...prev, feeling]
    );
  };

  const handleSubmit = () => {
    if (!selectedMood) return;

    startTransition(async () => {
      const checkInDataString = `Mood: ${selectedMood.name}. Feelings: ${selectedFeelings.join(', ')}. Details: ${details}`;
      const response = await getCheckInResponse({
        mood: selectedMood.name,
        feelings: selectedFeelings.join(', '),
        details: details,
        checkInData: checkInDataString,
      });
      setAiResponse(response);

      addCheckIn({
        mood: selectedMood.name,
        feelings: selectedFeelings,
        details: details,
      });
      setStep(4);
    });
  };

  const resetFlow = () => {
    setStep(1);
    setSelectedMood(null);
    setSelectedFeelings([]);
    setDetails('');
    setAiResponse(null);
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-center font-headline">How are you feeling right now?</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 sm:grid-cols-5 gap-4">
              {moods.map((mood) => (
                <button
                  key={mood.name}
                  onClick={() => {
                    setSelectedMood(mood);
                    setStep(2);
                  }}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-transparent hover:border-primary hover:bg-primary/10 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <span className="text-5xl">{mood.emoji}</span>
                  <span className="font-medium">{mood.name}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        );
      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">What's contributing to this feeling?</CardTitle>
              <CardDescription>Select all that apply.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {feelings.map((feeling) => (
                <Button
                  key={feeling}
                  variant={selectedFeelings.includes(feeling) ? 'default' : 'outline'}
                  onClick={() => handleFeelingToggle(feeling)}
                  className="rounded-full"
                >
                  {feeling}
                </Button>
              ))}
            </CardContent>
            <CardFooter className="justify-between">
              <Button variant="ghost" onClick={() => setStep(1)}><ArrowLeft className="mr-2"/> Back</Button>
              <Button onClick={() => setStep(3)}>Continue</Button>
            </CardFooter>
          </Card>
        );
      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Want to share more? (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="You can write about your day, what's on your mind, or anything else..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={5}
              />
            </CardContent>
            <CardFooter className="justify-between">
              <Button variant="ghost" onClick={() => setStep(2)}><ArrowLeft className="mr-2"/> Back</Button>
              <Button onClick={handleSubmit} disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Get My Response
              </Button>
            </CardFooter>
          </Card>
        );
      case 4:
        return (
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="font-headline">Thank You for Sharing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-left">
              {aiResponse ? (
                  <>
                    <div className="p-4 bg-accent/20 rounded-lg border border-accent/30">
                        <div className="flex items-center gap-3 mb-2">
                            <Sparkles className="w-5 h-5 text-accent-foreground"/>
                            <h4 className="font-bold text-accent-foreground">A thoughtful response for you</h4>
                        </div>
                        <p>{aiResponse.response}</p>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg border border-secondary/50">
                        <div className="flex items-center gap-3 mb-2">
                            <BookOpen className="w-5 h-5 text-secondary-foreground"/>
                            <h4 className="font-bold text-secondary-foreground">A resource you might find helpful</h4>
                        </div>
                        <p>{aiResponse.recommendation}</p>
                    </div>
                  </>
              ) : (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button onClick={resetFlow}>Start Another Check-in</Button>
              <Button variant="link" asChild><Link href="/progress">View My Progress</Link></Button>
            </CardFooter>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
      <AnimatePresence mode="wait">
        <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
  );
}
