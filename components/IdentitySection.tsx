import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import FadeUp from "@/components/FadeUp";

export default function IdentitySection() {
  return (
    <section className="section-md relative overflow-hidden bg-salt-mist">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 top-0 bg-[url('/images/bg-pattern-1.svg')] bg-cover bg-bottom bg-no-repeat opacity-100"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[rgba(225,242,255,0.98)]"
      />
      <div className="site-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-[2rem] items-center justify-between">
          <FadeUp className="flex flex-col gap-8">
            <div>
              <div className="inline-block border-t border-primary pt-2 mb-4">
                <p className="font-sans text-primary text-base font-medium uppercase tracking-[0.15em]">
                  For Rangatahi. For Whānau.
                </p>
              </div>
              <h2 className="section-h2 font-display text-midnight-tidal">
                education that reflects who you are
              </h2>
            </div>
            <p className="font-sans text-midnight-tidal/70 text-[1.2rem] leading-[1.5]">
              Ngāruapō was created to support Māori learners in a way that feels
              relevant, empowering, and future-focused. Our platform blends
              academic excellence with tikanga, identity, and real-world skills
              — helping students grow in confidence, capability, and connection
              to their culture. This isn&apos;t one-size-fits-all learning.
              It&apos;s education shaped by purpose and guided by kaupapa Māori
              values.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/signup">
                <Button variant="primary">Start Learning</Button>
              </Link>
              <Link href="/how-it-works">
                <button className="inline-flex h-14 cursor-pointer items-center rounded-lg px-6 font-sans text-base font-medium text-primary transition-all duration-300 ease-[cubic-bezier(.165,.84,.44,1)] hover:-translate-y-0.5 hover:bg-primary/10">
                  See How It Works
                </button>
              </Link>
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <div className="media-frame w-full aspect-square">
              <Image
                src="/images/3-moari-girls.avif"
                alt="Three Māori girls smiling"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
