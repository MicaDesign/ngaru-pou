"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Plus, Minus, X, Trash2, Shuffle } from "lucide-react";
import { KAIAKO_PLAN_ID } from "@/lib/kaiako";
import { getStudents, fullName } from "@/lib/studentRegistry";
import { memberFullName, getTeacherMembers } from "@/lib/teacherMembers";

// ─── Types ───────────────────────────────────────────────────────────────────

type Category = "akonga" | "kaiako" | "whanau";

type Person = {
  id: string;
  name: string;
  category: Category;
};

type WheelEntry = {
  key: string;
  personId: string;
  name: string;
  count: number;
  color: string;
};

type Segment = {
  name: string;
  color: string;
};

// ─── Constants ───────────────────────────────────────────────────────────────

const PALETTE = [
  "#2ca3bb", // primary teal
  "#3cbca7", // secondary teal-green
  "#5b5fef", // indigo
  "#8b5cf6", // violet
  "#f59e0b", // amber
  "#10b981", // emerald
  "#ef4444", // red
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#84cc16", // lime
  "#f97316", // orange
  "#a855f7", // purple
  "#14b8a6", // teal
  "#e11d48", // rose
  "#60cad8", // lagoon
];

const CATEGORY_LABELS: Record<Category, string> = {
  akonga: "Ākonga (Students)",
  kaiako: "Kaiako (Teachers)",
  whanau: "Whānau (Parents)",
};

const CANVAS_SIZE = 460;
const TWO_PI = Math.PI * 2;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildSegments(entries: WheelEntry[]): Segment[] {
  const segs: Segment[] = [];
  for (const entry of entries) {
    for (let i = 0; i < entry.count; i++) {
      segs.push({ name: entry.name, color: entry.color });
    }
  }
  return segs;
}

