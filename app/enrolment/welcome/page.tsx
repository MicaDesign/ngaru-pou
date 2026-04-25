import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import DocPageLayout from "@/components/DocPageLayout";
import AuthGuard from "@/components/AuthGuard";

export const metadata: Metadata = {
  title: "Welcome | Ngaru Pou Cultural Arts",
  description:
    "Begin your whānau's enrolment journey with Ngaru Pou Cultural Arts Inc.",
};

export default function WelcomePage() {
  return (
    <AuthGuard>
      <DocPageLayout title="Welcome, e te mātua">
      <p>
        Nau mai, haere mai. We&apos;re so glad you&apos;re thinking about
        joining the Ngaru Pou whānau. This enrolment takes about{" "}
        <strong>5–10 minutes</strong> — once you&apos;re done, your
        tamariki will be able to log in and begin their learning journey.
      </p>

      <h2>What to expect</h2>
      <ol>
        <li>
          <strong>Review and agree to our policies</strong> — Code of
          Conduct and Terms of Service.
        </li>
        <li>
          <strong>Enter your contact details</strong> so the komiti can
          reach you.
        </li>
        <li>
          <strong>Select your membership plan</strong> based on the number
          of children joining.
        </li>
        <li>
          <strong>Add your children&apos;s details</strong> and create
          their student profiles.
        </li>
        <li>
          <strong>Complete payment</strong> to unlock access.
        </li>
      </ol>

      <h2>What you&apos;ll need</h2>
      <ul>
        <li>Your children&apos;s full names and dates of birth</li>
        <li>
          The group level for each child:
          <ul>
            <li>Te Pūmanawa — 5–8 years</li>
            <li>Te Pūkenga Rau — 9–12 years</li>
            <li>Te Pūkenga — 13–19 years</li>
          </ul>
        </li>
        <li>Any medical conditions or allergies we should know about</li>
      </ul>

      <div className="mt-10">
        <Link
          href="/enrolment/consent"
          className="inline-flex items-center gap-2 rounded-lg bg-primary !text-white hover:bg-primary-light hover:!text-white font-sans font-semibold px-6 py-3.5 !no-underline transition-all duration-300 ease-[cubic-bezier(.165,.84,.44,1)] hover:-translate-y-0.5"
        >
          Begin Enrolment
          <ArrowRight size={18} />
        </Link>
      </div>
      </DocPageLayout>
    </AuthGuard>
  );
}
