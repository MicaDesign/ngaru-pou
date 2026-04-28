"use client";

import { useState } from "react";
import { X, Check, UserPlus, UserMinus, Loader2, Trash2 } from "lucide-react";
import {
  renameGroup,
  updateGroupMembers,
  deleteGroup,
  updateGroupAvatar,
  type Room,
} from "@/lib/messaging/rooms";
import { uploadGroupAvatar } from "@/lib/avatars";
import type { FsUser } from "@/lib/messaging/users";
import Avatar from "@/components/Avatar";
import AvatarUpload from "@/components/AvatarUpload";

type Me = { id: string; displayName: string };

type Props = {
  room: Room;
  me: Me;
  allUsers: FsUser[];
  onClose: () => void;
  onDeleted: () => void;
};

export default function GroupSettingsPanel({ room, me, allUsers, onClose, onDeleted }: Props) {
  const [name, setName] = useState(room.name);
  const [renameSaving, setRenameSaving] = useState(false);
  const [renameSaved, setRenameSaved] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [groupAvatarUrl, setGroupAvatarUrl] = useState<string | null>(room.avatarUrl ?? null);

  const nonMembers = allUsers.filter((u) => !room.memberIds.includes(u.id));

  async function handleRename() {
    const trimmed = name.trim();
    if (!trimmed || trimmed === room.name || renameSaving) return;
    setRenameSaving(true);
    await renameGroup(room.id, trimmed);
    setRenameSaving(false);
    setRenameSaved(true);
    setTimeout(() => setRenameSaved(false), 2000);
  }

  async function handleAdd(user: FsUser) {
    setAddingId(user.id);
    await updateGroupMembers(room.id, [{ id: user.id, name: user.displayName }], []);
    setAddingId(null);
  }

  async function handleRemove(memberId: string) {
    setRemovingId(memberId);
    await updateGroupMembers(room.id, [], [memberId]);
    setRemovingId(null);
  }

  async function handleDelete() {
    if (!confirm(`Delete "${room.name}"? This cannot be undone.`)) return;
    await deleteGroup(room.id);
    onDeleted();
  }

  async function handleAvatarUpload(file: File): Promise<string> {
    const url = await uploadGroupAvatar(room.id, file);
    await updateGroupAvatar(room.id, url);
    return url;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 shrink-0">
        <p className="font-sans text-sm font-semibold text-white">Group settings</p>
        <button
          onClick={onClose}
          className="text-white/40 hover:text-white transition-colors"
          aria-label="Close settings"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
        {/* Group avatar */}
        <div className="flex flex-col items-center gap-1 pb-2">
          <AvatarUpload
            currentUrl={groupAvatarUrl}
            name={room.name}
            size={80}
            onUpload={handleAvatarUpload}
            onSaved={setGroupAvatarUrl}
          />
        </div>

        {/* Rename */}
        <div>
          <label className="block font-sans text-xs uppercase tracking-widest text-white/40 mb-2">
            Group name
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleRename(); }}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 font-sans text-sm text-white placeholder-white/25 focus:outline-none focus:border-primary/50 transition-colors"
            />
            <button
              onClick={handleRename}
              disabled={renameSaving || !name.trim() || name.trim() === room.name}
              className="px-3 py-2 rounded-lg bg-primary text-white font-sans text-sm hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              {renameSaving ? <Loader2 size={13} className="animate-spin" /> : renameSaved ? <Check size={13} /> : null}
              {renameSaved ? "Saved" : "Save"}
            </button>
          </div>
        </div>

        {/* Current members */}
        <div>
          <p className="font-sans text-xs uppercase tracking-widest text-white/40 mb-3">
            Members · {room.memberIds.length}
          </p>
          <ul className="space-y-2">
            {room.memberIds.map((id) => {
              const memberName = room.memberNames[id] ?? id;
              const isMe = id === me.id;
              return (
                <li key={id} className="flex items-center justify-between gap-3 rounded-lg bg-white/[0.04] px-3 py-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar src={null} name={memberName} size={28} />
                    <span className="font-sans text-sm text-white truncate">
                      {memberName}{isMe ? " (you)" : ""}
                    </span>
                  </div>
                  {!isMe && (
                    <button
                      onClick={() => handleRemove(id)}
                      disabled={removingId === id}
                      className="shrink-0 text-white/30 hover:text-semantic-red transition-colors"
                      title={`Remove ${memberName}`}
                    >
                      {removingId === id
                        ? <Loader2 size={13} className="animate-spin" />
                        : <UserMinus size={13} />
                      }
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Add members */}
        {nonMembers.length > 0 && (
          <div>
            <p className="font-sans text-xs uppercase tracking-widest text-white/40 mb-3">
              Add members
            </p>
            <ul className="space-y-2">
              {nonMembers.map((u) => (
                <li key={u.id} className="flex items-center justify-between gap-3 rounded-lg bg-white/[0.04] px-3 py-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar src={null} name={u.displayName} size={28} />
                    <span className="font-sans text-sm text-white/60 truncate">{u.displayName}</span>
                  </div>
                  <button
                    onClick={() => handleAdd(u)}
                    disabled={addingId === u.id}
                    className="shrink-0 text-white/40 hover:text-primary transition-colors"
                    title={`Add ${u.displayName}`}
                  >
                    {addingId === u.id
                      ? <Loader2 size={13} className="animate-spin" />
                      : <UserPlus size={13} />
                    }
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Delete group */}
      <div className="shrink-0 px-5 py-4 border-t border-white/10">
        <button
          onClick={handleDelete}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-semantic-red/30 text-semantic-red font-sans text-sm hover:bg-semantic-red/10 transition-colors"
        >
          <Trash2 size={14} />
          Delete group
        </button>
      </div>
    </div>
  );
}
