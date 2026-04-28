"use client";

import { addFcmToken, removeFcmToken } from "./users";

const VAPID = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ?? "";

export async function requestPushPermission(memberId: string): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission === "denied") return false;

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return false;

    const { getMessagingInstance } = await import("@/lib/firebase");
    const { getToken } = await import("firebase/messaging");
    const messaging = await getMessagingInstance();
    if (!messaging) return false;

    const token = await getToken(messaging, { vapidKey: VAPID });
    if (!token) return false;

    await addFcmToken(memberId, token);
    return true;
  } catch (err) {
    console.warn("Push permission request failed", err);
    return false;
  }
}

export async function revokePushToken(memberId: string): Promise<void> {
  try {
    const { getMessagingInstance } = await import("@/lib/firebase");
    const { getToken, deleteToken } = await import("firebase/messaging");
    const messaging = await getMessagingInstance();
    if (!messaging) return;

    const token = await getToken(messaging, { vapidKey: VAPID });
    if (token) {
      await deleteToken(messaging);
      await removeFcmToken(memberId, token);
    }
  } catch {
    // best-effort
  }
}

export async function listenForForegroundMessages(
  callback: (title: string, body: string) => void,
): Promise<() => void> {
  try {
    const { getMessagingInstance } = await import("@/lib/firebase");
    const { onMessage } = await import("firebase/messaging");
    const messaging = await getMessagingInstance();
    if (!messaging) return () => {};

    return onMessage(messaging, (payload) => {
      const title = payload.notification?.title ?? "New message";
      const body = payload.notification?.body ?? "";
      callback(title, body);
    });
  } catch {
    return () => {};
  }
}
