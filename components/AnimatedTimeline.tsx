"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ImageIcon } from "lucide-react";

const milestones = [
  {
    year: "2021",
    text: "Ngaru Pou Cultural Arts Inc. founded with a vision to bring culturally grounded learning online.",
  },
  {
    year: "2022",
    text: "First cohort of students enrolled across Te Pūmanawa and Te Pūkenga Rau levels.",
  },
  {
    year: "2023",
    text: "Platform expanded to all three levels, with a dedicated kaiako messaging system launched.",
  },
  {
    year: "2024",
    text: "Parent enrolment portal and student progress tracking introduced for a complete whānau experience.",
  },
  {
    year: "2025",
    text: "New multimedia lessons, digital achievements, and a redesigned platform rolled out community-wide.",
  },
];

// Logo-inspired gradient: indigo/purple → teal → lagoon-drift
const GRAD_TOP = "#5b5fef";
const GRAD_MID = "#2ca3bb";
const GRAD_BOT = "#60cad8";
const LINE_GRADIENT = `linear-gradient(to bottom, ${GRAD_TOP}, ${GRAD_MID}, ${GRAD_BOT})`;

function MilestoneRow({
  m,
  dotRef,
}: {
  m: (typeof milestones)[number];
  dotRef?: React.RefObject<HTMLDivElement>;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rowRef, { once: true, margin: "-60px 0px" });

  return (
    <div
      ref={rowRef}
      className="grid grid-cols-[100px_20px_1fr] gap-x-5 sm:grid-cols-[160px_24px_1fr] sm:gap-x-8 pb-20 last:pb-0 items-start"
    >
      {/* ── Year label — LEFT of the line ── */}
      <motion.div
        className="text-right"
        style={{ marginTop: "-8px" }}
        initial={{ opacity: 0, x: 10 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <p
          className="font-display text-primary leading-none"
          style={{ fontSize: "clamp(36px, 5vw, 60px)" }}
        >
          {m.year}
        </p>
      </motion.div>

      {/* ── Dot — ON the line ── */}
      <div className="flex justify-center items-start pt-1 relative z-10">
        {/* Pulse ring */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 28,
            height: 28,
            top: -6,
            left: "50%",
            translateX: "-50%",
            border: `1px solid ${GRAD_MID}80`,
          }}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={inView ? { scale: 1.9, opacity: [0.6, 0] } : {}}
          transition={{ duration: 0.8, delay: 0.15 }}
        />
        {/* Dot */}
        <motion.div
          ref={dotRef}
          className="h-4 w-4 rounded-full border-2 flex-shrink-0"
          style={{ borderColor: GRAD_MID }}
          initial={{ backgroundColor: "#e1f2ff" }}
          animate={inView ? { backgroundColor: GRAD_MID } : {}}
          transition={{ duration: 0.35, delay: 0.1 }}
        />
      </div>

      {/* ── Content — RIGHT of the line ── */}
      <div className="min-w-0">
        {/* Placeholder image */}
        <motion.div
          className="relative rounded-2xl overflow-hidden aspect-video mb-5 flex flex-col items-center justify-center gap-2 border-2 border-dashed"
          style={{ borderColor: `${GRAD_MID}30`, background: `${GRAD_MID}08` }}
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <ImageIcon size={28} style={{ color: `${GRAD_MID}50` }} strokeWidth={1.5} />
          <span className="font-sans text-xs uppercase tracking-[0.12em]" style={{ color: `${GRAD_MID}60` }}>
            Add photo for {m.year}
          </span>
        </motion.div>

        {/* Description */}
        <motion.p
          className="font-sans text-iron-depth/80 text-[1.05rem] leading-relaxed"
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {m.text}
        </motion.p>
      </div>
    </div>
  );
}

export default function AnimatedTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const firstDotRef = useRef<HTMLDivElement>(null);
  const lastDotRef = useRef<HTMLDivElement>(null);

  const [track, setTrack] = useState({ top: 0, left: 0, height: 0 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "end 55%"],
  });

  const indicatorY = useTransform(scrollYProgress, [0, 1], [0, track.height]);

  useEffect(() => {
    const measure = () => {
      const container = sectionRef.current;
      const first = firstDotRef.current;
      const last = lastDotRef.current;
      if (!container || !first || !last) return;

      const cRect = container.getBoundingClientRect();
      const fRect = first.getBoundingClientRect();
      const lRect = last.getBoundingClientRect();

      setTrack({
        top: fRect.top + fRect.height / 2 - cRect.top,
        left: fRect.left + fRect.width / 2 - cRect.left - 1,
        height: lRect.top + lRect.height / 2 - (fRect.top + fRect.height / 2),
      });
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div ref={sectionRef} className="max-w-3xl mx-auto relative">

      {/* ── Gradient track line ── */}
      {track.height > 0 && (
        <div
          className="absolute pointer-events-none"
          style={{ top: track.top, left: track.left, height: track.height, width: 2 }}
        >
          {/* Faded background track */}
          <div
            className="absolute inset-0 rounded-full opacity-20"
            style={{ background: LINE_GRADIENT }}
          />

          {/* Animated fill */}
          <motion.div
            className="absolute inset-0 rounded-full origin-top"
            style={{ scaleY: scrollYProgress, background: LINE_GRADIENT }}
          />

          {/* Travelling glow dot */}
          <motion.div
            className="absolute rounded-full"
            style={{
              left: -5,
              width: 12,
              height: 12,
              top: indicatorY,
              translateY: "-50%",
              background: GRAD_MID,
              boxShadow: `0 0 14px 5px ${GRAD_MID}55`,
            }}
          />
        </div>
      )}

      {/* ── Milestone rows ── */}
      {milestones.map((m, i) => (
        <MilestoneRow
          key={m.year}
          m={m}
          dotRef={
            i === 0
              ? firstDotRef
              : i === milestones.length - 1
              ? lastDotRef
              : undefined
          }
        />
      ))}
    </div>
  );
}
