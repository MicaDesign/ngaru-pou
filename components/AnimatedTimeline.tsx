"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

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
    <div ref={rowRef} className="relative flex items-start gap-10 pb-16 last:pb-0">
      {/* Dot */}
      <div ref={dotRef} className="relative z-10 flex-shrink-0 mt-1">
        {/* Pulse ring — fires once when row enters view */}
        <motion.div
          className="absolute rounded-full border border-primary/60"
          style={{ inset: "-6px" }}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={inView ? { scale: 1.8, opacity: [0.7, 0] } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
        />
        {/* Dot fill */}
        <motion.div
          className="h-4 w-4 rounded-full border-2 border-primary"
          initial={{ backgroundColor: "#e1f2ff" }}
          animate={inView ? { backgroundColor: "#2ca3bb" } : {}}
          transition={{ duration: 0.35, delay: 0.1 }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <motion.p
          className="font-sans text-xs font-bold text-primary uppercase tracking-[0.15em] mb-2"
          initial={{ opacity: 0, x: -12 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
        >
          {m.year}
        </motion.p>
        <motion.p
          className="font-sans text-iron-depth/85 text-[1.05rem] leading-relaxed"
          initial={{ opacity: 0, x: 12 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
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

  // Track line bounds measured from dot centres
  const [trackTop, setTrackTop] = useState(0);
  const [trackHeight, setTrackHeight] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "end 55%"],
  });

  const indicatorY = useTransform(scrollYProgress, [0, 1], [0, trackHeight]);

  useEffect(() => {
    const measure = () => {
      const container = sectionRef.current;
      const first = firstDotRef.current;
      const last = lastDotRef.current;
      if (!container || !first || !last) return;

      const cRect = container.getBoundingClientRect();
      const fRect = first.getBoundingClientRect();
      const lRect = last.getBoundingClientRect();

      const top = fRect.top + fRect.height / 2 - cRect.top;
      const bottom = lRect.top + lRect.height / 2 - cRect.top;

      setTrackTop(top);
      setTrackHeight(bottom - top);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div ref={sectionRef} className="max-w-2xl mx-auto relative">
      {/* Track line — absolutely positioned between first and last dot centres */}
      {trackHeight > 0 && (
        <div
          className="absolute left-[7px] pointer-events-none"
          style={{ top: trackTop, height: trackHeight }}
        >
          {/* Faded background track */}
          <div className="absolute inset-x-0 top-0 bottom-0 w-0.5 bg-primary/15 rounded-full" />

          {/* Animated fill line */}
          <motion.div
            className="absolute inset-x-0 top-0 bottom-0 w-0.5 bg-primary rounded-full origin-top"
            style={{ scaleY: scrollYProgress }}
          />

          {/* Travelling glow dot */}
          <motion.div
            className="absolute w-3 h-3 rounded-full bg-primary shadow-[0_0_14px_5px_rgba(44,163,187,0.4)]"
            style={{
              left: "-5px",
              top: indicatorY,
              translateY: "-50%",
            }}
          />
        </div>
      )}

      {/* Milestone rows */}
      {milestones.map((m, i) => (
        <MilestoneRow
          key={m.year}
          m={m}
          dotRef={i === 0 ? firstDotRef : i === milestones.length - 1 ? lastDotRef : undefined}
        />
      ))}
    </div>
  );
}
