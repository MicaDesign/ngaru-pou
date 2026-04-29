import FadeUp from "@/components/FadeUp";

interface PageHeroProps {
  eyebrow: string;
  heading: React.ReactNode;
  body: string;
}

export default function PageHero({ eyebrow, heading, body }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.11] py-24 md:py-36">
      {/* Teal gradient as solid base */}
      <div className="absolute inset-0 bg-hero-webflow" />
      {/* Pattern sits on top at low opacity so it subtly textures the gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[url('/images/bg-pattern-1.svg')] bg-cover bg-center bg-no-repeat opacity-[0.12]"
      />
      {/* Subtle dark scrim so white text stays readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />

      <div className="site-container relative z-10 text-center">
        <FadeUp>
          <div className="inline-block border-t border-white/60 pt-2 mb-5">
            <p className="font-sans text-white/80 text-base font-medium uppercase tracking-[0.18em]">
              {eyebrow}
            </p>
          </div>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-white leading-none mb-6 drop-shadow-md">
            {heading}
          </h1>
          <p className="mx-auto max-w-2xl font-sans text-white/80 text-[1.15rem] leading-[1.65]">
            {body}
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
