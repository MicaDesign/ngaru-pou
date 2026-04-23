import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import DocPageLayout from "@/components/DocPageLayout";

export const metadata: Metadata = {
  title: "Enrolment Complete | Ngaru Pou Cultural Arts",
  description:
    "Your whānau's enrolment with Ngaru Pou Cultural Arts Inc. is complete.",
};

export default function EnrolmentCompletePage() {
  return (
    <DocPageLayout title="Nau mai, haere mai!">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-semantic-green/15 text-semantic-green mb-6">
        <CheckCircle size={32} />
      </div>

      <p>
        <strong>Your enrolment has been received.</strong> Thank you for
        joining the Ngaru Pou whānau — we&apos;re so excited to have your
        tamariki with us.
      </p>
      <p>
        Your payment will be processed shortly and you&apos;ll receive a
        confirmation email once everything is set up.
      </p>

      <h2>What happens next</h2>
      <ol>
        <li>
          You&apos;ll receive a <strong>confirmation email</strong> from
          the komiti with a receipt and next steps.
        </li>
        <li>
          Your children&apos;s student profiles are being created and
          will be ready soon.
        </li>
        <li>
          Your tamariki can log in any time at{" "}
          <Link href="/student-login">/student-login</Link> using the
          username and PIN you set for them.
        </li>
        <li>
          You can view progress and manage your whānau from your parent
          dashboard.
        </li>
      </ol>

      <div className="mt-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-lg bg-primary hover:bg-primary-light !text-white hover:!text-white font-sans font-semibold px-6 py-3.5 !no-underline transition-all duration-300 ease-[cubic-bezier(.165,.84,.44,1)] hover:-translate-y-0.5"
        >
          Go to Parent Dashboard
          <ArrowRight size={18} />
        </Link>
      </div>
    </DocPageLayout>
  );
}
