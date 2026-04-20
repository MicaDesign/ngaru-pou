"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import FadeUp from "@/components/FadeUp";
import { ArrowRight } from "lucide-react";

interface FeatureCard {
  icon: string;
  heading: string;
  body: string;
}

const equationIcons = [
  { src: "/images/icon-12.svg", alt: "" },
  { src: "/images/icon-2.svg", alt: "" },
  { src: "/images/icon-7.svg", alt: "" },
  { src: "/images/icon-18.svg", alt: "" },
];

const featureCards: FeatureCard[] = [
  { icon: "/images/icon-13.svg", heading: "Secure Student Access", body: "Learners log in to their own personalized learning space, where lessons, progress, and achievements are saved and protected." },
  { icon: "/images/icon-5.svg", heading: "Structured Learning Pathways", body: "Content is organized in clear, progressive modules — building foundational knowledge step by step, from basics to mastery." },
  { icon: "/images/icon-1.svg", heading: "Culturally Relevant Insights", body: "Lessons are designed to spark curiosity and connect learning to real-life experiences and kaupapa Māori values." },
  { icon: "/images/icon-4.svg", heading: "Multimedia Lessons", body: "Video, quizzes, and interactive activities keep learning engaging, accessible, and easy to follow." },
  { icon: "/images/icon-14.svg", heading: "Recognized Achievement", body: "Students earn digital badges and milestones that reflect effort, growth, and academic progress." },
  { icon: "/images/icon-9.svg", heading: "Learning Without Limits", body: "Access Ngāruapō anywhere, anytime — supporting rangatahi across Aotearoa and beyond." },
  { icon: "/images/icon-3.svg", heading: "Active Practice & Application", body: "Students reinforce learning through exercises, reflections, and practical challenges that strengthen understanding." },
  { icon: "/images/icon-6.svg", heading: "Real-Time Progress Tracking", body: "Both learners and educators can monitor progress, identify strengths, and focus on areas needing support." },
  { icon: "/images/icon-15.svg", heading: "Future-Ready Platform", body: "Designed to grow with schools and communities, Ngāruapō adapts to different learning needs and digital environments." },
];

export default function EngageSection() {
  return (
    <section className="bg-engage-webflow section-md relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[-12%] bottom-0 z-0">
        <Image
          src="/images/logo-icon-4.svg"
          alt=""
          fill
          sizes="100vw"
          className="object-fill opacity-30 rotate-180"
        />
      </div>

      <div className="site-container relative z-10">
        <FadeUp className="flex items-center justify-center gap-4 sm:gap-6 mb-16 flex-wrap">
          {equationIcons.map(({ src, alt }, i) => (
            <div key={src} className="flex items-center gap-4 sm:gap-6">
              <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/[0.11] flex items-center justify-center p-2.5">
                <Image src={src} alt={alt} width={40} height={40} />
              </div>
              {i < equationIcons.length - 1 && (
                <span className="text-white/30 font-sans font-light text-2xl select-none">
                  {i === equationIcons.length - 2 ? "=" : "+"}
                </span>
              )}
            </div>
          ))}
        </FadeUp>

        <FadeUp delay={0.05} className="max-w-[75%] mx-auto text-center mb-16">
          <h2 className="section-h2 font-display text-white mb-6">
            engage. learn. achieve.
          </h2>
          <p className="font-sans text-white/60 text-[1.2rem] leading-[1.5]">
            Meaningful education happens when students actively engage, build
            understanding, and apply what they&apos;ve learned. Ngāruapō
            supports every step of that journey — from first question to
            recognised achievement — creating pathways that are both culturally
            grounded and future-ready.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-16">
          {featureCards.map(({ icon, heading, body }, i) => (
            <FadeUp key={heading} delay={Math.floor(i / 3) * 0.1}>
              <div
                className={`card-airy flex h-full flex-col gap-5 p-12 ${i % 3 !== 0 ? "border-l border-white/[0.11]" : ""}`}
              >
                <Image src={icon} alt="" width={40} height={40} className="opacity-90" />
                <h3 className="font-sans font-semibold text-white text-[1.25rem] leading-[1.2]">
                  {heading}
                </h3>
                <p className="font-sans text-white/55 text-[1.1rem] leading-[1.5]">
                  {body}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* CTA */}
        <FadeUp delay={0.1} className="flex justify-center">
          <Link href="/signup">
            <Button variant="primary" icon={ArrowRight}>
              Get Started Today
            </Button>
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}
