import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Users, Heart, Globe2, Sparkles } from "lucide-react";
import FadeUp from "@/components/FadeUp";
import PageHero from "@/components/PageHero";
import AnimatedTimeline from "@/components/AnimatedTimeline";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Ngaru Pou",
  description:
    "Ngaru Pou Inc. is a community-focused organisation in Western Australia dedicated to empowering rangatahi through Te Ao Haka — grounding them in cultural identity while preparing them for the world.",
};

const values = [
  {
    icon: Heart,
    title: "Manaakitanga",
    body: "We create safe environments where every learner, every whānau, and every community member feels valued, heard, and supported. Care is not an afterthought — it is the foundation of everything we do.",
  },
  {
    icon: Globe2,
    title: "Whakapapa",
    body: "Cultural identity, language, and whakapapa are at the heart of our programmes. We ground our rangatahi in who they are and where they come from — so they can navigate both worlds with strength and confidence.",
  },
  {
    icon: Users,
    title: "Kotahitanga",
    body: "We work closely with individuals, families, and community partners to build capacity and support long-term growth. Ngaru Pou was built through community, for community — and we are stronger together.",
  },
  {
    icon: Sparkles,
    title: "Tūāhuatanga",
    body: "We hold high expectations because we believe deeply in our learners&apos; potential. Through Te Ao Haka, we nurture excellence in performance, self-belief, and cultural pride — preparing rangatahi to shine.",
  },
];


