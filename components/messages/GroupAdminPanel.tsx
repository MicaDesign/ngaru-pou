"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  UserPlus,
  UserMinus,
  Check,
  Loader2,
  Users,
  Pencil,
} from "lucide-react";
import {
  subscribeToMyRooms,
  createGroupRoom,
  updateGroupMembers,
  renameGroup,
  deleteGroup,
  type Room,
} from "@/lib/messaging/rooms";
import type { FsUser } from "@/lib/messaging/users";

type Me = { id: string; displayName: string };

type Props = {
  me: Me;
  allUsers: FsUser[];
  onClose: () => void;
  onGroupCreated: (room: Room) => void;
};

export default function GroupAdminPanel({ me, allUsers, onClose, onGroupCreated }: Props) {
  const [groups, setGroups] = useState<Room[]>([]);
  const [creating, setCreating] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set([me.id]));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const unsub = subscribeToMyRooms(me.id, (rooms) =>
      setGroups(rooms.filter((r) => r.type === "group")),
    );
    return unsub;
  }, [me.id]);

  function toggleUser(id: string) {
    if (id === me.id) return;
    setSelectedUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleCreate() {
    if (!newGroupName.trim() || selectedUserIds.size === 0) return;
    setSaving(true);
    try {
      const memberIds = Array.from(selectedUserIds);
      const memberNames: Record<string, string> = {};
      for (const uid of memberIds) {
        const u = allUsers.find((x) => x.id === uid);
        memberNames[uid] = u?.displayName ?? uid;
      }
      memberNames[me.id] = me.displayName;
      if (!memberIds.includes(me.id)) memberIds.push(me.id);

      const room = await createGroupRoom({
        name: newGroupName.trim(),
        memberIds,
        memberNames,
        createdBy: me.id,
      });
      setSaved(true);
      setTimeout(() => {
        setCreating(false);
        setNewGroupName("");
        setSelectedUserIds(new Set([me.id]));
        setSaved(false);
        onGroupCreated(room);
        onClose();
      }, 600);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(groupId: string) {
    if (!confirm("Delete this group? This cannot be undone.")) return;
    await deleteGroup(groupId);
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-iron-depth p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users size={20} className="text-primary" />
          <h2 className="font-display text-2xl text-white">manage groups</h2>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-light text-white font-sans text-sm font-medium transition-colors"
        >
          <Plus size={15} />
          New group
        </button>
      </div>

      {/* Create group form */}
      {creating && (
        <div className="mb-6 rounded-xl border border-primary/30 bg-midnight-tidal p-5">
          <p className="font-sans text-sm font-semibold text-white mb-4">New group</p>

          <div className="mb-4">
            <label className="block font-sans text-xs text-white/50 mb-1.5 uppercase tracking-widest">
              Group name
            </label>
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="e.g. Te Pūmanawa Whānau"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 font-sans text-sm text-white placeholder-white/25 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="mb-4">
            <label className="block font-sans text-xs text-white/50 mb-2 uppercase tracking-widest">
              Members ({selectedUserIds.size} selected)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
              {allUsers
                .filter((u) => u.id !== me.id)
                .map((u) => {
                  const selected = selectedUserIds.has(u.id);
                  return (
                    <button
                      key={u.id}
                      onClick={() => toggleUser(u.id)}
                      className={`text-left px-3 py-2 rounded-lg border text-sm transition-colors ${
                        selected
                          ? "border-primary/50 bg-primary/10 text-white"
                          : "border-white/10 bg-white/3 text-white/60 hover:border-white/25 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            selected ? "border-primary bg-primary" : "border-white/20"
                          }`}
                        >
                          {selected && <Check size={10} className="text-white" />}
                        </div>
                        <span className="font-sans text-xs font-medium truncate">
                          {u.displayName}
                        </span>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCreate}
              disabled={saving || !newGroupName.trim() || selectedUserIds.size < 2}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-light text-white font-sans text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : saved ? (
                <Check size={14} />
              ) : (
                <Plus size={14} />
              )}
              {saved ? "Created!" : "Create group"}
            </button>
            <button
              onClick={() => {
                setCreating(false);
                setNewGroupName("");
                setSelectedUserIds(new Set([me.id]));
              }}
              className="px-4 py-2 rounded-lg border border-white/10 text-white/50 font-sans text-sm hover:text-white hover:border-white/25 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Existing groups */}
      {groups.length === 0 ? (
        <p className="font-sans text-sm text-white/40">
          No groups yet. Create one to get started.
        </p>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              allUsers={allUsers}
              me={me}
              onDelete={() => handleDelete(group.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function GroupCard({
  group,
  allUsers,
  me,
  onDelete,
}: {
  group: Room;
  allUsers: FsUser[];
  me: Me;
  onDelete: () => void;
}) {
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState(group.name);
  const [addingId, setAddingId] = useState<string | null>(null);

  const nonMembers = allUsers.filter(
    (u) => !group.memberIds.includes(u.id) && u.id !== me.id,
  );

  async function handleRename() {
    if (!newName.trim() || newName === group.name) { setRenaming(false); return; }
    await renameGroup(group.id, newName.trim());
    setRenaming(false);
  }

  async function handleAdd(user: FsUser) {
    setAddingId(user.id);
    await updateGroupMembers(group.id, [{ id: user.id, name: user.displayName }], []);
    setAddingId(null);
  }

  async function handleRemove(memberId: string) {
    await updateGroupMembers(group.id, [], [memberId]);
  }

  return (
    <div className="rounded-xl border border-white/10 bg-midnight-tidal p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1">
          {renaming ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleRename(); if (e.key === "Escape") setRenaming(false); }}
                autoFocus
                className="bg-white/5 border border-primary/40 rounded-lg px-3 py-1.5 font-sans text-sm text-white focus:outline-none w-full max-w-xs"
              />
              <button onClick={handleRename} className="text-primary hover:text-primary-light transition-colors">
                <Check size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="font-sans text-sm font-semibold text-white">{group.name}</p>
              <button onClick={() => setRenaming(true)} className="text-white/30 hover:text-white/60 transition-colors">
                <Pencil size={12} />
              </button>
            </div>
          )}
          <p className="font-sans text-xs text-white/40 mt-0.5">
            {group.memberIds.length} member{group.memberIds.length === 1 ? "" : "s"}
          </p>
        </div>
        <button
          onClick={onDelete}
          className="text-white/30 hover:text-semantic-red transition-colors p-1"
          title="Delete group"
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* Current members */}
      <div className="flex flex-wrap gap-2 mb-3">
        {group.memberIds.map((id) => {
          const name = group.memberNames[id] ?? id;
          const isMe = id === me.id;
          return (
            <div
              key={id}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 pl-2.5 pr-1.5 py-1"
            >
              <span className="font-sans text-xs text-white/70">{name}{isMe ? " (you)" : ""}</span>
              {!isMe && (
                <button
                  onClick={() => handleRemove(id)}
                  className="text-white/30 hover:text-semantic-red transition-colors"
                  title={`Remove ${name}`}
                >
                  <UserMinus size={11} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Add member */}
      {nonMembers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <p className="w-full font-sans text-[10px] uppercase tracking-widest text-white/30 mb-1">
            Add member
          </p>
          {nonMembers.map((u) => (
            <button
              key={u.id}
              onClick={() => handleAdd(u)}
              disabled={addingId === u.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-2.5 py-1 font-sans text-xs text-white/50 hover:text-white hover:border-primary/40 transition-colors disabled:opacity-50"
            >
              {addingId === u.id ? (
                <Loader2 size={10} className="animate-spin" />
              ) : (
                <UserPlus size={10} />
              )}
              {u.displayName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
