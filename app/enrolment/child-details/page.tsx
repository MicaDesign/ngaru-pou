"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import DocPageLayout from "@/components/DocPageLayout";

type ChildForm = {
  fullName: string;
  dob: string;
  level: string;
  medical: string;
  username: string;
  pin: string;
};

const EMPTY_CHILD: ChildForm = {
  fullName: "",
  dob: "",
  level: "",
  medical: "",
  username: "",
  pin: "",
};

const LEVELS = [
  { value: "te-pumanawa", label: "Te Pūmanawa (5–8 yrs)" },
  { value: "te-pukenga-rau", label: "Te Pūkenga Rau (9–12 yrs)" },
  { value: "te-pukenga", label: "Te Pūkenga (13–19 yrs)" },
];

function planToCount(plan: string | null): number {
  if (plan === "2-children") return 2;
  if (plan === "3-plus-children") return 3;
  return 1;
}

export default function ChildDetailsPage() {
  const [count, setCount] = useState<number | null>(null);
  const [children, setChildren] = useState<ChildForm[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const plan = localStorage.getItem("np_enrolment_plan");
    const n = planToCount(plan);
    setCount(n);
    setChildren(Array.from({ length: n }, () => ({ ...EMPTY_CHILD })));
  }, []);

  function updateChild(i: number, patch: Partial<ChildForm>) {
    setChildren((prev) =>
      prev.map((c, idx) => (idx === i ? { ...c, ...patch } : c))
    );
  }

  if (count === null) {
    return (
      <DocPageLayout title="Child Details">
        <p>Loading…</p>
      </DocPageLayout>
    );
  }

  const inputClass =
    "w-full bg-white border border-midnight-tidal/15 rounded-lg px-4 py-3 text-midnight-tidal placeholder-midnight-tidal/30 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all";

  return (
    <DocPageLayout title="Child Details">
      <p>
        Please provide details for each tamaiti you&apos;re enrolling.
        Your child will use their username and PIN to log in on their
        own.
      </p>

      <div className="flex flex-wrap gap-2 mb-6" role="tablist">
        {children.map((child, i) => {
          const label = child.fullName.trim() || `Child ${i + 1}`;
          const isActive = i === activeIndex;
          return (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveIndex(i)}
              className={`px-4 py-2 rounded-full font-sans text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "bg-white text-midnight-tidal/70 hover:text-midnight-tidal"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {children.map((child, i) => {
        if (i !== activeIndex) return null;
        return (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 md:p-8 border border-midnight-tidal/10 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-midnight-tidal/70 mb-1.5">
                  Full name
                </label>
                <input
                  type="text"
                  required
                  value={child.fullName}
                  onChange={(e) =>
                    updateChild(i, { fullName: e.target.value })
                  }
                  className={inputClass}
                  placeholder="First and last name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-midnight-tidal/70 mb-1.5">
                  Date of birth
                </label>
                <input
                  type="date"
                  required
                  value={child.dob}
                  onChange={(e) => updateChild(i, { dob: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-midnight-tidal/70 mb-1.5">
                  Group / Level
                </label>
                <select
                  required
                  value={child.level}
                  onChange={(e) => updateChild(i, { level: e.target.value })}
                  className={inputClass}
                >
                  <option value="">Select a level…</option>
                  {LEVELS.map((lvl) => (
                    <option key={lvl.value} value={lvl.value}>
                      {lvl.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-midnight-tidal/70 mb-1.5">
                  Medical conditions or allergies{" "}
                  <span className="text-midnight-tidal/40 font-normal">
                    (optional)
                  </span>
                </label>
                <textarea
                  value={child.medical}
                  onChange={(e) =>
                    updateChild(i, { medical: e.target.value })
                  }
                  rows={3}
                  className={inputClass}
                  placeholder="Anything we should know to keep your tamaiti safe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-midnight-tidal/70 mb-1.5">
                  Student username
                </label>
                <input
                  type="text"
                  required
                  value={child.username}
                  onChange={(e) =>
                    updateChild(i, { username: e.target.value })
                  }
                  className={inputClass}
                  placeholder="e.g. maia123"
                />
                <span className="mt-1.5 block text-xs text-midnight-tidal/50">
                  Your child will use this to log in.
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-midnight-tidal/70 mb-1.5">
                  Student PIN
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  required
                  value={child.pin}
                  onChange={(e) =>
                    updateChild(i, {
                      pin: e.target.value.replace(/\D/g, "").slice(0, 4),
                    })
                  }
                  className={`${inputClass} tracking-[0.4em]`}
                  placeholder="••••"
                />
                <span className="mt-1.5 block text-xs text-midnight-tidal/50">
                  4 digits. Your child will use this instead of a
                  password.
                </span>
              </div>
            </div>
          </div>
        );
      })}

      <Link
        href="/enrolment/complete"
        className="inline-flex items-center gap-2 rounded-lg bg-primary hover:bg-primary-light !text-white hover:!text-white font-sans font-semibold px-6 py-3.5 !no-underline transition-all duration-300 ease-[cubic-bezier(.165,.84,.44,1)] hover:-translate-y-0.5"
      >
        Continue to Payment
        <ArrowRight size={18} />
      </Link>
    </DocPageLayout>
  );
}