export default function AboutUsPage() {
  return (
    <div className="bg-midnight-tidal">
      <PageHero
        eyebrow="About Us"
        heading={<>grounded in culture.<br />built for rangatahi.</>}
        body="Ngaru Pou Inc. is a community-focused organisation in Western Australia dedicated to empowering rangatahi through Te Ao Haka. We strengthen cultural identity, build confidence, and support every young person to stand proudly in both their Māori heritage and the world around them."
      />

      {/* Who We Are */}
      <section className="section-md">
        <div className="site-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeUp direction="left">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                <Image
                  src="/images/maori-kapa-haka-group.avif"
                  alt="Ngaru Pou rangatahi performing kapa haka"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </FadeUp>
            <FadeUp delay={0.1} direction="right">
              <div className="inline-block border-t border-primary pt-2 mb-4">
                <p className="font-sans text-primary text-base font-medium uppercase tracking-[0.15em]">
                  Who We Are
                </p>
              </div>
              <h2 className="section-h2 font-display text-white mb-6">
                more than a programme — a movement
              </h2>
              <div className="space-y-4 font-sans text-white/65 text-[1.1rem] leading-relaxed">
                <p>
                  Ngaru Pou Inc. is a community-focused organisation dedicated
                  to empowering individuals, strengthening families, and building
                  resilient communities here in Western Australia. Through
                  high-quality programmes and support services, we promote
                  wellbeing, personal development, and positive life outcomes for
                  rangatahi aged 3 to 19 and beyond.
                </p>
                <p>
                  Our approach is grounded in <strong className="text-white/85">Te Ao Haka</strong> — integrating
                  cultural identity, language, movement, and storytelling so that
                  every programme reflects tikanga and mātauranga Māori. Through
                  haka, waiata, poi, mōteatea, and performance, our students
                  connect with their culture, build confidence, and develop a
                  strong sense of who they are and where they belong.
                </p>
                <p>
                  We work hand in hand with individuals, whānau, and community
                  partners — taking a holistic approach that addresses challenges,
                  builds capacity, and supports each young person to reach their
                  full potential. Our goal is a lasting, positive impact in the
                  communities we serve.
                </p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-md border-t border-midnight-tidal/[0.11] bg-salt-mist">
        <div className="site-container">
          <FadeUp className="max-w-3xl mx-auto text-center">
            <div className="inline-block border-t border-primary pt-2 mb-4">
              <p className="font-sans text-primary text-base font-medium uppercase tracking-[0.15em]">
                Our Mission
              </p>
            </div>
            <h2 className="section-h2 font-display text-primary mb-8">
              navigating both worlds with confidence
            </h2>
            <p className="font-sans text-iron-depth text-[1.2rem] leading-[1.65] mb-6">
              Our primary focus is rangatahi — supporting them to build the
              confidence to stand proudly here in Australia while remaining
              grounded in who they are and where they come from. We don&apos;t ask
              our learners to choose between worlds. We equip them to navigate
              both with strength.
            </p>
            <p className="font-sans text-iron-depth/80 text-[1.1rem] leading-relaxed mb-10">
              Through Te Ao Haka, we provide students with exposure to te reo me
              ōna tikanga, whakapapa, and whanaungatanga — enabling them to
              develop self-belief, resilience, and pride in their cultural
              identity. Students move at their own pace, because we honour
              individual learning journeys and recognise that every young person
              grows in their own time and in their own way.
            </p>
            {/* Whakatauki */}
            <div className="border-t border-primary/30 pt-8 mt-2">
              <p className="font-display text-2xl md:text-3xl text-primary leading-snug mb-3">
                Nau tou rourou, nau toku rourou,
                <br />
                ka ora ai te iwi
              </p>
              <p className="font-sans text-iron-depth/60 text-sm uppercase tracking-[0.15em]">
                With your food basket and my food basket, the people will thrive
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Values */}
      <section className="section-md border-t border-midnight-tidal/[0.15]">
        <div className="site-container">
          <FadeUp className="text-center mb-16">
            <div className="inline-block border-t border-primary pt-2 mb-4">
              <p className="font-sans text-primary text-base font-medium uppercase tracking-[0.15em]">
                Our Values
              </p>
            </div>
            <h2 className="section-h2 font-display text-white mb-4">
              the principles that guide us
            </h2>
            <p className="font-sans text-white/55 text-[1.1rem] max-w-xl mx-auto leading-relaxed">
              These aren&apos;t just words on a page — they are the commitments
              that shape how we teach, connect, and show up for our community
              every day.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map(({ icon: Icon, title, body }, i) => (
              <FadeUp key={title} delay={i * 0.08}>
                <div className="flex flex-col items-center gap-5 rounded-2xl border border-white/[0.11] bg-iron-depth/50 px-6 py-8 text-center h-full hover:bg-iron-depth transition-colors duration-300">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Icon size={26} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-2xl text-white">{title}</h3>
                  <p className="font-sans text-white/55 text-[1.05rem] leading-relaxed">{body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Photo + story */}
      <section className="section-md border-t border-white/[0.11]">
        <div className="site-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeUp delay={0.1} direction="left" className="order-2 lg:order-1">
              <div className="inline-block border-t border-primary pt-2 mb-4">
                <p className="font-sans text-primary text-base font-medium uppercase tracking-[0.15em]">
                  Our Community
                </p>
              </div>
              <h2 className="section-h2 font-display text-white mb-6">
                built by whānau, for whānau
              </h2>
              <div className="space-y-4 font-sans text-white/65 text-[1.1rem] leading-relaxed">
                <p>
                  Ngaru Pou was built from the ground up by educators, parents,
                  and cultural practitioners who believed that Māori rangatahi in
                  Australia deserved something better — programmes that truly see
                  them, celebrate who they are, and prepare them for the future.
                </p>
                <p>
                  Through inclusive and culturally responsive practices, we
                  create safe environments where people feel valued, heard, and
                  supported. Our work extends beyond the classroom — we partner
                  with families and communities to address challenges and support
                  long-term growth, because we know that when the whole whānau
                  thrives, so does every individual within it.
                </p>
                <p>
                  We also host the <strong className="text-white/85">Ngaru Pou Cultural Arts Festival</strong>, giving our
                  rangatahi the opportunity to perform, compete, and celebrate
                  their culture together — including pathways into
                  Te Hononga Moemoea, our secondary kapahaka competition.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-lg px-6 py-3 bg-primary text-white font-sans font-medium transition-all duration-300 hover:bg-primary-light hover:-translate-y-0.5"
                >
                  Enrol now
                  <ArrowRight size={16} />
                </Link>
                <a
                  href="https://www.facebook.com/groups/816360571780791"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg px-6 py-3 bg-white/5 border border-white/15 text-white font-sans font-medium transition-all duration-300 hover:bg-white/10 hover:-translate-y-0.5"
                >
                  Join our Facebook community
                </a>
              </div>
            </FadeUp>
            <FadeUp direction="right" className="order-1 lg:order-2">
              <div className="relative rounded-2xl overflow-hidden aspect-[2/3]">
                <Image
                  src="/images/3-moari-girls.avif"
                  alt="Rangatahi in the Ngaru Pou community"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-md border-t border-midnight-tidal/[0.11] bg-salt-mist">
        <div className="site-container">
          <FadeUp className="text-center mb-16">
            <div className="inline-block border-t border-primary pt-2 mb-4">
              <p className="font-sans text-primary text-base font-medium uppercase tracking-[0.15em]">
                Our Journey
              </p>
            </div>
            <h2 className="section-h2 font-display text-primary mb-4">
              how we got here
            </h2>
          </FadeUp>

          <AnimatedTimeline />
        </div>
      </section>

      {/* CTA */}
      <section className="section-md border-t border-white/[0.11]">
        <div className="site-container">
          <FadeUp className="rounded-2xl bg-primary/10 border border-primary/25 px-10 py-14 text-center max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl text-white mb-4">
              ready to be part of the journey?
            </h2>
            <p className="font-sans text-white/65 text-[1.1rem] leading-relaxed mb-8 max-w-xl mx-auto">
              Whether you&apos;re a parent looking to enrol your tamariki, a
              kaiako wanting to get involved, or a community member who believes
              in our kaupapa — there is a place for you here.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-lg px-6 py-3 bg-primary text-white font-sans font-medium transition-all duration-300 hover:bg-primary-light hover:-translate-y-0.5"
              >
                Get started
                <ArrowRight size={16} />
              </Link>
              <a
                href="mailto:info@ngarupou.org.au"
                className="inline-flex items-center gap-2 rounded-lg px-6 py-3 bg-white/5 border border-white/15 text-white font-sans font-medium transition-all duration-300 hover:bg-white/10 hover:-translate-y-0.5"
              >
                Get in touch
              </a>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
