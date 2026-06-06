"use client";

import { useEffect } from "react";
import { Clock } from "lucide-react";
import { useTimer } from "@/hooks/useTimer";

interface TimerBarProps {
  initialTime: number;
  onExpire: () => void;
  isActive?: boolean;
}

export function TimerBar({
  initialTime,
  onExpire,
  isActive = true,
}: TimerBarProps) {
  const { timeRemaining, start, pause, reset } = useTimer({
    initialTime,
    onExpire,
    autoStart: false,
  });

  useEffect(() => {
    reset(initialTime);
    if (isActive) {
      start();
    }
    return () => pause();
  }, [initialTime, isActive, reset, start, pause]);

  const isUrgent = timeRemaining < 10;

  return (
    <div className="flex items-center gap-1.5">
      <Clock
        className={`size-4 transition-colors ${isUrgent ? "text-destructive" : "text-primary"}`}
      />
      <span
        className={`text-sm font-bold tabular-nums transition-colors ${
          isUrgent ? "text-destructive animate-pulse" : "text-foreground"
        }`}
        aria-live="polite"
        aria-label={`Time remaining: ${timeRemaining} seconds`}
      >
        {timeRemaining}s
      </span>
    </div>
  );
}
