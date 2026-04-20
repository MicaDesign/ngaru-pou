import Image from "next/image";
import FadeUp from "@/components/FadeUp";

export default function CommunitySection() {
  return (
    <section className="section-md overflow-hidden bg-primary">
      <div className="site-container">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,5.5fr)_minmax(0,5fr)] lg:gap-[2rem] items-start">
          <FadeUp delay={0.1} className="order-2 lg:order-1">
            <div className="media-frame w-full aspect-[3/4] max-w-[520px] lg:max-w-[540px] self-start">
              <Image
                src="/images/maori-kapa-haka-group.avif"
                alt="Māori kapa haka group"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </FadeUp>

          <FadeUp className="flex flex-col gap-6 order-1 lg:order-2 self-start">
            <h2 className="section-h2 font-display text-white">
              supporting tamariki to succeed in school
            </h2>
            <div className="flex flex-col gap-5 font-sans text-white/75 text-[1.2rem] leading-[1.5]">
              <p>
                Every student deserves access to structured, effective learning
                that builds both academic skill and personal confidence.{" "}
                <strong className="text-white font-semibold">ngaru pou</strong>{" "}
                provides a clear, supportive pathway that helps tamariki
                strengthen literacy, numeracy, and critical thinking in a
                culturally grounded environment.
              </p>
              <p>
                <strong className="text-white font-semibold">ngaru pou</strong>{" "}
                is designed to complement classroom teaching — offering
                consistent support, clear progression, and tools that help
                schools deliver meaningful, results-driven education for Māori
                learners.
              </p>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
