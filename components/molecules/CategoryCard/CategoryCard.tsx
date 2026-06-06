import { cn } from "@/lib/utils";

interface CategoryCardProps {
  icon: string;
  name: string;
  quizCount: number;
  description?: string;
  onClick?: () => void;
  className?: string;
}

export function CategoryCard({
  icon,
  name,
  quizCount,
  description,
  onClick,
  className,
}: CategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-5 text-left transition-all duration-200 hover:border-primary/50 hover:bg-muted hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10",
        className
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-xl bg-primary/15 transition-colors duration-200 group-hover:bg-primary/20">
        <span className="text-2xl" role="img" aria-hidden>
          {icon}
        </span>
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-sm text-card-foreground group-hover:text-primary transition-colors">{name}</h3>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{description}</p>
        )}
      </div>
      <span className="text-xs font-semibold text-primary/70 rounded-full bg-primary/10 px-2 py-0.5">
        {quizCount} {quizCount === 1 ? "quiz" : "quizzes"}
      </span>
    </button>
  );
}
