import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import FadeUp from "@/components/FadeUp";
import PageHero from "@/components/PageHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works — Ngaru Pou",
  description:
    "Discover how Ngaru Pou works — from signing up and enrolling your tamariki, to progressing through culturally grounded lessons at every level.",
};

const steps = [
  {
    number: "01",
    title: "Create a Parent Account",
    body: "Sign up as a parent or guardian to get started. Your account is your gateway to enrolling your tamariki, managing their learning profiles, and staying connected to their progress. Registration takes just a few minutes.",
    icon: "/images/icon-13.svg",
  },
  {
    number: "02",
    title: "Enrol Your Tamariki",
    body: "Once your account is set up, you can enrol each of your children into their appropriate learning level. You'll complete a short enrolment form with basic details — name, age, and learning level — and set up a secure login for your child.",
    icon: "/images/icon-5.svg",
  },
  {
    number: "03",
    title: "Choose the Right Level",
    body: "Ngaru Pou is structured across three levels that grow with your child. Te Pūmanawa is designed for ages 5–8, Te Pūkenga Rau for ages 9–12, and Te Pūkenga for rangatahi aged 13–19. Each level builds in depth, complexity, and cultural richness.",
    icon: "/images/icon-1.svg",
  },
  {
    number: "04",
    title: "Log In and Start Learning",
    body: "Your child uses their own secure username and PIN to access their personal learning space. From there they can pick up their lessons, track where they left off, and work through content at their own pace — any time, any place.",
    icon: "/images/icon-4.svg",
  },
  {
    number: "05",
    title: "Progress Through Lessons",
    body: "Lessons are structured into clear weekly modules with video content, guided activities, and reflection prompts. Each lesson is designed to build on the last, weaving together academic skills and kaupapa Māori values throughout.",
    icon: "/images/icon-3.svg",
  },
  {
    number: "06",
    title: "Connect With Your Kaiako",
    body: "Students can ask questions directly to their kaiako through the platform. Kaiako respond personally, providing guidance, encouragement, and expert feedback — bringing a real human connection into digital learning.",
    icon: "/images/icon-6.svg",
  },
];

const levels = [
  {
    slug: "te-pumanawa",
    name: "Te Pūmanawa",
    ages: "Ages 5–8",
    colour: "bg-primary",
    description:
      "The spark of potential. Te Pūmanawa introduces our youngest learners to language, story, and identity through play, creativity, and wonder. Lessons are short, visual, and full of life.",
    image: "/images/level-1.jpg",
  },
  {
    slug: "te-pukenga-rau",
    name: "Te Pūkenga Rau",
    ages: "Ages 9–12",
    colour: "bg-secondary",
    description:
      "Many skills, one whakapapa. Te Pūkenga Rau deepens understanding across literacy, numeracy, cultural practice, and critical thinking — helping rangatahi grow confident in who they are and how they engage with the world.",
    image: "/images/level-2.jpg",
  },
  {
    slug: "te-pukenga",
    name: "Te Pūkenga",
    ages: "Ages 13–19",
    colour: "bg-lagoon-drift",
    description:
      "Mastery and mana. Te Pūkenga challenges older rangatahi to lead, reflect, and create — building the skills, knowledge, and cultural authority to step confidently into adulthood and make a meaningful contribution.",
    image: "/images/level-3.jpg",
  },
];

const whyPoints = [
  "Lessons built on kaupapa Māori from the ground up",
  "Flexible — learn any time, on any device",
  "Secure, age-appropriate student logins",
  "Direct messaging with a real kaiako",
  "Progress tracking for parents and teachers",
  "Structured levels that grow with your child",
];

