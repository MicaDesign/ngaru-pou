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

export type SiteSettings = {
  enrollmentOpen: boolean;
  announcementVisible: boolean;
  announcementText: string;
  announcementLink: string;
  announcementStyle: "info" | "warning" | "success";
};

const DEFAULTS: SiteSettings = {
  enrollmentOpen: true,
  announcementVisible: false,
  announcementText: "",
  announcementLink: "",
  announcementStyle: "info",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const db = getDb();
    const snap = await getDoc(doc(db, SETTINGS_COL, SETTINGS_DOC));
    if (!snap.exists()) return DEFAULTS;
    const d = snap.data();
    return {
      enrollmentOpen: d?.enrollmentOpen !== false,
      announcementVisible: d?.announcementVisible === true,
      announcementText: d?.announcementText ?? "",
      announcementLink: d?.announcementLink ?? "",
      announcementStyle: d?.announcementStyle ?? "info",
    };
  } catch {
    return DEFAULTS;
  }
}

export async function getEnrollmentOpen(): Promise<boolean> {
  const s = await getSiteSettings();
  return s.enrollmentOpen;
}

export async function setEnrollmentOpen(open: boolean): Promise<void> {
  const db = getDb();
  await setDoc(doc(db, SETTINGS_COL, SETTINGS_DOC), { enrollmentOpen: open }, { merge: true });
}

export async function saveAnnouncementSettings(params: {
  visible: boolean;
  text: string;
  link: string;
  style: SiteSettings["announcementStyle"];
}): Promise<void> {
  const db = getDb();
  await setDoc(
    doc(db, SETTINGS_COL, SETTINGS_DOC),
    {
      announcementVisible: params.visible,
      announcementText: params.text,
      announcementLink: params.link,
      announcementStyle: params.style,
    },
    { merge: true },
  );
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
