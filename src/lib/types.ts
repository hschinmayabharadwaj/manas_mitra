export type Mood = {
  name: string;
  emoji: string;
};

export type Feeling = string;

export type CheckIn = {
  id: string;
  date: string;
  mood: string;
  feelings: Feeling[];
  details: string;
};

export type MoodValue = {
  [key: string]: number;
}

export type Post = {
  id: string;
  author: string;
  title: string;
  content: string;
  comments: number;
  timestamp: string;
};

export type MindfulnessSessionType = 'breathing' | 'meditation' | 'body-scan' | 'mindful-moment';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type SessionGuidance = {
  timeMarker: string;
  text: string;
};

export type MindfulnessSession = {
  id: string;
  title: string;
  description: string;
  sessionType: MindfulnessSessionType;
  duration: number;
  instructions: string[];
  guidance: SessionGuidance[];
  benefits: string[];
  createdAt: string;
};

export type SessionProgress = {
  sessionId: string;
  completedAt: string;
  duration: number;
  mood: string;
  sessionType: MindfulnessSessionType;
};

export type BreathingPattern = {
  inhale: number;
  hold: number;
  exhale: number;
  pause: number;
};
