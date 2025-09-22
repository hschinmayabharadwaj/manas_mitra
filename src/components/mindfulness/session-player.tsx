'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ExperienceLevel, MindfulnessSessionType } from '@/lib/types';

interface SessionPlayerProps {
  sessionType: MindfulnessSessionType;
  duration: number;
  experience: ExperienceLevel;
  onEnd: () => void;
}

export function SessionPlayer({ sessionType, duration, experience, onEnd }: SessionPlayerProps) {
  const [timeRemaining, setTimeRemaining] = useState(duration * 60); // Convert minutes to seconds
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Sample guidance content
  const sessionContent = {
    title: `${sessionType.charAt(0).toUpperCase() + sessionType.slice(1)} Session`,
    instructions: [
      "Find a comfortable position where you can be alert yet relaxed",
      "Allow your eyes to gently close or maintain a soft gaze",
      "Take a moment to notice how your body feels right now",
      "Begin to follow the guidance below when you're ready",
    ],
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsActive(false);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progress = ((duration * 60 - timeRemaining) / (duration * 60)) * 100;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-center font-headline text-xl md:text-2xl">
            {sessionContent.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{formatTime(timeRemaining)}</div>
            <Progress value={progress} className="h-2" />
          </div>
          
          {!isActive && (
            <div className="space-y-4">
              <h3 className="font-semibold">Before you begin:</h3>
              <ul className="space-y-2 list-disc pl-5">
                {sessionContent.instructions.map((instruction, i) => (
                  <li key={i}>{instruction}</li>
                ))}
              </ul>
            </div>
          )}
          
          {isActive && (
            <div className="bg-accent/30 p-4 rounded-lg">
              <p className="text-center italic">
                {isPaused 
                  ? "Session paused. Take this moment to check in with yourself."
                  : "Focus on your breath... Notice the sensations in your body..."}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          {!isActive ? (
            <>
              <Button onClick={() => setIsActive(true)} className="px-8">Begin Session</Button>
              <Button onClick={onEnd} variant="outline">Go Back</Button>
            </>
          ) : (
            <>
              <Button onClick={() => setIsPaused(!isPaused)}>
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
              <Button onClick={onEnd} variant="outline">End Session</Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}