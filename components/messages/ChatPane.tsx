"use client";

import { useEffect, useRef, useState } from "react";
import { MessageSquare, Settings } from "lucide-react";
import { subscribeToMessages, sendMessage, type Message } from "@/lib/messaging/messages";
import { markRoomRead } from "@/lib/messaging/readState";
import type { FsUser } from "@/lib/messaging/users";
import type { Room } from "@/lib/messaging/rooms";
import { getMemberAvatarUrl } from "@/lib/avatars";
import Avatar from "@/components/Avatar";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import GroupSettingsPanel from "./GroupSettingsPanel";

type Me = { id: string; displayName: string; email: string };

type Props = {
  room: Room | null;
  me: Me;
  allUsers: FsUser[];
};

export default function ChatPane({ room, me, allUsers }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);
  const [memberAvatars, setMemberAvatars] = useState<Record<string, string>>({});
  const [showGroupSettings, setShowGroupSettings] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!room) { setMessages([]); return; }
    markRoomRead(room.id);
    const unsub = subscribeToMessages(room.id, (msgs) => {
      setMessages(msgs);
      markRoomRead(room.id);
    });
    // Load avatars for all room members
    room.memberIds.forEach((id) => {
      if (!memberAvatars[id]) {
        getMemberAvatarUrl(id).then((url) => {
          if (url) setMemberAvatars((prev) => ({ ...prev, [id]: url }));
        });
      }
    });
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(text: string, imageFile: File | null) {
    if (!room || (!text.trim() && !imageFile)) return;
    setSending(true);
    try {
      await sendMessage({
        roomId: room.id,
        senderId: me.id,
        senderName: me.displayName,
        text: text.trim(),
        imageFile,
      });
      // Trigger push notifications to other room members
      const recipients = room.memberIds.filter((id) => id !== me.id);
      if (recipients.length > 0) {
        const users = allUsers.filter((u) => recipients.includes(u.id));
        const tokens = users.flatMap((u) => u.fcmTokens ?? []);
        if (tokens.length > 0) {
          const roomLabel =
            room.type === "group"
              ? room.name
              : me.displayName;
          fetch("/api/messages/notify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-member-id": me.id,
            },
            body: JSON.stringify({
              tokens,
              title: roomLabel,
              body: imageFile ? "📷 Sent an image" : text.trim().slice(0, 120),
              roomId: room.id,
            }),
          }).catch(() => {});
        }
      }
    } finally {
      setSending(false);
    }
  }

  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-iron-depth text-center px-8 py-16">
        <MessageSquare size={36} className="text-white/10 mb-4" />
        <p className="font-sans text-sm text-white/40">
          Select a conversation or start a new direct message.
        </p>
      </div>
    );
  }

  const otherId = room.type === "dm" ? room.memberIds.find((id) => id !== me.id) : null;
  const roomLabel =
    room.type === "group"
      ? room.name
      : (otherId ? room.memberNames[otherId] ?? "Unknown" : "Unknown");
  const otherAvatarUrl = otherId ? memberAvatars[otherId] ?? null : null;

  const memberCount = room.memberIds.length;

  return (
    <div className="flex rounded-2xl border border-white/10 bg-iron-depth overflow-hidden">
      {/* Main chat column */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Room header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/10 shrink-0">
          {room.type === "group" ? (
            <Avatar src={room.avatarUrl} name={room.name} size={32} />
          ) : (
            <Avatar src={otherAvatarUrl} name={roomLabel} size={32} />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-sans text-sm font-semibold text-white truncate">{roomLabel}</p>
            {room.type === "group" && (
              <p className="font-sans text-xs text-white/40">
                {memberCount} member{memberCount === 1 ? "" : "s"}
              </p>
            )}
          </div>
          {room.type === "group" && (
            <button
              onClick={() => setShowGroupSettings((v) => !v)}
              aria-label="Group settings"
              className={`shrink-0 p-2 rounded-lg transition-colors ${showGroupSettings ? "text-primary bg-primary/10" : "text-white/40 hover:text-white hover:bg-white/5"}`}
            >
              <Settings size={16} />
            </button>
          )}
        </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="font-sans text-sm text-white/30">
              No messages yet — say kia ora!
            </p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const prev = messages[i - 1];
            const showSender =
              msg.senderId !== me.id &&
              (!prev || prev.senderId !== msg.senderId);
            return (
              <MessageBubble
                key={msg.id}
                message={msg}
                isMine={msg.senderId === me.id}
                showSender={showSender}
                senderAvatarUrl={memberAvatars[msg.senderId] ?? null}
              />
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-white/10">
        <MessageInput onSend={handleSend} disabled={sending} />
      </div>
      </div>{/* end main chat column */}

      {/* Group settings panel */}
      {room.type === "group" && showGroupSettings && (
        <div className="w-72 shrink-0 border-l border-white/10 flex flex-col">
          <GroupSettingsPanel
            room={room}
            me={me}
            allUsers={allUsers}
            onClose={() => setShowGroupSettings(false)}
            onDeleted={() => setShowGroupSettings(false)}
          />
        </div>
      )}
    </div>
  );
}
