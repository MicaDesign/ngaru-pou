import Image from "next/image";
import HeroCTAs from "@/components/HeroCTAs";

export default function HeroSection() {
  return (
    <section className="section-lg section-webflow-hero relative overflow-hidden border-b border-white/[0.11]">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-hero-webflow" />
        <div className="absolute inset-0 bg-[var(--colors--overlay)]" />
        <Image
          src="/images/bg-pattern-2.svg"
          alt=""
          aria-hidden="true"
          fill
          className="pointer-events-none select-none object-cover object-[50%_20%] opacity-[0.15] mix-blend-soft-light"
          sizes="100vw"
        />
      </div>

      <div className="site-container relative z-10 px-6 text-center">
        <h1 className="hero-webflow-shadow text-balance mb-5 font-display text-6xl font-medium leading-none tracking-[0.02em] text-white sm:text-7xl lg:text-[8.25rem]">
          learn with purpose.
          <br />
          grow with mana.
        </h1>

        <p className="mx-auto mb-10 max-w-3xl font-sans text-[1.1rem] leading-[1.5] text-white/70 sm:text-[1.2rem]">
          Ngāruapō supports Māori students to thrive in both te ao Māori and te
          ao whānui. Through interactive lessons, real-world skills, and
          culturally relevant content, we nurture curiosity, resilience, and
          pride in who our learners are.
        </p>

        <HeroCTAs />
      </div>
    </section>
  );
}
