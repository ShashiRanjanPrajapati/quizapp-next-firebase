import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        success: "bg-emerald-500/15 text-emerald-400",
        warning: "bg-amber-400/15 text-amber-400",
        danger: "bg-rose-500/15 text-rose-400",
        info: "bg-blue-500/15 text-blue-400",
        category: "bg-primary/15 text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
