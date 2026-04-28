"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Bell, BellOff } from "lucide-react";
import { getMemberstack } from "@/lib/memberstack";
import { isKaiako } from "@/lib/kaiako";
import { upsertUser, getAllUsers, type FsUser } from "@/lib/messaging/users";
import {
  subscribeToMyRooms,
  getOrCreateDmRoom,
  type Room,
} from "@/lib/messaging/rooms";
import {
  requestPushPermission,
} from "@/lib/messaging/notifications";
import RoomList from "./RoomList";
import ChatPane from "./ChatPane";
import GroupAdminPanel from "./GroupAdminPanel";

type Me = {
  id: string;
  displayName: string;
  email: string;
  isKaiakoMember: boolean;
};

export default function MessagesView() {
  const searchParams = useSearchParams();
  const [me, setMe] = useState<Me | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [allUsers, setAllUsers] = useState<FsUser[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(
    searchParams.get("room"),
  );
  const [loading, setLoading] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const unsubRoomsRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const ms = getMemberstack();
    if (!ms) { window.location.href = "/login"; return; }

    let cancelled = false;

    async function init() {
      const { data: member } = await ms.getCurrentMember();
      if (!member?.id) { window.location.href = "/login"; return; }
      if (cancelled) return;

      const cf = member.customFields ?? {};
      const firstName = typeof cf["first-name"] === "string" ? cf["first-name"] : "";
      const lastName = typeof cf["last-name"] === "string" ? cf["last-name"] : "";
      const displayName = [firstName, lastName].filter(Boolean).join(" ") || member.auth?.email?.split("@")[0] || "Member";

      const profile: Me = {
        id: member.id,
        displayName,
        email: member.auth?.email ?? "",
        isKaiakoMember: isKaiako(member),
      };
      setMe(profile);

      await upsertUser({ id: member.id, displayName, email: profile.email });

      // Fetch all MemberStack members for the DM picker
      const msRes = await fetch("/api/messages/members", {
        headers: { "x-member-id": member.id },
      });
      if (msRes.ok) {
        const { members } = await msRes.json() as { members: { id: string; displayName: string; email: string }[] };
        if (!cancelled) setAllUsers(members.map((m) => ({ ...m, fcmTokens: [] })));
      } else {
        // Fallback to Firestore users
        const users = await getAllUsers();
        if (!cancelled) setAllUsers(users);
      }

      unsubRoomsRef.current = subscribeToMyRooms(member.id, (r) => {
        if (!cancelled) setRooms(r);
      });

      // Register FCM service worker
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/api/firebase-sw").catch(() => {});
      }

      setLoading(false);
    }

    init().catch((err) => {
      console.error("MessagesView init failed", err);
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
      unsubRoomsRef.current?.();
    };
  }, []);

  async function handleEnablePush() {
    if (!me) return;
    const ok = await requestPushPermission(me.id);
    setPushEnabled(ok);
  }

  async function handleStartDm(user: FsUser) {
    if (!me) return;
    const room = await getOrCreateDmRoom(me.id, me.displayName, user.id, user.displayName);
    setActiveRoomId(room.id);
  }

  const activeRoom = rooms.find((r) => r.id === activeRoomId) ?? null;

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-6rem)] bg-midnight-tidal flex items-center justify-center">
        <Loader2 size={28} className="text-white/30 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-midnight-tidal">
      <div className="site-container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.25em] text-white/50 mb-1">
              Messages
            </p>
            <h1 className="font-display text-3xl md:text-4xl text-white">
              kōrero
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {me?.isKaiakoMember && (
              <button
                onClick={() => setShowAdmin((v) => !v)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/40 text-primary font-sans text-sm hover:bg-primary/10 transition-colors"
              >
                {showAdmin ? "← Back" : "Manage Groups"}
              </button>
            )}
            <button
              onClick={handleEnablePush}
              disabled={pushEnabled || Notification.permission === "denied"}
              title={
                Notification.permission === "denied"
                  ? "Notifications blocked in browser settings"
                  : pushEnabled
                    ? "Push notifications enabled"
                    : "Enable push notifications"
              }
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/15 text-white/60 font-sans text-sm hover:border-white/30 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pushEnabled ? <Bell size={15} className="text-primary" /> : <BellOff size={15} />}
              {pushEnabled ? "Notifications on" : "Enable notifications"}
            </button>
          </div>
        </div>

        {showAdmin && me ? (
          <GroupAdminPanel
            me={me}
            allUsers={allUsers}
            onClose={() => setShowAdmin(false)}
            onGroupCreated={(room) => setActiveRoomId(room.id)}
          />
        ) : (
          <div className="grid md:grid-cols-[280px_1fr] gap-4 h-[calc(100vh-14rem)] min-h-[500px]">
            <RoomList
              rooms={rooms}
              me={me!}
              allUsers={allUsers}
              activeRoomId={activeRoomId}
              onSelectRoom={setActiveRoomId}
              onStartDm={handleStartDm}
            />
            <ChatPane
              room={activeRoom}
              me={me!}
              allUsers={allUsers}
            />
          </div>
        )}
      </div>
    </div>
  );
}
