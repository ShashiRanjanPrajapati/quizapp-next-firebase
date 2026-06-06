import { Avatar } from "@/components/atoms/Avatar";
import { Spinner } from "@/components/atoms/Spinner";
import { Crown, Medal, Award } from "lucide-react";
import type { LeaderboardEntry } from "@/types";

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  isLoading?: boolean;
}

const podiumIcons = [
  <Crown key={0} className="size-5 text-amber-400" />,
  <Medal key={1} className="size-5 text-slate-400" />,
  <Award key={2} className="size-5 text-amber-700" />,
];

const rankBorderColors = [
  "border-amber-400/50 shadow-amber-400/10",
  "border-slate-400/50 shadow-slate-400/10",
  "border-amber-700/50 shadow-amber-700/10",
];

const rankTextColors = ["text-amber-400", "text-slate-400", "text-amber-600"];

export function Leaderboard({ entries, currentUserId, isLoading = false }: LeaderboardProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        No leaderboard entries yet. Be the first to play!
      </p>
    );
  }

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <div className="space-y-6">
      {/* Purple header */}
      <div className="rounded-2xl bg-primary px-6 py-5 text-center shadow-lg shadow-primary/20">
        <h1 className="text-xl font-bold text-primary-foreground">Leaderboard 🏆</h1>
        <p className="mt-0.5 text-sm text-primary-foreground/70">Top players this week</p>
      </div>

      {/* Top 3 podium */}
      {top3.length > 0 && (
        <div className="flex items-end justify-center gap-3 pt-2">
          {/* 2nd place */}
          {top3[1] && (
            <div className="flex flex-col items-center gap-2 flex-1">
              <Avatar photoURL={top3[1].photoURL} name={top3[1].displayName} size="md" />
              <p className="text-xs font-semibold text-center truncate w-full text-center">{top3[1].displayName}</p>
              <div className="w-full rounded-t-xl bg-slate-400/15 border border-slate-400/30 py-3 text-center">
                <Medal className="mx-auto size-4 text-slate-400 mb-0.5" />
                <p className="text-sm font-bold text-slate-400">2nd</p>
                <p className="text-xs text-muted-foreground mt-0.5">{top3[1].score}%</p>
              </div>
            </div>
          )}
          {/* 1st place */}
          {top3[0] && (
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="ring-2 ring-amber-400/50 rounded-full">
                <Avatar photoURL={top3[0].photoURL} name={top3[0].displayName} size="lg" />
              </div>
              <p className="text-xs font-semibold text-center truncate w-full text-center">{top3[0].displayName}</p>
              <div className="w-full rounded-t-xl bg-amber-400/15 border border-amber-400/30 py-4 text-center">
                <Crown className="mx-auto size-5 text-amber-400 mb-0.5" />
                <p className="text-sm font-bold text-amber-400">1st</p>
                <p className="text-xs text-muted-foreground mt-0.5">{top3[0].score}%</p>
              </div>
            </div>
          )}
          {/* 3rd place */}
          {top3[2] && (
            <div className="flex flex-col items-center gap-2 flex-1">
              <Avatar photoURL={top3[2].photoURL} name={top3[2].displayName} size="md" />
              <p className="text-xs font-semibold text-center truncate w-full text-center">{top3[2].displayName}</p>
              <div className="w-full rounded-t-xl bg-amber-700/15 border border-amber-700/30 py-2 text-center">
                <Award className="mx-auto size-4 text-amber-600 mb-0.5" />
                <p className="text-sm font-bold text-amber-600">3rd</p>
                <p className="text-xs text-muted-foreground mt-0.5">{top3[2].score}%</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Remaining entries */}
      {rest.length > 0 && (
        <div className="space-y-2.5">
          {rest.map((entry, i) => {
            const rank = i + 4;
            const isCurrentUser = entry.userId === currentUserId;
            return (
              <div
                key={entry.id}
                className={`flex items-center gap-4 rounded-xl border px-5 py-3.5 transition-all ${
                  isCurrentUser
                    ? "border-primary/40 bg-primary/10"
                    : "border-border bg-card hover:border-primary/20 hover:bg-muted"
                }`}
              >
                <span className="w-7 text-center text-sm font-bold text-muted-foreground">
                  #{rank}
                </span>
                <Avatar photoURL={entry.photoURL} name={entry.displayName} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${isCurrentUser ? "text-primary" : ""}`}>
                    {entry.displayName}
                    {isCurrentUser && <span className="ml-1.5 text-xs text-primary/70">(You)</span>}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                  entry.score >= 70
                    ? "bg-emerald-500/15 text-emerald-400"
                    : entry.score >= 40
                    ? "bg-amber-400/15 text-amber-400"
                    : "bg-destructive/15 text-destructive"
                }`}>
                  {entry.score}%
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