export default function HowItWorksPage() {
  return (
    <div className="bg-midnight-tidal">
      <PageHero
        eyebrow="How It Works"
        heading="simple steps, meaningful learning"
        body="Getting started with Ngaru Pou is straightforward. From your first sign-up to your tamariki working through lessons, every step is designed to be clear, welcoming, and easy to navigate — so you can focus on what matters most."
      />

      {/* Steps */}
      <section className="section-md bg-salt-mist">
        <div className="site-container">
          <FadeUp className="text-center mb-16">
            <h2 className="section-h2 font-display text-midnight-tidal mb-4">
              getting started
            </h2>
            <p className="font-sans text-midnight-tidal/60 text-[1.1rem] max-w-xl mx-auto leading-relaxed">
              Here is everything you need to know to get your whānau up and
              running on the platform.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <FadeUp key={step.number} delay={i * 0.07}>
                <div className="relative flex flex-col gap-5 rounded-2xl border border-midnight-tidal/[0.12] bg-white/70 p-8 h-full hover:bg-white transition-colors duration-300">
                  <div className="flex items-center gap-4">
                    <span className="font-display text-5xl text-primary/30 leading-none select-none">
                      {step.number}
                    </span>
                    <Image src={step.icon} alt="" width={40} height={40} />
                  </div>
                  <h3 className="font-sans text-[1.2rem] font-semibold text-midnight-tidal leading-snug">
                    {step.title}
                  </h3>
                  <p className="font-sans text-midnight-tidal/60 text-[1.05rem] leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Levels */}
      <section className="section-md border-t border-white/[0.11]">
        <div className="site-container">
          <FadeUp className="text-center mb-16">
            <div className="inline-block border-t border-primary pt-2 mb-4">
              <p className="font-sans text-primary text-base font-medium uppercase tracking-[0.15em]">
                Learning Levels
              </p>
            </div>
            <h2 className="section-h2 font-display text-white mb-4">
              a path for every rangatahi
            </h2>
            <p className="font-sans text-white/55 text-[1.1rem] max-w-xl mx-auto leading-relaxed">
              Each level is carefully designed for its age group — meeting
              learners where they are and growing with them over time.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {levels.map((level, i) => (
              <FadeUp key={level.slug} delay={i * 0.1}>
                <div className="flex flex-col rounded-2xl overflow-hidden border border-white/[0.11] h-full">
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={level.image}
                      alt={level.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-midnight-tidal/40" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <span className={`inline-block rounded-full px-3 py-1 font-sans text-xs font-semibold text-white ${level.colour}/80 mb-2`}>
                        {level.ages}
                      </span>
                      <h3 className="font-display text-2xl text-white">
                        {level.name}
                      </h3>
                    </div>
                  </div>
                  <div className="flex-1 bg-iron-depth p-6">
                    <p className="font-sans text-white/60 text-[1.05rem] leading-relaxed">
                      {level.description}
                    </p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Why Ngaru Pou */}
      <section className="section-md border-t border-midnight-tidal/[0.11] bg-salt-mist">
        <div className="site-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeUp direction="left">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                <Image
                  src="/images/3-moari-girls.avif"
                  alt="Rangatahi learning with Ngaru Pou"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </FadeUp>
            <FadeUp delay={0.1} direction="right">
              <div className="inline-block border-t border-primary pt-2 mb-4">
                <p className="font-sans text-primary text-base font-medium uppercase tracking-[0.15em]">
                  Why Ngaru Pou
                </p>
              </div>
              <h2 className="section-h2 font-display text-midnight-tidal mb-6">
                designed for your whānau
              </h2>
              <p className="font-sans text-midnight-tidal/65 text-[1.1rem] leading-relaxed mb-8">
                Ngaru Pou isn&apos;t just another online learning tool. It was
                built specifically for Māori students and their whānau — with
                culture, language, and identity woven into every lesson. Whether
                your tamariki are just starting out or stepping into young
                adulthood, the platform grows with them.
              </p>
              <ul className="space-y-3 mb-10">
                {whyPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3 font-sans text-midnight-tidal/70 text-[1.05rem]">
                    <CheckCircle size={18} className="text-primary mt-0.5 shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="inline-flex items-center gap-3 rounded-lg px-6 py-4 bg-primary text-white font-sans font-medium text-base transition-all duration-300 ease-[cubic-bezier(.165,.84,.44,1)] hover:bg-primary-light hover:-translate-y-0.5"
              >
                Get started today
                <ArrowRight size={18} />
              </Link>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* FAQ prompt */}
      <section className="section-md border-t border-white/[0.11]">
        <div className="site-container">
          <FadeUp className="rounded-2xl bg-iron-depth border border-white/[0.11] px-10 py-12 text-center max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl text-white mb-4">
              still have questions?
            </h2>
            <p className="font-sans text-white/60 text-[1.1rem] leading-relaxed mb-8">
              Visit our FAQ page for answers to common questions about enrolment,
              pricing, and how the platform works. Or reach out to us directly —
              we&apos;re always happy to help.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/faq"
                className="inline-flex items-center gap-2 rounded-lg px-6 py-3 bg-primary text-white font-sans font-medium transition-all duration-300 hover:bg-primary-light hover:-translate-y-0.5"
              >
                View the FAQ
              </Link>
              <a
                href="mailto:info@ngarupou.org.au"
                className="inline-flex items-center gap-2 rounded-lg px-6 py-3 bg-white/5 border border-white/15 text-white font-sans font-medium transition-all duration-300 hover:bg-white/10 hover:-translate-y-0.5"
              >
                Contact us
              </a>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
