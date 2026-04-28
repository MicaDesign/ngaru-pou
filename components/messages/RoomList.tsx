"use client";

import { useState } from "react";
import { Users, MessageSquare, Search, Plus } from "lucide-react";
import type { Room } from "@/lib/messaging/rooms";
import type { FsUser } from "@/lib/messaging/users";

type Me = { id: string; displayName: string; email: string; isKaiakoMember: boolean };

type Props = {
  rooms: Room[];
  me: Me;
  allUsers: FsUser[];
  activeRoomId: string | null;
  onSelectRoom: (id: string) => void;
  onStartDm: (user: FsUser) => void;
};

export default function RoomList({
  rooms,
  me,
  allUsers,
  activeRoomId,
  onSelectRoom,
  onStartDm,
}: Props) {
  const [search, setSearch] = useState("");
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [userSearch, setUserSearch] = useState("");

  const dmRooms = rooms.filter((r) => r.type === "dm");
  const groupRooms = rooms.filter((r) => r.type === "group");

  const filteredRooms = search
    ? rooms.filter((r) => {
        if (r.type === "group") return r.name.toLowerCase().includes(search.toLowerCase());
        const otherId = r.memberIds.find((id) => id !== me.id);
        const otherName = otherId ? r.memberNames[otherId] : "";
        return otherName.toLowerCase().includes(search.toLowerCase());
      })
    : null;

  const displayRooms = filteredRooms ?? null;

  const otherUsers = allUsers.filter((u) => u.id !== me.id);
  const filteredUsers = userSearch
    ? otherUsers.filter(
        (u) =>
          u.displayName.toLowerCase().includes(userSearch.toLowerCase()) ||
          u.email.toLowerCase().includes(userSearch.toLowerCase()),
      )
    : otherUsers;

  function getRoomLabel(room: Room): string {
    if (room.type === "group") return room.name;
    const otherId = room.memberIds.find((id) => id !== me.id);
    return otherId ? room.memberNames[otherId] ?? "Unknown" : "Unknown";
  }

  function renderRoom(room: Room) {
    const label = getRoomLabel(room);
    const isActive = room.id === activeRoomId;
    const preview = room.lastMessage ?? "";

    return (
      <button
        key={room.id}
        onClick={() => onSelectRoom(room.id)}
        className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
          isActive
            ? "bg-primary/20 border border-primary/30"
            : "hover:bg-white/5 border border-transparent"
        }`}
      >
        <div className="flex items-center gap-2 mb-0.5">
          {room.type === "group" ? (
            <Users size={13} className="text-white/40 shrink-0" />
          ) : (
            <MessageSquare size={13} className="text-white/40 shrink-0" />
          )}
          <span className="font-sans text-sm font-medium text-white truncate">{label}</span>
        </div>
        {preview && (
          <p className="font-sans text-xs text-white/40 truncate pl-5">{preview}</p>
        )}
      </button>
    );
  }

  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-iron-depth overflow-hidden">
      {/* Search */}
      <div className="p-3 border-b border-white/10">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations…"
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-2 font-sans text-sm text-white placeholder-white/25 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {displayRooms ? (
          <div className="space-y-1">
            {displayRooms.length === 0 ? (
              <p className="font-sans text-xs text-white/30 px-3 py-2">No results</p>
            ) : (
              displayRooms.map(renderRoom)
            )}
          </div>
        ) : (
          <>
            {/* Groups */}
            {groupRooms.length > 0 && (
              <div>
                <p className="font-sans text-[10px] uppercase tracking-widest text-white/30 px-3 mb-1">
                  Groups
                </p>
                <div className="space-y-1">{groupRooms.map(renderRoom)}</div>
              </div>
            )}

            {/* DMs */}
            <div>
              <div className="flex items-center justify-between px-3 mb-1">
                <p className="font-sans text-[10px] uppercase tracking-widest text-white/30">
                  Direct Messages
                </p>
                <button
                  onClick={() => setShowUserSearch((v) => !v)}
                  className="text-white/40 hover:text-primary transition-colors"
                  title="New direct message"
                >
                  <Plus size={14} />
                </button>
              </div>

              {showUserSearch && (
                <div className="mx-1 mb-2 p-2 rounded-lg bg-midnight-tidal border border-white/10">
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Find a member…"
                    autoFocus
                    className="w-full bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5 font-sans text-xs text-white placeholder-white/25 focus:outline-none focus:border-primary/50 transition-colors mb-2"
                  />
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {filteredUsers.length === 0 ? (
                      <p className="font-sans text-xs text-white/30 px-2 py-1">No members found</p>
                    ) : (
                      filteredUsers.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            onStartDm(u);
                            setShowUserSearch(false);
                            setUserSearch("");
                          }}
                          className="w-full text-left px-2 py-1.5 rounded-md hover:bg-white/5 transition-colors"
                        >
                          <p className="font-sans text-xs font-medium text-white">{u.displayName}</p>
                          <p className="font-sans text-[10px] text-white/40">{u.email}</p>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-1">
                {dmRooms.length === 0 && !showUserSearch ? (
                  <p className="font-sans text-xs text-white/30 px-3 py-1">
                    No messages yet — start a conversation with the + button.
                  </p>
                ) : (
                  dmRooms.map(renderRoom)
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
