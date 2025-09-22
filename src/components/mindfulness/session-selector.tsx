'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { MindfulnessSessionType, ExperienceLevel } from '@/lib/types';

interface SessionSelectorProps {
  sessionType: MindfulnessSessionType;
  onStartSession: (type: MindfulnessSessionType, duration: number, experience: ExperienceLevel) => void;
}

export function SessionSelector({ sessionType, onStartSession }: SessionSelectorProps) {
  const [duration, setDuration] = useState(5); // Default 5 minutes
  const [experience, setExperience] = useState<ExperienceLevel>('beginner');
  
  const durationOptions = [
    { value: 3, label: '3 minutes' },
    { value: 5, label: '5 minutes' },
    { value: 10, label: '10 minutes' },
    { value: 15, label: '15 minutes' },
    { value: 20, label: '20 minutes' },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Session Duration</Label>
        <Select 
          defaultValue={duration.toString()} 
          onValueChange={(value) => setDuration(parseInt(value))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            {durationOptions.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Experience Level</Label>
        <RadioGroup 
          defaultValue={experience} 
          onValueChange={(value) => setExperience(value as ExperienceLevel)}
          className="flex flex-wrap gap-2 pt-2"
        >
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="beginner" id="beginner" />
            <Label htmlFor="beginner" className="text-sm cursor-pointer">Beginner</Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="intermediate" id="intermediate" />
            <Label htmlFor="intermediate" className="text-sm cursor-pointer">Intermediate</Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="advanced" id="advanced" />
            <Label htmlFor="advanced" className="text-sm cursor-pointer">Advanced</Label>
          </div>
        </RadioGroup>
      </div>
      
      <Button 
        className="w-full" 
        onClick={() => onStartSession(sessionType, duration, experience)}
      >
        Start {sessionType.charAt(0).toUpperCase() + sessionType.slice(1)} Session
      </Button>
    </div>
  );
}