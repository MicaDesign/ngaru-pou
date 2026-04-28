"use client";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { getDb, getStorageInstance } from "@/lib/firebase";

const USERS_COL = "np_users";
const STUDENT_AVATARS_COL = "np_student_avatars";

async function uploadAvatar(path: string, file: File): Promise<string> {
  const storage = getStorageInstance();
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function uploadMemberAvatar(memberId: string, file: File): Promise<string> {
  const url = await uploadAvatar(`np_avatars/members/${memberId}`, file);
  const db = getDb();
  await setDoc(doc(db, USERS_COL, memberId), { avatarUrl: url }, { merge: true });
  return url;
}

export async function getMemberAvatarUrl(memberId: string): Promise<string | null> {
  try {
    const db = getDb();
    const snap = await getDoc(doc(db, USERS_COL, memberId));
    return snap.data()?.avatarUrl ?? null;
  } catch {
    return null;
  }
}

export async function uploadStudentAvatar(studentId: string, file: File): Promise<string> {
  const url = await uploadAvatar(`np_avatars/students/${studentId}`, file);
  const db = getDb();
  await setDoc(doc(db, STUDENT_AVATARS_COL, studentId), { avatarUrl: url }, { merge: true });
  return url;
}

export async function getStudentAvatarUrl(studentId: string): Promise<string | null> {
  try {
    const db = getDb();
    const snap = await getDoc(doc(db, STUDENT_AVATARS_COL, studentId));
    return snap.data()?.avatarUrl ?? null;
  } catch {
    return null;
  }
}

export async function uploadGroupAvatar(roomId: string, file: File): Promise<string> {
  return uploadAvatar(`np_avatars/groups/${roomId}`, file);
}

export async function getAllStudentAvatarUrls(): Promise<Record<string, string>> {
  try {
    const db = getDb();
    const snap = await getDocs(collection(db, STUDENT_AVATARS_COL));
    const result: Record<string, string> = {};
    snap.docs.forEach((d) => {
      const url = d.data()?.avatarUrl;
      if (url) result[d.id] = url;
    });
    return result;
  } catch {
    return {};
  }
}
