import { Brain, Zap, Trophy, Users } from "lucide-react";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      {/* Brand */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary shadow-xl shadow-primary/30">
          <Brain className="size-8 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold text-foreground tracking-tight">QuizApp</span>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm space-y-6 rounded-2xl border border-border bg-card p-8 shadow-2xl shadow-black/40">
        <div className="text-center">
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
          {subtitle && (
            <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {children}

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-4 border-t border-border pt-5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Zap className="size-3 text-amber-400" />
            <span>Instant access</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Trophy className="size-3 text-primary" />
            <span>Leaderboards</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="size-3 text-emerald-400" />
            <span>Multiplayer</span>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground/60">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}
