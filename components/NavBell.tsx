"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, MessageSquare, Users } from "lucide-react";
import { subscribeToMyRooms, type Room } from "@/lib/messaging/rooms";
import { getRoomReadTimes, markRoomRead } from "@/lib/messaging/readState";

type Props = { memberId: string };

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function NavBell({ memberId }: Props) {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [readTimes, setReadTimes] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReadTimes(getRoomReadTimes());
    const unsub = subscribeToMyRooms(memberId, setRooms);
    return unsub;
  }, [memberId]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  function isUnread(room: Room): boolean {
    if (!room.lastMessageAt) return false;
    if (room.lastSenderId === memberId) return false;
    return room.lastMessageAt > (readTimes[room.id] ?? 0);
  }

  function getRoomLabel(room: Room): string {
    if (room.type === "group") return room.name;
    const otherId = room.memberIds.find((id) => id !== memberId);
    return otherId ? room.memberNames[otherId] ?? "Unknown" : "Unknown";
  }

  function handleOpen() {
    setReadTimes(getRoomReadTimes());
    setOpen((v) => !v);
  }

  function handleClickRoom(room: Room) {
    markRoomRead(room.id);
    setReadTimes(getRoomReadTimes());
    setOpen(false);
    router.push(`/messages?room=${room.id}`);
  }

  const unreadCount = rooms.filter(isUnread).length;

  // Sort: unread first, then by lastMessageAt desc
  const sorted = [...rooms].sort((a, b) => {
    const aUnread = isUnread(a) ? 1 : 0;
    const bUnread = isUnread(b) ? 1 : 0;
    if (bUnread !== aUnread) return bUnread - aUnread;
    return (b.lastMessageAt ?? b.createdAt) - (a.lastMessageAt ?? a.createdAt);
  });

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleOpen}
        aria-label="Notifications"
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors duration-200 hover:border-white/30 hover:text-white"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-semantic-red px-1 font-sans text-[10px] font-bold text-white ring-2 ring-midnight-tidal">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="animate-fade-up absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-xl border border-white/10 bg-iron-depth shadow-2xl shadow-black/40">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-white/50">
              Messages
            </p>
            {unreadCount > 0 && (
              <span className="rounded-full bg-semantic-red/20 px-2 py-0.5 font-sans text-[10px] font-semibold text-semantic-red">
                {unreadCount} unread
              </span>
            )}
          </div>

          {/* Room list */}
          <div className="max-h-80 overflow-y-auto">
            {sorted.length === 0 ? (
              <p className="px-4 py-6 text-center font-sans text-sm text-white/30">
                No conversations yet.
              </p>
            ) : (
              sorted.map((room) => {
                const unread = isUnread(room);
                const label = getRoomLabel(room);
                const preview = room.lastMessage ?? "No messages yet";
                const ts = room.lastMessageAt ?? room.createdAt;

                return (
                  <button
                    key={room.id}
                    onClick={() => handleClickRoom(room)}
                    className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5 ${
                      unread ? "bg-primary/5" : ""
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        unread ? "bg-primary/20 text-primary" : "bg-white/5 text-white/30"
                      }`}
                    >
                      {room.type === "group" ? (
                        <Users size={14} />
                      ) : (
                        <MessageSquare size={14} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p
                          className={`truncate font-sans text-sm ${
                            unread ? "font-semibold text-white" : "font-medium text-white/70"
                          }`}
                        >
                          {label}
                        </p>
                        <p className="shrink-0 font-sans text-[10px] text-white/30">
                          {timeAgo(ts)}
                        </p>
                      </div>
                      <p className="truncate font-sans text-xs text-white/40">
                        {preview}
                      </p>
                    </div>

                    {/* Unread dot */}
                    {unread && (
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 px-4 py-2.5">
            <button
              onClick={() => { setOpen(false); router.push("/messages"); }}
              className="w-full text-center font-sans text-xs text-primary hover:text-primary-light transition-colors"
            >
              Open all messages →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
