import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "./admin";
import type { Difficulty, Quiz, QuizResult, User, LeaderboardEntry } from "@/types";

// ─── Users ─────────────────────────────────────────────────────────────────

export async function createUserProfile(
  userId: string,
  profile: { displayName: string; email: string; photoURL?: string }
): Promise<void> {
  await adminDb.collection("users").doc(userId).set({
    uid: userId,
    displayName: profile.displayName,
    email: profile.email,
    photoURL: profile.photoURL || null,
    totalScore: 0,
    quizzesPlayed: 0,
    quizzesCreated: 0,
    createdAt: FieldValue.serverTimestamp(),
  });
}

export async function getUserProfile(userId: string): Promise<User | null> {
  const snap = await adminDb.collection("users").doc(userId).get();
  if (!snap.exists) return null;
  return snap.data() as User;
}

// ─── Quizzes ────────────────────────────────────────────────────────────────

export async function getQuizById(quizId: string): Promise<Quiz | null> {
  const snap = await adminDb.collection("quizzes").doc(quizId).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...snap.data() } as Quiz;
}

export async function getPublicQuizzes(
  category?: string,
  difficulty?: Difficulty
): Promise<Quiz[]> {
  let q = adminDb
    .collection("quizzes")
    .where("isPublic", "==", true) as FirebaseFirestore.Query;

  if (category) q = q.where("category", "==", category);
  if (difficulty) q = q.where("difficulty", "==", difficulty);

  const snapshot = await q.get();
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Quiz);
}

export async function createQuiz(
  quiz: Omit<Quiz, "id" | "createdAt" | "playCount">
): Promise<string> {
  const ref = await adminDb.collection("quizzes").add({
    ...quiz,
    playCount: 0,
    createdAt: FieldValue.serverTimestamp(),
  });
  return ref.id;
}

export async function incrementQuizPlayCount(quizId: string): Promise<void> {
  await adminDb
    .collection("quizzes")
    .doc(quizId)
    .update({ playCount: FieldValue.increment(1) });
}

// ─── Results ────────────────────────────────────────────────────────────────

export async function saveQuizResult(
  result: Omit<QuizResult, "id" | "completedAt">
): Promise<string> {
  const ref = await adminDb.collection("results").add({
    ...result,
    completedAt: FieldValue.serverTimestamp(),
  });

  await adminDb
    .collection("users")
    .doc(result.userId)
    .update({
      totalScore: FieldValue.increment(result.score),
      quizzesPlayed: FieldValue.increment(1),
    });

  return ref.id;
}

export async function getResultById(
  resultId: string
): Promise<QuizResult | null> {
  const snap = await adminDb.collection("results").doc(resultId).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...snap.data() } as QuizResult;
}

export async function getUserResults(
  userId: string,
  max = 10
): Promise<QuizResult[]> {
  const snapshot = await adminDb
    .collection("results")
    .where("userId", "==", userId)
    .orderBy("completedAt", "desc")
    .limit(max)
    .get();

  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as QuizResult);
}

// ─── Leaderboard ────────────────────────────────────────────────────────────

export async function getLeaderboardEntries(
  max = 10,
  category?: string,
  difficulty?: Difficulty
): Promise<LeaderboardEntry[]> {
  const snapshot = await adminDb
    .collection("results")
    .orderBy("score", "desc")
    .limit(max * 5) // fetch extra to allow client-side filter
    .get();

  let results = snapshot.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as QuizResult
  );

  // Resolve all quiz & user ids in parallel
  const quizIds = [...new Set(results.map((r) => r.quizId))];
  const userIds = [...new Set(results.map((r) => r.userId))];

  const [quizSnaps, userSnaps] = await Promise.all([
    Promise.all(
      quizIds.map((id) => adminDb.collection("quizzes").doc(id).get())
    ),
    Promise.all(
      userIds.map((id) => adminDb.collection("users").doc(id).get())
    ),
  ]);

  const quizMap = new Map<string, Quiz>();
  quizSnaps.forEach((s) => {
    if (s.exists) quizMap.set(s.id, { id: s.id, ...s.data() } as Quiz);
  });

  const userMap = new Map<string, User>();
  userSnaps.forEach((s) => {
    if (s.exists) userMap.set(s.id, s.data() as User);
  });

  // Filter by category / difficulty if provided
  if (category || difficulty) {
    results = results.filter((r) => {
      const quiz = quizMap.get(r.quizId);
      if (!quiz) return false;
      if (category && quiz.category !== category) return false;
      if (difficulty && quiz.difficulty !== difficulty) return false;
      return true;
    });
  }

  return results.slice(0, max).map((r) => {
    const profile = userMap.get(r.userId);
    const quiz = quizMap.get(r.quizId);
    return {
      id: r.id,
      userId: r.userId,
      displayName: profile?.displayName ?? "Anonymous",
      photoURL: profile?.photoURL,
      score: r.score,
      quizId: r.quizId,
      category: quiz?.category ?? "",
      difficulty: quiz?.difficulty ?? "medium",
      completedAt: r.completedAt,
    } satisfies LeaderboardEntry;
  });
}

// ─── Generic helpers ─────────────────────────────────────────────────────────

export async function firestoreAdd<T extends FirebaseFirestore.DocumentData>(
  collectionName: string,
  data: T
): Promise<string> {
  const ref = await adminDb.collection(collectionName).add(data);
  return ref.id;
}

export async function firestoreUpdate(
  collectionName: string,
  id: string,
  data: Partial<FirebaseFirestore.DocumentData>
): Promise<void> {
  await adminDb.collection(collectionName).doc(id).update(data);
}

export async function firestoreRemove(
  collectionName: string,
  id: string
): Promise<void> {
  await adminDb.collection(collectionName).doc(id).delete();
}
