"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import DocPageLayout from "@/components/DocPageLayout";
import AuthGuard from "@/components/AuthGuard";

function CheckboxRow({
  id,
  checked,
  onChange,
  children,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-start gap-4 p-5 rounded-xl border border-midnight-tidal/10 bg-white hover:border-primary/40 transition-colors cursor-pointer"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-5 w-5 rounded border-midnight-tidal/30 accent-primary cursor-pointer shrink-0"
      />
      <span className="leading-relaxed">{children}</span>
    </label>
  );
}

export default function ConsentPage() {
  const [conduct, setConduct] = useState(false);
  const [terms, setTerms] = useState(false);
  const [participation, setParticipation] = useState(false);
  const [media, setMedia] = useState(false);

  const allChecked = conduct && terms && participation && media;

  return (
    <AuthGuard>
      <DocPageLayout title="Consent & Agreements">
      <p>
        Please read and agree to the following before continuing your
        enrolment.
      </p>

      <div className="flex flex-col gap-4 mb-8">
        <CheckboxRow id="conduct" checked={conduct} onChange={setConduct}>
          I have read and agree to the{" "}
          <Link
            href="/enrolment/code-of-conduct"
            target="_blank"
            rel="noopener noreferrer"
          >
            Code of Conduct
          </Link>
          .
        </CheckboxRow>

        <CheckboxRow id="terms" checked={terms} onChange={setTerms}>
          I have read and agree to the{" "}
          <Link
            href="/enrolment/terms-of-service"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Service
          </Link>
          .
        </CheckboxRow>

        <CheckboxRow
          id="participation"
          checked={participation}
          onChange={setParticipation}
        >
          I give consent for my children to participate in Ngaru Pou
          Cultural Arts Inc. activities, performances, wānanga and events.
        </CheckboxRow>

        <CheckboxRow id="media" checked={media} onChange={setMedia}>
          I give consent for photos and videos of my children to be used
          for Ngaru Pou Cultural Arts Inc. purposes including social
          media.
        </CheckboxRow>
      </div>

      <Link
        href={allChecked ? "/enrolment/parent-details" : "#"}
        aria-disabled={!allChecked}
        onClick={(e) => {
          if (!allChecked) e.preventDefault();
        }}
        className={`inline-flex items-center gap-2 rounded-lg font-sans font-semibold px-6 py-3.5 !no-underline transition-all duration-300 ease-[cubic-bezier(.165,.84,.44,1)] ${
          allChecked
            ? "bg-primary hover:bg-primary-light !text-white hover:!text-white hover:-translate-y-0.5"
            : "bg-midnight-tidal/10 !text-midnight-tidal/40 hover:!text-midnight-tidal/40 cursor-not-allowed"
        }`}
      >
        Continue
        <ArrowRight size={18} />
      </Link>
      </DocPageLayout>
    </AuthGuard>
  );
}
