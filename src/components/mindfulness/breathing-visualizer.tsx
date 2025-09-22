'use client';

import { useEffect, useState } from 'react';

interface BreathingVisualizerProps {
  isActive: boolean;
  pattern?: {
    inhale: number;
    hold: number;
    exhale: number;
    pause: number;
  };
}

export function BreathingVisualizer({ 
  isActive, 
  pattern = { inhale: 4, hold: 2, exhale: 6, pause: 1 } 
}: BreathingVisualizerProps) {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [scale, setScale] = useState(1);
  const [cycleTime, setCycleTime] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setScale(1);
      setCycleTime(0);
      setPhase('inhale');
      return;
    }

    const totalCycleTime = pattern.inhale + pattern.hold + pattern.exhale + pattern.pause;
    let animationFrame: number;
    let startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const currentCycleTime = elapsed % totalCycleTime;
      setCycleTime(currentCycleTime);

      // Determine current phase
      if (currentCycleTime < pattern.inhale) {
        setPhase('inhale');
        const progress = currentCycleTime / pattern.inhale;
        setScale(1 + progress * 0.8); // Scale from 1 to 1.8
      } else if (currentCycleTime < pattern.inhale + pattern.hold) {
        setPhase('hold');
        setScale(1.8); // Hold at max scale
      } else if (currentCycleTime < pattern.inhale + pattern.hold + pattern.exhale) {
        setPhase('exhale');
        const exhaleStart = pattern.inhale + pattern.hold;
        const progress = (currentCycleTime - exhaleStart) / pattern.exhale;
        setScale(1.8 - progress * 0.8); // Scale from 1.8 back to 1
      } else {
        setPhase('pause');
        setScale(1); // Stay at minimum scale
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isActive, pattern]);

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      case 'pause':
        return 'Pause';
      default:
        return 'Breathe';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale':
        return 'from-blue-300 to-blue-500';
      case 'hold':
        return 'from-purple-300 to-purple-500';
      case 'exhale':
        return 'from-green-300 to-green-500';
      case 'pause':
        return 'from-gray-300 to-gray-400';
      default:
        return 'from-blue-300 to-blue-500';
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Breathing Circle */}
      <div className="relative w-40 h-40 flex items-center justify-center">
        <div
          className={`w-32 h-32 rounded-full bg-gradient-to-br ${getPhaseColor()} 
                     transition-transform duration-300 ease-in-out shadow-lg`}
          style={{
            transform: `scale(${scale})`,
            transition: isActive ? 'transform 0.1s ease-in-out' : 'transform 0.3s ease-in-out',
          }}
        />
        
        {/* Center dot */}
        <div className="absolute w-4 h-4 bg-white rounded-full shadow-md" />
      </div>

      {/* Phase Text */}
      <div className="text-center">
        <p className="text-2xl font-semibold text-primary mb-2">
          {getPhaseText()}
        </p>
        <p className="text-sm text-muted-foreground">
          Follow the circle's rhythm
        </p>
      </div>

      {/* Breathing Pattern Info */}
      <div className="grid grid-cols-4 gap-4 text-center text-xs">
        <div className={`p-2 rounded ${phase === 'inhale' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}>
          <div className="font-semibold">Inhale</div>
          <div>{pattern.inhale}s</div>
        </div>
        <div className={`p-2 rounded ${phase === 'hold' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100'}`}>
          <div className="font-semibold">Hold</div>
          <div>{pattern.hold}s</div>
        </div>
        <div className={`p-2 rounded ${phase === 'exhale' ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
          <div className="font-semibold">Exhale</div>
          <div>{pattern.exhale}s</div>
        </div>
        <div className={`p-2 rounded ${phase === 'pause' ? 'bg-gray-200 text-gray-700' : 'bg-gray-100'}`}>
          <div className="font-semibold">Pause</div>
          <div>{pattern.pause}s</div>
        </div>
      </div>
    </div>
  );
}