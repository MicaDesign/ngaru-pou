import { CheckCircle, Target, Star, Trophy } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import FadeUp from "@/components/FadeUp";

interface Pillar {
  icon: LucideIcon;
  heading: string;
  body: string;
}

const pillars: Pillar[] = [
  {
    icon: CheckCircle,
    heading: "Culturally Grounded Content",
    body: "Lessons are designed with kaupapa Māori principles at their core, ensuring learning reflects language, values, and lived experience.",
  },
  {
    icon: Target,
    heading: "Personalised Learning Paths",
    body: "Every learner progresses at their own pace, with adaptive tools that respond to strengths, goals, and areas for growth.",
  },
  {
    icon: Star,
    heading: "Building Confidence & Mana",
    body: "We don't just measure achievement — we nurture self-belief, resilience, and pride in identity.",
  },
  {
    icon: Trophy,
    heading: "Future-Ready Skills",
    body: "From literacy and numeracy to critical thinking and digital fluency, Ngāruapō prepares students for te ao hurihuri — an ever-changing world.",
  },
];

export default function KaupapaSection() {
  return (
    <section className="section-md bg-midnight-tidal">
      <div className="site-container">
        <FadeUp className="max-w-[75%] mx-auto text-center mb-16">
          <div className="inline-block border-t border-primary pt-2 mb-4">
            <p className="font-sans text-primary text-base font-medium uppercase tracking-[0.15em]">
              Our Kaupapa
            </p>
          </div>
          <h2 className="section-h2 font-display text-white mb-6">
            learning rooted in identity
          </h2>
          <p className="font-sans text-white/60 text-[1.2rem] leading-[1.5]">
            Ngāru Pou is built on the belief that education should strengthen
            both knowledge and identity. By weaving together academic
            achievement, digital innovation, and te ao Māori values, we create
            a learning experience that grows confident, capable rangatahi —
            grounded in who they are and prepared for where they&apos;re going.
          </p>
        </FadeUp>

        {/* Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map(({ icon: Icon, heading, body }, i) => (
            <FadeUp key={heading} delay={i * 0.1}>
              <div className="flex h-full flex-col items-center gap-4 rounded-2xl px-4 py-3 text-center transition-all duration-200 ease-[cubic-bezier(.165,.84,.44,1)] hover:-translate-y-0.5 hover:bg-white/[0.02]">
                <Icon size={48} className="text-primary flex-shrink-0" strokeWidth={1.5} />
                <h4 className="font-sans font-semibold text-white text-[1.25rem] leading-[1.2]">
                  {heading}
                </h4>
                <p className="font-sans text-white/55 text-[1.1rem] leading-[1.5]">
                  {body}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
