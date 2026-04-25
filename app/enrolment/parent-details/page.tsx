"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, AlertCircle } from "lucide-react";
import DocPageLayout from "@/components/DocPageLayout";
import AuthGuard from "@/components/AuthGuard";
import { getMemberstack } from "@/lib/memberstack";
import { upsertParentProfile } from "@/lib/parentProfile";

const STATES = [
  { value: "WA", label: "Western Australia" },
  { value: "NSW", label: "New South Wales" },
  { value: "VIC", label: "Victoria" },
  { value: "QLD", label: "Queensland" },
  { value: "SA", label: "South Australia" },
  { value: "TAS", label: "Tasmania" },
  { value: "NT", label: "Northern Territory" },
  { value: "ACT", label: "Australian Capital Territory" },
];

type MemberShape = {
  id?: string;
};

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

export default function ParentDetailsPage() {
  return (
    <AuthGuard>
      <ParentDetailsForm />
    </AuthGuard>
  );
}

function ParentDetailsForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [suburb, setSuburb] = useState("");
  const [state, setState] = useState("");
  const [postcode, setPostcode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
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
          "You need to be logged in to continue. Please log in and try again.",
        );
      }

      await safeApiCall("Saving your details", () =>
        upsertParentProfile(member.id!, {
          phone,
          street,
          suburb,
          state,
          postcode,
        }),
      );

      router.push("/enrolment/select-plan");
    } catch (err) {
      console.error("parent-details submit failed", err);
      setError(extractErrorMessage(err));
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full bg-white border border-midnight-tidal/15 rounded-lg px-4 py-3 text-midnight-tidal placeholder-midnight-tidal/30 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed";

  return (
    <DocPageLayout title="Your Details">
      <p>
        Tell us how to reach you. We&apos;ll keep these details on file
        for the komiti and use them only for roopu communication.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-midnight-tidal/10 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-midnight-tidal/70 mb-1.5">
                Phone number
              </label>
              <input
                type="tel"
                required
                disabled={submitting}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
                placeholder="04XX XXX XXX"
                autoComplete="tel"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-midnight-tidal/70 mb-1.5">
                Street address
              </label>
              <input
                type="text"
                required
                disabled={submitting}
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className={inputClass}
                placeholder="123 Hammond Road"
                autoComplete="street-address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-midnight-tidal/70 mb-1.5">
                Suburb
              </label>
              <input
                type="text"
                required
                disabled={submitting}
                value={suburb}
                onChange={(e) => setSuburb(e.target.value)}
                className={inputClass}
                placeholder="Success"
                autoComplete="address-level2"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-midnight-tidal/70 mb-1.5">
                  State
                </label>
                <select
                  required
                  disabled={submitting}
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className={inputClass}
                  autoComplete="address-level1"
                >
                  <option value="">Select…</option>
                  {STATES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-midnight-tidal/70 mb-1.5">
                  Postcode
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{4}"
                  maxLength={4}
                  required
                  disabled={submitting}
                  value={postcode}
                  onChange={(e) =>
                    setPostcode(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  className={inputClass}
                  placeholder="6164"
                  autoComplete="postal-code"
                />
              </div>
            </div>
          </div>
        </div>

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
              Saving your details…
            </>
          ) : (
            <>
              Continue to Plan
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
    </DocPageLayout>
  );
}
