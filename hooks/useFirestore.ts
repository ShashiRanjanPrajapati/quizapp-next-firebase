"use client";

import { useCallback, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import {
  firestoreAdd,
  firestoreRemove,
  firestoreUpdate,
} from "@/lib/firebase/firestore";

interface UseFirestoreOptions<T> {
  collectionName: string;
  initialData?: T[];
}

export function useFirestore<T extends DocumentData & { id?: string }>({
  collectionName,
  initialData = [],
}: UseFirestoreOptions<T>) {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const snapshot = await getDocs(collection(db, collectionName));
      const items = snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as T
      );
      setData(items);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  const subscribe = useCallback(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(
      collection(db, collectionName),
      (snapshot) => {
        const items = snapshot.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as T
        );
        setData(items);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [collectionName]);

  const add = useCallback(
    async (item: Omit<T, "id">) => {
      setLoading(true);
      setError(null);
      try {
        const id = await firestoreAdd(collectionName, item as DocumentData);
        return id;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [collectionName]
  );

  const update = useCallback(
    async (id: string, updates: Partial<T>) => {
      setLoading(true);
      setError(null);
      try {
        await firestoreUpdate(collectionName, id, updates as DocumentData);
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [collectionName]
  );

  const remove = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        await firestoreRemove(collectionName, id);
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [collectionName]
  );

  return { data, loading, error, fetchAll, subscribe, add, update, remove };
}
