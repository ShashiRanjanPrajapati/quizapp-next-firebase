"use client";

import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number;
  label?: string;
  className?: string;
}

export function ScoreBadge({
  score,
  label = "Score",
  className,
}: ScoreBadgeProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const duration = 500;
    const steps = 20;
    const increment = score / steps;
    let current = 0;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), score);
      setDisplayScore(current);
      if (step >= steps) clearInterval(interval);
    }, duration / steps);

    return () => clearInterval(interval);
  }, [score]);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2",
        className
      )}
    >
      <Trophy className="size-5 text-primary" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold text-primary tabular-nums">
          {displayScore}%
        </p>
      </div>
    </div>
  );
}
