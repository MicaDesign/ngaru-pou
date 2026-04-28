"use client";

import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { getDb } from "@/lib/firebase";

const SETTINGS_COL = "np_settings";
const SETTINGS_DOC = "general";
const EOI_COL = "np_eoi";

export async function getEnrollmentOpen(): Promise<boolean> {
  try {
    const db = getDb();
    const snap = await getDoc(doc(db, SETTINGS_COL, SETTINGS_DOC));
    if (!snap.exists()) return true; // default open
    return snap.data()?.enrollmentOpen !== false;
  } catch {
    return true;
  }
}

export async function setEnrollmentOpen(open: boolean): Promise<void> {
  const db = getDb();
  await setDoc(doc(db, SETTINGS_COL, SETTINGS_DOC), { enrollmentOpen: open }, { merge: true });
}

export type EoiEntry = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  childrenCount: string;
  message: string;
  createdAt: number;
};

export async function submitEoi(params: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  childrenCount: string;
  message: string;
}): Promise<void> {
  const db = getDb();
  await addDoc(collection(db, EOI_COL), {
    ...params,
    createdAt: serverTimestamp(),
  });
}

export async function getAllEois(): Promise<EoiEntry[]> {
  const db = getDb();
  const q = query(collection(db, EOI_COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      firstName: data.firstName ?? "",
      lastName: data.lastName ?? "",
      email: data.email ?? "",
      phone: data.phone ?? "",
      childrenCount: data.childrenCount ?? "",
      message: data.message ?? "",
      createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
    };
  });
}