function truncateText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(t + "…").width > maxWidth) {
    t = t.slice(0, -1);
  }
  return t + "…";
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function SpinWheel() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState<WheelEntry[]>([]);
  const [segmentOverride, setSegmentOverride] = useState<Segment[] | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [addCount, setAddCount] = useState(1);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const angleRef = useRef(0);
  const rafRef = useRef<number>(0);
  const colorCounterRef = useRef(0);

  // ── Fetch participants ────────────────────────────────────────────────────

  useEffect(() => {
    async function load() {
      try {
        const [students, members] = await Promise.all([
          getStudents().catch(() => []),
          getTeacherMembers().catch(() => []),
        ]);

        const list: Person[] = [];

        for (const s of students) {
          list.push({ id: `student-${s.id}`, name: fullName(s), category: "akonga" });
        }

        for (const m of members) {
          const isKaiako = m.planConnections.some(
            (c) => c.planId === KAIAKO_PLAN_ID && c.active === true,
          );
          list.push({
            id: `member-${m.id}`,
            name: memberFullName(m),
            category: isKaiako ? "kaiako" : "whanau",
          });
        }

        // Deduplicate by name (case-insensitive) — the student_registry
        // can have duplicate rows, and some people appear in both the
        // registry and MemberStack. Prefer the first occurrence found.
        const seen = new Set<string>();
        const unique: Person[] = [];
        for (const p of list) {
          const key = p.name.toLowerCase().trim();
          if (key && !seen.has(key)) {
            seen.add(key);
            unique.push(p);
          }
        }

        setPeople(unique);
      } catch (err) {
        console.error("SpinWheel: failed to load participants", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ── Canvas drawing ────────────────────────────────────────────────────────

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cx = CANVAS_SIZE / 2;
    const cy = CANVAS_SIZE / 2;
    const radius = cx - 8;

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    const segs = segmentOverride ?? buildSegments(entries);

    if (segs.length === 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, TWO_PI);
      ctx.fillStyle = "#0f1c3f";
      ctx.fill();
      ctx.strokeStyle = "#ffffff15";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.font = "16px Inter, sans-serif";
      ctx.fillStyle = "#ffffff35";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Add names to spin", cx, cy);
      return;
    }

    const numSegs = segs.length;
    const segAngle = TWO_PI / numSegs;
    const fontSize = Math.max(9, Math.min(14, 13 - numSegs * 0.12));

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angleRef.current);

    for (let i = 0; i < numSegs; i++) {
      const start = -Math.PI / 2 + i * segAngle;
      const end = start + segAngle;

      // Slice fill
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = segs[i].color;
      ctx.fill();

      // Slice border
      ctx.strokeStyle = "#050a1c";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Label (only if segment is wide enough to read)
      if (segAngle > 0.06 && radius > 60) {
        const midAngle = start + segAngle / 2;
        ctx.save();
        ctx.rotate(midAngle);
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "rgba(255,255,255,0.92)";
        ctx.font = `bold ${fontSize}px Inter, sans-serif`;
        const maxLabelW = radius * 0.62;
        ctx.fillText(truncateText(ctx, segs[i].name, maxLabelW), radius - 14, 0);
        ctx.restore();
      }
    }

    ctx.restore();

    // Outer ring
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TWO_PI);
    ctx.strokeStyle = "#2ca3bb";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Centre hub
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, TWO_PI);
    ctx.fillStyle = "#050a1c";
    ctx.fill();
    ctx.strokeStyle = "#2ca3bb";
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [entries, segmentOverride]);

  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  // ── Spin animation ────────────────────────────────────────────────────────

  const spin = useCallback(() => {
    const segs = segmentOverride ?? buildSegments(entries);
    if (segs.length === 0 || spinning) return;

    setSpinning(true);
    setWinner(null);

    const duration = 6000 + Math.random() * 2000;
    const totalDelta = TWO_PI * (8 + Math.random() * 5) + Math.random() * TWO_PI;
    const startAngle = angleRef.current;
    const startTime = performance.now();

    function easeOut(t: number) {
      return 1 - Math.pow(1 - t, 5);
    }

    function frame(now: number) {
      const t = Math.min((now - startTime) / duration, 1);
      angleRef.current = startAngle + totalDelta * easeOut(t);
      drawWheel();

      if (t < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        // Determine winner: find which segment is under the pointer (top = -PI/2)
        const segAngle = TWO_PI / segs.length;
        const offset = ((-angleRef.current) % TWO_PI + TWO_PI) % TWO_PI;
        const winnerIdx = Math.floor(offset / segAngle) % segs.length;
        setWinner(segs[winnerIdx].name);
        setSpinning(false);
      }
    }

    rafRef.current = requestAnimationFrame(frame);
  }, [entries, segmentOverride, spinning, drawWheel]);

  useEffect(() => () => { cancelAnimationFrame(rafRef.current); }, []);

  // ── Entry management ──────────────────────────────────────────────────────

  function pickColor(): string {
    const c = PALETTE[colorCounterRef.current % PALETTE.length];
    colorCounterRef.current++;
    return c;
  }

  function addToWheel(person: Person, count: number) {
    setSegmentOverride(null); // reset shuffle so new entry appears in natural order
    setEntries((prev) => {
      const idx = prev.findIndex((e) => e.personId === person.id);
      if (idx >= 0) {
        return prev.map((e, i) => (i === idx ? { ...e, count: e.count + count } : e));
      }
      return [
        ...prev,
        {
          key: `${person.id}-${Date.now()}`,
          personId: person.id,
          name: person.name,
          count,
          color: pickColor(),
        },
      ];
    });
    setSelectedPerson(null);
    setAddCount(1);
  }

  function removeEntry(personId: string) {
    setSegmentOverride(null);
    setEntries((prev) => prev.filter((e) => e.personId !== personId));
  }

  function removeWinnerFromWheel() {
    if (!winner) return;
    setSegmentOverride(null);
    setEntries((prev) => {
      const idx = prev.findIndex((e) => e.name === winner);
      if (idx < 0) return prev;
      if (prev[idx].count <= 1) return prev.filter((_, i) => i !== idx);
      return prev.map((e, i) => (i === idx ? { ...e, count: e.count - 1 } : e));
    });
    setWinner(null);
  }

  function shuffleEntries() {
    // Expand every entry into individual segments, then Fisher-Yates shuffle
    // across ALL slots so the same person's tickets are spread randomly
    // around the wheel rather than grouped together.
    const flat = buildSegments(entries);
    for (let i = flat.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [flat[i], flat[j]] = [flat[j], flat[i]];
    }
    setSegmentOverride(flat);
  }

  // ── Filtering ─────────────────────────────────────────────────────────────

  const filtered = people.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const grouped: Record<Category, Person[]> = {
    akonga: filtered.filter((p) => p.category === "akonga"),
    kaiako: filtered.filter((p) => p.category === "kaiako"),
    whanau: filtered.filter((p) => p.category === "whanau"),
  };

  const totalSegments = buildSegments(entries).length;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-midnight-tidal flex flex-col lg:flex-row">

      {/* ── Left sidebar: participant list ── */}
      <aside className="w-full lg:w-72 xl:w-80 bg-iron-depth border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col shrink-0 max-h-[50vh] lg:max-h-[calc(100vh-6rem)] lg:sticky lg:top-24">

        <div className="p-5 border-b border-white/10 shrink-0">
          <h2 className="font-display text-2xl text-white mb-3">participants</h2>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search names…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-midnight-tidal border border-white/10 rounded-lg pl-8 pr-3 py-2 text-sm font-sans text-white placeholder-white/30 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-5">
          {loading ? (
            <p className="font-sans text-sm text-white/40 text-center py-8">
              Loading participants…
            </p>
          ) : people.length === 0 ? (
            <p className="font-sans text-sm text-white/40 text-center py-8">
              No participants found.
            </p>
          ) : (
            (["akonga", "kaiako", "whanau"] as Category[]).map((cat) => {
              const group = grouped[cat];
              if (group.length === 0) return null;
              return (
                <div key={cat}>
                  <p className="font-sans text-[10px] uppercase tracking-widest text-white/30 px-2 mb-1.5">
                    {CATEGORY_LABELS[cat]}
                  </p>
                  <ul className="space-y-0.5">
                    {group.map((person) =>
                      selectedPerson?.id === person.id ? (
                        /* Expanded add panel */
                        <li key={person.id}>
                          <div className="rounded-lg border border-primary/40 bg-primary/10 p-3">
                            <p className="font-sans text-sm text-white font-medium mb-3 truncate">
                              {person.name}
                            </p>
                            <div className="flex items-center gap-2 mb-3">
                              <button
                                onClick={() => setAddCount((c) => Math.max(1, c - 1))}
                                className="w-7 h-7 flex items-center justify-center rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
                              >
                                <Minus size={11} />
                              </button>
                              <span className="font-sans text-sm text-white w-8 text-center tabular-nums">
                                {addCount}
                              </span>
                              <button
                                onClick={() => setAddCount((c) => c + 1)}
                                className="w-7 h-7 flex items-center justify-center rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
                              >
                                <Plus size={11} />
                              </button>
                              <span className="font-sans text-xs text-white/40 ml-1">
                                {addCount === 1 ? "entry" : "entries"}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => addToWheel(person, addCount)}
                                className="flex-1 text-xs font-sans font-medium bg-primary hover:bg-primary/80 text-white rounded-md py-1.5 transition-colors"
                              >
                                Add to wheel
                              </button>
                              <button
                                onClick={() => { setSelectedPerson(null); setAddCount(1); }}
                                className="w-7 h-7 flex items-center justify-center rounded bg-white/10 hover:bg-white/20 text-white/50 transition-colors"
                              >
                                <X size={11} />
                              </button>
                            </div>
                          </div>
                        </li>
                      ) : (
                        /* Normal row */
                        <li key={person.id}>
                          <button
                            onClick={() => { setSelectedPerson(person); setAddCount(1); }}
                            className="w-full text-left rounded-lg px-3 py-2 hover:bg-white/5 transition-colors group flex items-center justify-between gap-2"
                          >
                            <span className="font-sans text-sm text-white/65 group-hover:text-white transition-colors truncate">
                              {person.name}
                            </span>
                            <Plus
                              size={12}
                              className="text-white/20 group-hover:text-primary transition-colors shrink-0"
                            />
                          </button>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* ── Main area: wheel + controls ── */}
      <main className="flex-1 flex flex-col items-center py-10 px-6 lg:px-10 gap-8">

        <div className="w-full max-w-xl">
          <h1 className="font-display text-5xl md:text-6xl text-white mb-2">
            spin the wheel
          </h1>
          <p className="font-sans text-white/50 text-sm leading-relaxed">
            Add participants from the list, then spin to pick a winner at random.
          </p>
        </div>

        {/* Wheel + pointer */}
        <div className="relative flex items-center justify-center">
          {/* Triangle pointer — points down toward the wheel rim */}
          <div
            className="absolute z-10"
            style={{
              top: -4,
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "13px solid transparent",
              borderRight: "13px solid transparent",
              borderTop: "22px solid #2ca3bb",
              filter: "drop-shadow(0 2px 4px rgba(44,163,187,0.5))",
            }}
          />
          <canvas
            ref={canvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            style={{
              width: "min(460px, 90vw)",
              height: "min(460px, 90vw)",
              borderRadius: "50%",
            }}
          />
        </div>

        {/* Spin + Randomise buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={spin}
            disabled={spinning || totalSegments === 0}
            className="h-14 px-12 rounded-xl font-sans font-semibold text-base bg-primary text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 ease-[cubic-bezier(.165,.84,.44,1)] hover:enabled:-translate-y-0.5 hover:enabled:bg-primary/90"
          >
            {spinning ? "Spinning…" : "Spin!"}
          </button>
          <button
            onClick={shuffleEntries}
            disabled={spinning || entries.length < 2}
            title="Randomise order"
            className="h-14 w-14 flex items-center justify-center rounded-xl border border-white/15 text-white/50 disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:border-primary hover:enabled:text-primary transition-all duration-200"
          >
            <Shuffle size={20} />
          </button>
        </div>

        {/* Current entries */}
        {entries.length > 0 && (
          <div className="w-full max-w-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-sans text-xs uppercase tracking-widest text-white/40">
                On the wheel —{" "}
                <span className="text-white/60 tabular-nums">
                  {totalSegments} {totalSegments === 1 ? "entry" : "entries"}
                </span>
              </h3>
              <button
                onClick={() => { setEntries([]); setSegmentOverride(null); colorCounterRef.current = 0; }}
                className="font-sans text-xs text-white/30 hover:text-semantic-red transition-colors flex items-center gap-1.5"
              >
                <Trash2 size={11} />
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {entries.map((entry) => (
                <div
                  key={entry.key}
                  className="flex items-center gap-2 rounded-full pl-3 pr-1.5 py-1 text-sm font-sans border"
                  style={{
                    borderColor: `${entry.color}55`,
                    backgroundColor: `${entry.color}18`,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-white/80">{entry.name}</span>
                  {entry.count > 1 && (
                    <span
                      className="font-sans text-xs font-semibold px-1.5 py-0.5 rounded-full tabular-nums"
                      style={{ backgroundColor: `${entry.color}30`, color: entry.color }}
                    >
                      ×{entry.count}
                    </span>
                  )}
                  <button
                    onClick={() => removeEntry(entry.personId)}
                    className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/10 text-white/35 hover:text-white/80 transition-colors ml-0.5"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ── Winner modal ── */}
      <AnimatePresence>
        {winner && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(5,10,28,0.75)", backdropFilter: "blur(8px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative bg-iron-depth border border-white/10 rounded-2xl p-8 md:p-12 max-w-sm w-full text-center shadow-2xl"
              initial={{ scale: 0.65, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
            >
              {/* Confetti emoji */}
              <motion.div
                className="text-6xl mb-5 select-none"
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 18, delay: 0.08 }}
              >
                🎉
              </motion.div>

              <motion.h2
                className="font-display text-4xl text-primary mb-2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
              >
                congratulations!
              </motion.h2>

              <motion.p
                className="font-sans text-white/50 text-sm mb-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.24 }}
              >
                The wheel has chosen…
              </motion.p>

              <motion.p
                className="font-display text-4xl md:text-5xl text-white mb-8 leading-tight"
                initial={{ opacity: 0, scale: 0.75 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 350, damping: 22, delay: 0.28 }}
              >
                {winner}
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38 }}
              >
                <button
                  onClick={() => setWinner(null)}
                  className="flex-1 h-11 rounded-lg border border-white/20 font-sans text-sm text-white/65 hover:text-white hover:border-white/40 transition-colors"
                >
                  Keep in wheel
                </button>
                <button
                  onClick={removeWinnerFromWheel}
                  className="flex-1 h-11 rounded-lg bg-primary hover:bg-primary/90 font-sans text-sm font-medium text-white transition-colors"
                >
                  Remove from wheel
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
