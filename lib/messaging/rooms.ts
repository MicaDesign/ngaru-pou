"use client";

import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  type Unsubscribe,
} from "firebase/firestore";
import { getDb } from "@/lib/firebase";

const ROOMS = "np_rooms";

export type Room = {
  id: string;
  type: "dm" | "group";
  name: string;
  memberIds: string[];
  memberNames: Record<string, string>;
  createdAt: number;
  createdBy: string;
  lastMessage: string | null;
  lastMessageAt: number | null;
  lastSenderId: string | null;
};

function dmRoomId(a: string, b: string): string {
  return `dm_${[a, b].sort().join("_")}`;
}

export async function getOrCreateDmRoom(
  myId: string,
  myName: string,
  otherId: string,
  otherName: string,
): Promise<Room> {
  const db = getDb();
  const id = dmRoomId(myId, otherId);
  const ref = doc(db, ROOMS, id);
  const snap = await getDoc(ref);

  if (snap.exists()) return { id, ...(snap.data() as Omit<Room, "id">) };

  const room: Omit<Room, "id"> = {
    type: "dm",
    name: "",
    memberIds: [myId, otherId],
    memberNames: { [myId]: myName, [otherId]: otherName },
    createdAt: Date.now(),
    createdBy: myId,
    lastMessage: null,
    lastMessageAt: null,
    lastSenderId: null,
  };
  await setDoc(ref, room);
  return { id, ...room };
}

export async function createGroupRoom(params: {
  name: string;
  memberIds: string[];
  memberNames: Record<string, string>;
  createdBy: string;
}): Promise<Room> {
  const db = getDb();
  const ref = doc(collection(db, ROOMS));
  const room: Omit<Room, "id"> = {
    type: "group",
    name: params.name,
    memberIds: params.memberIds,
    memberNames: params.memberNames,
    createdAt: Date.now(),
    createdBy: params.createdBy,
    lastMessage: null,
    lastMessageAt: null,
    lastSenderId: null,
  };
  await setDoc(ref, room);
  return { id: ref.id, ...room };
}

export async function updateGroupMembers(
  roomId: string,
  add: { id: string; name: string }[],
  remove: string[],
): Promise<void> {
  const db = getDb();
  const ref = doc(db, ROOMS, roomId);
  const updates: Record<string, unknown> = {};

  if (add.length > 0) {
    updates.memberIds = arrayUnion(...add.map((m) => m.id));
    for (const m of add) updates[`memberNames.${m.id}`] = m.name;
  }
  if (remove.length > 0) {
    updates.memberIds = arrayRemove(...remove);
    for (const id of remove) updates[`memberNames.${id}`] = deleteDoc as unknown;
  }

  if (Object.keys(updates).length > 0) await updateDoc(ref, updates);
}

export async function renameGroup(roomId: string, name: string): Promise<void> {
  await updateDoc(doc(getDb(), ROOMS, roomId), { name });
}

export async function deleteGroup(roomId: string): Promise<void> {
  await deleteDoc(doc(getDb(), ROOMS, roomId));
}

export function subscribeToMyRooms(
  memberId: string,
  onUpdate: (rooms: Room[]) => void,
): Unsubscribe {
  const db = getDb();
  const q = query(
    collection(db, ROOMS),
    where("memberIds", "array-contains", memberId),
  );
  return onSnapshot(q, (snap) => {
    const rooms: Room[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Room, "id">) }));
    rooms.sort((a, b) => (b.lastMessageAt ?? b.createdAt) - (a.lastMessageAt ?? a.createdAt));
    onUpdate(rooms);
  });
}

export async function updateRoomLastMessage(
  roomId: string,
  text: string,
  senderId: string,
): Promise<void> {
  await updateDoc(doc(getDb(), ROOMS, roomId), {
    lastMessage: text,
    lastMessageAt: serverTimestamp(),
    lastSenderId: senderId,
  });
}
