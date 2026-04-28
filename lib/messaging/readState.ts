const LS_KEY = "np_room_read";

export function getRoomReadTimes(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function markRoomRead(roomId: string): void {
  if (typeof window === "undefined") return;
  const data = getRoomReadTimes();
  data[roomId] = Date.now();
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}
