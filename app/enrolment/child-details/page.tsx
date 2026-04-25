"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, AlertCircle } from "lucide-react";
import DocPageLayout from "@/components/DocPageLayout";
import AuthGuard from "@/components/AuthGuard";
import { getMemberstack } from "@/lib/memberstack";

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

function pickField(
  cf: Record<string, unknown> | undefined,
  ...keys: string[]
): string {
  if (!cf) return "";
  for (const k of keys) {
    const v = cf[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}

function extractErrorMessage(err: unknown): string {
  if (!err) return "Unknown error";
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  if (typeof err === "object") {
    const e = err as Record<string, unknown>;
    const nested = (e.error ?? e.data ?? e.body) as
      | Record<string, unknown>
      | undefined;
    const candidates: unknown[] = [
      e.message,
      nested?.message,
      e.code,
      nested?.code,
      e.type,
    ];
    for (const c of candidates) {
      if (typeof c === "string" && c.trim()) return c;
    }
    try {
      return JSON.stringify(err);
    } catch {
      return String(err);
    }
  }
  return String(err);
}

async function safeApiCall(
  label: string,
  fn: () => Promise<unknown>,
): Promise<unknown> {
  try {
    return await fn();
  } catch (err) {
    console.error(`API call failed — ${label}:`, err);
    throw new Error(`${label}: ${extractErrorMessage(err)}`);
  }
}

type MemberShape = {
  id?: string;
  auth?: { email?: string };
  customFields?: Record<string, unknown>;
};

type RecordsResponse = {
  data?: { records?: unknown[] };
};

export default function ChildDetailsPage() {
  return (
    <AuthGuard>
      <ChildDetailsForm />
    </AuthGuard>
  );
}

function ChildDetailsForm() {
  const router = useRouter();
  const [count, setCount] = useState<number | null>(null);
  const [children, setChildren] = useState<ChildForm[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const plan = localStorage.getItem("np_enrolment_plan");
    const n = planToCount(plan);
    setCount(n);
    setChildren(Array.from({ length: n }, () => ({ ...EMPTY_CHILD })));
  }, []);

  function updateChild(i: number, patch: Partial<ChildForm>) {
    setChildren((prev) =>
      prev.map((c, idx) => (idx === i ? { ...c, ...patch } : c)),
    );
  }

  function findInvalidChildIndex(): number {
    for (let i = 0; i < children.length; i++) {
      const c = children[i];
      if (
        !c.fullName.trim() ||
        !c.dob ||
        !c.level ||
        !c.username.trim() ||
        c.pin.length !== 4
      ) {
        return i;
      }
    }
    return -1;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const invalidIdx = findInvalidChildIndex();
    if (invalidIdx >= 0) {
      setActiveIndex(invalidIdx);
      setError(
        `Please complete all required fields for Child ${invalidIdx + 1}.`,
      );
      return;
    }

    setSubmitting(true);
    try {
      const ms = getMemberstack();
      if (!ms) {
        throw new Error(
          "Sign-in service is not available. Please refresh and try again.",
        );
      }

      const memberResult = (await safeApiCall(
        "Loading current member",
        () => ms.getCurrentMember(),
      )) as { data?: MemberShape };
      const member = memberResult.data;
      if (!member?.id) {
        throw new Error(
          "You need to be logged in to complete enrolment. Please log in and try again.",
        );
      }

      const memberId = member.id;
      const customFields = member.customFields;

      const parentLookup = (await safeApiCall(
        "Looking up parent profile",
        () =>
          ms.queryDataRecords({
            table: "parent_profiles",
            query: {
              where: { memberId: { equals: memberId } },
              take: 1,
            },
          }),
      )) as RecordsResponse;
      const parentRecords = parentLookup.data?.records ?? [];
      const hasParentRow = parentRecords.length > 0;
      if (!hasParentRow) {
        await safeApiCall("Creating parent profile", () =>
          ms.createDataRecord({
            table: "parent_profiles",
            data: {
              email: member.auth?.email ?? "",
              first_name: pickField(customFields, "first-name", "firstName"),
              last_name: pickField(customFields, "last-name", "lastName"),
            },
          }),
        );
      }

      for (let idx = 0; idx < children.length; idx++) {
        const child = children[idx];
        const childLabel = child.fullName.trim() || `Child ${idx + 1}`;
        await safeApiCall(`Saving ${childLabel}`, () =>
          ms.createDataRecord({
            table: "student_profiles",
            data: {
              first_name: child.fullName,
              last_name: "",
              date_of_birth: child.dob,
              level: child.level,
              username: child.username,
              pin: child.pin,
              medical_notes: child.medical,
            },
          }),
        );
      }

      localStorage.removeItem("np_enrolment_plan");
      router.push("/enrolment/complete");
    } catch (err) {
      console.error("child-details submit failed", err);
      setError(extractErrorMessage(err));
      setSubmitting(false);
    }
  }

  if (count === null) {
    return (
      <DocPageLayout title="Child Details">
        <p>Loading…</p>
      </DocPageLayout>
    );
  }

  const inputClass =
    "w-full bg-white border border-midnight-tidal/15 rounded-lg px-4 py-3 text-midnight-tidal placeholder-midnight-tidal/30 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed";

  return (
    <DocPageLayout title="Child Details">
      <p>
        Please provide details for each tamaiti you&apos;re enrolling.
        Your child will use their username and PIN to log in on their
        own.
      </p>

      <form onSubmit={handleSubmit}>
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
              className="bg-white rounded-2xl p-6 md:p-8 border border-midnight-tidal/10 mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-midnight-tidal/70 mb-1.5">
                    Full name
                  </label>
                  <input
                    type="text"
                    required
                    disabled={submitting}
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
                    disabled={submitting}
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
                    disabled={submitting}
                    value={child.level}
                    onChange={(e) =>
                      updateChild(i, { level: e.target.value })
                    }
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
                    disabled={submitting}
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
                    disabled={submitting}
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
                    disabled={submitting}
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

        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-semantic-red/10 border border-semantic-red/20 px-4 py-3 mb-6">
            <AlertCircle
              size={16}
              className="text-semantic-red mt-0.5 shrink-0"
            />
            <span className="block text-semantic-red text-sm leading-snug break-words">
              {error}
            </span>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-lg bg-primary hover:bg-primary-light text-white font-sans font-semibold px-6 py-3.5 transition-all duration-300 ease-[cubic-bezier(.165,.84,.44,1)] hover:-translate-y-0.5 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:scale-100"
        >
          {submitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Saving child profiles…
            </>
          ) : (
            <>
              Continue to Payment
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
    </DocPageLayout>
  );
}
