"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import DocPageLayout from "@/components/DocPageLayout";
import { getMemberstack } from "@/lib/memberstack";

declare global {
  interface Window {
    $memberstackDom?: {
      purchasePlansWithCheckout: (args: {
        priceId: string;
      }) => Promise<unknown>;
    };
  }
}

type PlanId = "1-child" | "2-children" | "3-plus-children";

const PLANS: Array<{
  id: PlanId;
  title: string;
  price: string;
  summary: string;
  priceId: string;
}> = [
  {
    id: "1-child",
    title: "One Child",
    price: "$250/year",
    summary: "Annual membership for one tamaiti",
    priceId: "prc_annual-fee-crsr030o",
  },
  {
    id: "2-children",
    title: "Two Children",
    price: "$350/year",
    summary: "Annual membership for two tamariki",
    priceId: "prc_two-children-03su03t9",
  },
  {
    id: "3-plus-children",
    title: "Three or More Children",
    price: "$500/year",
    summary:
      "Annual membership for three or more tamariki (immediate siblings)",
    priceId: "prc_three-or-more-children-wd1cs0e9h",
  },
];

const INCLUDED = [
  "Access to all levels",
  "Parent dashboard",
  "Individual student profiles",
];

export default function SelectPlanPage() {
  const [selected, setSelected] = useState<PlanId | null>(null);

  useEffect(() => {
    const existing = localStorage.getItem("np_enrolment_plan") as PlanId | null;
    if (existing && PLANS.some((p) => p.id === existing)) {
      setSelected(existing);
    }
  }, []);

  function handleSelect(id: PlanId) {
    setSelected(id);
    localStorage.setItem("np_enrolment_plan", id);
  }

  async function handleContinue() {
    if (!selected) return;
    const plan = PLANS.find((p) => p.id === selected);
    if (!plan) return;
    getMemberstack();
    if (!window.$memberstackDom?.purchasePlansWithCheckout) return;
    await window.$memberstackDom.purchasePlansWithCheckout({
      priceId: plan.priceId,
    });
  }

  return (
    <DocPageLayout title="Select Your Plan">
      <p>
        Choose the plan that matches the number of children you&apos;re
        enrolling. You can update this later by contacting the komiti.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {PLANS.map((plan) => {
          const isSelected = selected === plan.id;
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => handleSelect(plan.id)}
              aria-pressed={isSelected}
              className={`text-left rounded-2xl p-6 border-2 transition-all duration-300 ease-[cubic-bezier(.165,.84,.44,1)] ${
                isSelected
                  ? "border-primary bg-white shadow-[0_12px_30px_rgba(44,163,187,0.18)]"
                  : "border-midnight-tidal/10 bg-white hover:border-primary/40"
              }`}
            >
              <div className="flex items-start justify-between mb-3 gap-2">
                <div className="font-sans text-lg font-semibold text-iron-depth leading-snug">
                  {plan.title}
                </div>
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full transition-all shrink-0 ${
                    isSelected
                      ? "bg-primary text-white"
                      : "bg-midnight-tidal/10 text-transparent"
                  }`}
                  aria-hidden={!isSelected}
                >
                  <Check size={14} strokeWidth={3} />
                </span>
              </div>

              <div className="text-2xl font-semibold text-primary mb-1">
                {plan.price}
              </div>
              <div className="text-sm text-midnight-tidal/60 mb-5">
                {plan.summary}
              </div>

              <ul className="list-none !pl-0 !mb-0 space-y-1.5">
                {INCLUDED.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-midnight-tidal/80 !pl-0"
                  >
                    <Check size={14} className="text-secondary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleContinue}
        disabled={!selected}
        className={`inline-flex items-center gap-2 rounded-lg font-sans font-semibold px-6 py-3.5 transition-all duration-300 ease-[cubic-bezier(.165,.84,.44,1)] ${
          selected
            ? "bg-primary hover:bg-primary-light text-white hover:-translate-y-0.5"
            : "bg-midnight-tidal/10 text-midnight-tidal/40 cursor-not-allowed"
        }`}
      >
        Continue to Payment
        <ArrowRight size={18} />
      </button>

      {/* TODO: remove before going live */}
      <div className="mt-4">
        <Link
          href="/enrolment/child-details"
          className="font-sans text-xs !text-midnight-tidal/40 hover:!text-midnight-tidal/60 !no-underline transition-colors"
        >
          Skip Payment (Test Only)
        </Link>
      </div>
    </DocPageLayout>
  );
}
