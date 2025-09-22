'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { SessionProgress } from '@/lib/types';

interface UseMindfulnessSessionReturn {
  isPlaying: boolean;
  currentTime: number;
  progress: number;
  startSession: () => void;
  pauseSession: () => void;
  stopSession: () => void;
  resetSession: () => void;
}

export function useMindfulnessSession(totalDuration: number): UseMindfulnessSessionReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);

  const progress = (currentTime / totalDuration) * 100;

  const startSession = useCallback(() => {
    if (!isPlaying) {
      setIsPlaying(true);
      startTimeRef.current = Date.now() - (pausedTimeRef.current * 1000);
    }
  }, [isPlaying]);

  const pauseSession = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
      pausedTimeRef.current = currentTime;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [isPlaying, currentTime]);

  const stopSession = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    pausedTimeRef.current = 0;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetSession = useCallback(() => {
    stopSession();
  }, [stopSession]);

  // Timer effect
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        
        if (elapsed >= totalDuration) {
          setCurrentTime(totalDuration);
          setIsPlaying(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        } else {
          setCurrentTime(elapsed);
        }
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, totalDuration]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    isPlaying,
    currentTime,
    progress,
    startSession,
    pauseSession,
    stopSession,
    resetSession,
  };
}

// Hook for managing mindfulness session history
export function useMindfulnessHistory() {
  const [sessionHistory, setSessionHistory] = useState<SessionProgress[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('mindfulness-sessions');
    if (stored) {
      try {
        setSessionHistory(JSON.parse(stored));
      } catch {
        // Handle parsing error gracefully
        setSessionHistory([]);
      }
    }
  }, []);

  const addSession = useCallback((session: Omit<SessionProgress, 'completedAt'>) => {
    const newSession: SessionProgress = {
      ...session,
      completedAt: new Date().toISOString(),
    };

    setSessionHistory(prev => {
      const updated = [newSession, ...prev].slice(0, 50); // Keep last 50 sessions
      localStorage.setItem('mindfulness-sessions', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getSessionStats = useCallback(() => {
    const now = new Date();
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const weekSessions = sessionHistory.filter(
      session => new Date(session.completedAt) >= thisWeek
    );
    const monthSessions = sessionHistory.filter(
      session => new Date(session.completedAt) >= thisMonth
    );

    const totalMinutes = sessionHistory.reduce((sum, session) => sum + session.duration, 0);
    const weekMinutes = weekSessions.reduce((sum, session) => sum + session.duration, 0);

    return {
      totalSessions: sessionHistory.length,
      weekSessions: weekSessions.length,
      monthSessions: monthSessions.length,
      totalMinutes,
      weekMinutes,
      favoriteType: getFavoriteSessionType(),
    };
  }, [sessionHistory]);

  const getFavoriteSessionType = useCallback(() => {
    const typeCounts = sessionHistory.reduce((counts, session) => {
      counts[session.sessionType] = (counts[session.sessionType] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    return Object.entries(typeCounts).reduce(
      (favorite, [type, count]) => 
        count > favorite.count ? { type, count } : favorite,
      { type: '', count: 0 }
    ).type;
  }, [sessionHistory]);

  return {
    sessionHistory,
    addSession,
    getSessionStats,
  };
}