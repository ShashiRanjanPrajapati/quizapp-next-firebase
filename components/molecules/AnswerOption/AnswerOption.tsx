import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";

type AnswerOptionState = "default" | "selected" | "correct" | "incorrect";

interface AnswerOptionProps {
  label: string;
  index: number;
  state?: AnswerOptionState;
  disabled?: boolean;
  onSelect: (index: number) => void;
}

const stateClasses: Record<AnswerOptionState, string> = {
  default: "border-border hover:border-primary/50 hover:bg-accent/40 hover:-translate-y-[1px] hover:shadow-sm",
  selected: "border-primary bg-primary/8 dark:bg-primary/12 ring-2 ring-primary/25 shadow-md shadow-primary/5 -translate-y-[1px]",
  correct: "border-emerald-500 bg-emerald-500/8 dark:bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/25 shadow-md shadow-emerald-500/5 -translate-y-[1px]",
  incorrect: "border-destructive bg-destructive/8 dark:bg-destructive/12 text-destructive ring-2 ring-destructive/25 shadow-md shadow-destructive/5 -translate-y-[1px]",
};

const letterStateClasses: Record<AnswerOptionState, string> = {
  default: "bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200",
  selected: "bg-primary text-primary-foreground",
  correct: "bg-emerald-500 text-white",
  incorrect: "bg-destructive text-white",
};

export function AnswerOption({
  label,
  index,
  state = "default",
  disabled = false,
  onSelect,
}: AnswerOptionProps) {
  return (
    <Button
      variant="ghost"
      size="lg"
      disabled={disabled}
      onClick={() => onSelect(index)}
      className={cn(
        "group h-auto w-full justify-start whitespace-normal border-2 px-5 py-4 text-left rounded-2xl transition-all duration-200",
        stateClasses[state]
      )}
    >
      <span className={cn(
        "mr-3.5 flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold shadow-sm transition-all duration-200",
        letterStateClasses[state]
      )}>
        {String.fromCharCode(65 + index)}
      </span>
      <span className="font-medium">{label}</span>
    </Button>
  );
}
