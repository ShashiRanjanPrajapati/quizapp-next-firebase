interface QuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  text: string;
}

export function QuestionCard({
  questionNumber,
  totalQuestions,
  text,
}: QuestionCardProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-base font-semibold leading-relaxed text-foreground md:text-lg">
        {text}
      </h2>
    </div>
  );
}
