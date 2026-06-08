import {
  onValue,
  push,
  ref,
  remove,
  set,
  update,
  type DatabaseReference,
  type Unsubscribe,
} from "firebase/database";
import { firebase } from "./config";
import type { LiveRoom } from "@/types";

export function getRoomRef(roomId: string): DatabaseReference {
  if (!firebase.rtdb) throw new Error("Firebase RTDB is not initialized yet.");
  return ref(firebase.rtdb, `rooms/${roomId}`);
}

export async function createLiveRoom(
  room: Omit<LiveRoom, "id">
): Promise<string> {
  if (!firebase.rtdb) throw new Error("Firebase RTDB is not initialized yet.");
  const roomsRef = ref(firebase.rtdb, "rooms");
  const newRoomRef = push(roomsRef);
  await set(newRoomRef, room);
  return newRoomRef.key ?? "";
}

export async function updateLiveRoom(
  roomId: string,
  updates: Partial<LiveRoom>
): Promise<void> {
  await update(getRoomRef(roomId), updates);
}

export async function deleteLiveRoom(roomId: string): Promise<void> {
  await remove(getRoomRef(roomId));
}

export function subscribeToLiveRoom(
  roomId: string,
  callback: (room: LiveRoom | null) => void
): Unsubscribe {
  return onValue(getRoomRef(roomId), (snapshot) => {
    if (!snapshot.exists()) {
      callback(null);
      return;
    }
    callback({ id: roomId, ...snapshot.val() } as LiveRoom);
  });
}
