import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/utils/formatTime";

interface TimerProps {
  seconds: number;
  className?: string;
}

export function Timer({ seconds, className }: TimerProps) {
  const isUrgent = seconds < 10;

  return (
    <span
      className={cn(
        "font-mono text-lg font-semibold tabular-nums transition-colors",
        isUrgent ? "text-destructive animate-pulse" : "text-foreground",
        className
      )}
      aria-live="polite"
      aria-label={`Time remaining: ${formatTime(seconds)}`}
    >
      {formatTime(seconds)}
    </span>
  );
}
