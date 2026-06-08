"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Trophy, Target, BarChart3, PlusCircle, Play } from "lucide-react";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { ProtectedRoute } from "@/providers/ProtectedRoute";
import { Spinner } from "@/components/atoms/Spinner";
import { useAuth } from "@/hooks/useAuth";
import { getUserResults, getLeaderboardEntries } from "@/lib/firebase/firestore";
import { ROUTES } from "@/constants/routes";

export default function DashboardPage() {
  const { user, userProfile, signOut } = useAuth();

  const { data: results = [], isLoading: resultsLoading } = useQuery({
    queryKey: ["userResults", user?.uid],
    queryFn: () => getUserResults(user!.uid),
    enabled: !!user,
  });

  const { data: leaderboard = [] } = useQuery({
    queryKey: ["leaderboardRank"],
    queryFn: () => getLeaderboardEntries(100),
  });

  const userRank =
    user && leaderboard.findIndex((r) => r.userId === user.uid) + 1;

  return (
    <ProtectedRoute>
      <DashboardLayout
        user={
          user
            ? {
              displayName:
                userProfile?.displayName ?? user.displayName ?? "User",
              photoURL: userProfile?.photoURL ?? user.photoURL ?? undefined,
            }
            : null
        }
        onSignOut={signOut}
      >
        <div className="space-y-6">
          {/* Purple header bar matching wireframe */}
          <div className="rounded-2xl bg-primary px-6 py-5 flex items-center justify-between shadow-lg shadow-primary/20">
            <div>
              <h1 className="text-xl font-bold text-primary-foreground">Dashboard</h1>
              <p className="mt-0.5 text-sm text-primary-foreground/70">
                Welcome back, {userProfile?.displayName ?? "Player"}!
              </p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-full bg-primary-foreground/20 overflow-hidden">
              {userProfile?.photoURL ? (
                <img src={userProfile.photoURL} alt="" className="size-full object-cover" />
              ) : (
                <span className="text-sm font-bold text-primary-foreground">
                  {(userProfile?.displayName ?? "U")[0].toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Stats row — purple score, green quizzes, orange rank */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-border bg-card p-5 text-center">
              <p className="text-2xl font-extrabold text-primary">{userProfile?.totalScore ?? 0}</p>
              <p className="mt-1 text-xs text-muted-foreground flex items-center justify-center gap-1"><Trophy className="size-3" /> Score</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 text-center">
              <p className="text-2xl font-extrabold text-emerald-400">{userProfile?.quizzesPlayed ?? 0}</p>
              <p className="mt-1 text-xs text-muted-foreground flex items-center justify-center gap-1"><Target className="size-3" /> Played</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 text-center">
              <p className="text-2xl font-extrabold text-amber-400">
                {userRank && userRank > 0 ? `#${userRank}` : "—"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground flex items-center justify-center gap-1"><BarChart3 className="size-3" /> Rank</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Link href={ROUTES.HOME} className="flex-1">
              <button className="w-full rounded-xl border border-border bg-card py-3 text-sm font-semibold text-foreground hover:border-primary/40 hover:bg-muted transition-all flex items-center justify-center gap-2">
                <Play className="size-4 text-primary" /> Start a Quiz
              </button>
            </Link>
            <Link href={ROUTES.QUIZ_CREATE} className="flex-1">
              <button className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-md shadow-primary/20">
                <PlusCircle className="size-4" /> Create Quiz
              </button>
            </Link>
          </div>

          {/* Recent activity */}
          <div>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">Recent activity</h2>
            {resultsLoading ? (
              <div className="flex justify-center py-8">
                <Spinner size="lg" />
              </div>
            ) : results.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
                No results yet. Play your first quiz!
              </p>
            ) : (
              <div className="space-y-2.5">
                {results.map((result) => {
                  const pct = result.score ?? 0;
                  const color =
                    pct >= 70
                      ? "bg-emerald-500"
                      : pct >= 40
                        ? "bg-amber-400"
                        : "bg-destructive";
                  const textColor =
                    pct >= 70
                      ? "text-emerald-400"
                      : pct >= 40
                        ? "text-amber-400"
                        : "text-destructive";
                  return (
                    <Link
                      key={result.id}
                      href={ROUTES.results(result.id)}
                      className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-3.5 transition-all hover:border-primary/40 hover:bg-muted duration-200"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">Quiz Result</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {result.completedAt
                            ? format(result.completedAt.toDate(), "PP")
                            : "—"}
                        </p>
                      </div>
                      <span className={`ml-3 rounded-full px-3 py-1 text-xs font-bold text-foreground ${color}`}>
                        {pct}%
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom CTA */}
          <Link href={ROUTES.LEADERBOARD}>
            <button className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
              View Leaderboard
            </button>
          </Link>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
