import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type DocumentData,
  type QueryConstraint,
} from "firebase/firestore";
import { firebase } from "./config";
import type { Difficulty, Quiz, QuizResult, User } from "@/types";

const db = firebase.db;

export async function createUserProfile(
  userId: string,
  profile: { displayName: string; email: string; photoURL?: string }
): Promise<void> {
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, {
    uid: userId,
    displayName: profile.displayName,
    email: profile.email,
    photoURL: profile.photoURL || null,
    totalScore: 0,
    quizzesPlayed: 0,
    quizzesCreated: 0,
    createdAt: serverTimestamp(),
  });
}

export async function getQuizById(quizId: string): Promise<Quiz | null> {
  const snapshot = await getDoc(doc(db, "quizzes", quizId));
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as Quiz;
}

export async function getPublicQuizzes(
  category?: string,
  difficulty?: Difficulty
): Promise<Quiz[]> {
  const constraints: QueryConstraint[] = [where("isPublic", "==", true)];

  if (category) {
    constraints.push(where("category", "==", category));
  }
  if (difficulty) {
    constraints.push(where("difficulty", "==", difficulty));
  }

  const snapshot = await getDocs(query(collection(db, "quizzes"), ...constraints));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Quiz);
}

export async function createQuiz(
  quiz: Omit<Quiz, "id" | "createdAt" | "playCount">
): Promise<string> {
  const docRef = await addDoc(collection(db, "quizzes"), {
    ...quiz,
    playCount: 0,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function incrementQuizPlayCount(quizId: string): Promise<void> {
  await updateDoc(doc(db, "quizzes", quizId), {
    playCount: increment(1),
  });
}

export async function saveQuizResult(
  result: Omit<QuizResult, "id" | "completedAt">
): Promise<string> {
  const docRef = await addDoc(collection(db, "results"), {
    ...result,
    completedAt: serverTimestamp(),
  });

  const userRef = doc(db, "users", result.userId);
  await updateDoc(userRef, {
    totalScore: increment(result.score),
    quizzesPlayed: increment(1),
  });

  return docRef.id;
}

export async function getResultById(
  resultId: string
): Promise<QuizResult | null> {
  const snapshot = await getDoc(doc(db, "results", resultId));
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as QuizResult;
}

export async function getUserResults(
  userId: string,
  max = 10
): Promise<QuizResult[]> {
  const snapshot = await getDocs(
    query(
      collection(db, "results"),
      where("userId", "==", userId),
      orderBy("completedAt", "desc"),
      limit(max)
    )
  );
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as QuizResult);
}

export async function getUserProfile(userId: string): Promise<User | null> {
  const snapshot = await getDoc(doc(db, "users", userId));
  if (!snapshot.exists()) return null;
  return snapshot.data() as User;
}

export async function getLeaderboardEntries(
  max = 10,
  category?: string,
  difficulty?: Difficulty
): Promise<QuizResult[]> {
  const constraints: QueryConstraint[] = [
    orderBy("score", "desc"),
    limit(max),
  ];

  const snapshot = await getDocs(
    query(collection(db, "results"), ...constraints)
  );

  let results = snapshot.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as QuizResult
  );

  if (category || difficulty) {
    const quizIds = [...new Set(results.map((r) => r.quizId))];
    const quizMap = new Map<string, Quiz>();

    await Promise.all(
      quizIds.map(async (id) => {
        const quiz = await getQuizById(id);
        if (quiz) quizMap.set(id, quiz);
      })
    );

    results = results.filter((r) => {
      const quiz = quizMap.get(r.quizId);
      if (!quiz) return false;
      if (category && quiz.category !== category) return false;
      if (difficulty && quiz.difficulty !== difficulty) return false;
      return true;
    });
  }

  return results.slice(0, max);
}

export async function firestoreAdd<T extends DocumentData>(
  collectionName: string,
  data: T
): Promise<string> {
  const docRef = await addDoc(collection(db, collectionName), data);
  return docRef.id;
}

export async function firestoreUpdate(
  collectionName: string,
  id: string,
  data: Partial<DocumentData>
): Promise<void> {
  await updateDoc(doc(db, collectionName, id), data);
}

export async function firestoreRemove(
  collectionName: string,
  id: string
): Promise<void> {
  const { deleteDoc } = await import("firebase/firestore");
  await deleteDoc(doc(db, collectionName, id));
}
