"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseTimerOptions {
  initialTime: number;
  onExpire?: () => void;
  autoStart?: boolean;
}

export function useTimer({
  initialTime,
  onExpire,
  autoStart = false,
}: UseTimerOptions) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
    clearTimer();
  }, [clearTimer]);

  const reset = useCallback(
    (newTime?: number) => {
      clearTimer();
      setTimeRemaining(newTime ?? initialTime);
      setIsRunning(false);
    },
    [clearTimer, initialTime]
  );

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearTimer();
          setIsRunning(false);
          onExpireRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [isRunning, clearTimer]);

  useEffect(() => {
    setTimeRemaining(initialTime);
  }, [initialTime]);

  return { timeRemaining, isRunning, start, pause, reset };
}
