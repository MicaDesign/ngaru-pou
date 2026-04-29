"use client";

import {
  collection,
  doc,
  setDoc,
  getDocs,
  arrayUnion,
  arrayRemove,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getDb } from "@/lib/firebase";

const USERS = "np_users";

export type FsUser = {
  id: string;
  displayName: string;
  email: string;
  fcmTokens: string[];
  avatarUrl?: string | null;
};

export async function upsertUser(user: {
  id: string;
  displayName: string;
  email: string;
}): Promise<void> {
  const db = getDb();
  await setDoc(
    doc(db, USERS, user.id),
    {
      displayName: user.displayName,
      email: user.email,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function getAllUsers(): Promise<FsUser[]> {
  const db = getDb();
  const snap = await getDocs(collection(db, USERS));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<FsUser, "id">) }));
}

export async function addFcmToken(memberId: string, token: string): Promise<void> {
  const db = getDb();
  await updateDoc(doc(db, USERS, memberId), {
    fcmTokens: arrayUnion(token),
    updatedAt: serverTimestamp(),
  });
}

export async function removeFcmToken(memberId: string, token: string): Promise<void> {
  const db = getDb();
  await updateDoc(doc(db, USERS, memberId), {
    fcmTokens: arrayRemove(token),
  });
}
