"use client";

import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDb, getStorageInstance } from "@/lib/firebase";
import { updateRoomLastMessage } from "./rooms";

const MESSAGES = "messages";
const ROOM_COL = "np_rooms";

export type Message = {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  imageUrl: string | null;
  fileUrl: string | null;
  fileName: string | null;
  fileType: string | null;
  createdAt: number;
};

export function subscribeToMessages(
  roomId: string,
  onUpdate: (messages: Message[]) => void,
): Unsubscribe {
  const db = getDb();
  const q = query(
    collection(db, ROOM_COL, roomId, MESSAGES),
    orderBy("createdAt", "asc"),
    limit(200),
  );
  return onSnapshot(q, (snap) => {
    const msgs: Message[] = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        senderId: data.senderId ?? "",
        senderName: data.senderName ?? "",
        text: data.text ?? "",
        imageUrl: data.imageUrl ?? null,
        fileUrl: data.fileUrl ?? null,
        fileName: data.fileName ?? null,
        fileType: data.fileType ?? null,
        createdAt:
          data.createdAt?.toMillis?.() ?? data.createdAt ?? Date.now(),
      };
    });
    onUpdate(msgs);
  });
}

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];

export async function sendMessage(params: {
  roomId: string;
  senderId: string;
  senderName: string;
  text: string;
  imageFile?: File | null;
}): Promise<void> {
  const db = getDb();
  let imageUrl: string | null = null;
  let fileUrl: string | null = null;
  let fileName: string | null = null;
  let fileType: string | null = null;

  if (params.imageFile) {
    const storage = getStorageInstance();
    const isImage = IMAGE_TYPES.includes(params.imageFile.type);
    const folder = isImage ? "np_images" : "np_files";
    const path = `${folder}/${params.roomId}/${Date.now()}_${params.imageFile.name}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, params.imageFile);
    const url = await getDownloadURL(storageRef);

    if (isImage) {
      imageUrl = url;
    } else {
      fileUrl = url;
      fileName = params.imageFile.name;
      fileType = params.imageFile.type;
    }
  }

  await addDoc(collection(db, ROOM_COL, params.roomId, MESSAGES), {
    senderId: params.senderId,
    senderName: params.senderName,
    text: params.text,
    imageUrl,
    fileUrl,
    fileName,
    fileType,
    createdAt: serverTimestamp(),
  });

  const preview = imageUrl
    ? "📷 Image"
    : fileUrl
      ? `📎 ${fileName ?? "File"}`
      : params.text.length > 60
        ? params.text.slice(0, 60) + "…"
        : params.text;
  await updateRoomLastMessage(params.roomId, preview, params.senderId);
}
