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
    "Learn about Ngaru Pou Cultural Arts Inc. — who we are, what drives us, and why we built a learning platform rooted in te ao Māori.",
};

const values = [
  {
    icon: Heart,
    title: "Manaakitanga",
    body: "We lead with care and respect for every learner, every whānau, and every community we serve. Kindness is not an afterthought — it is the foundation.",
  },
  {
    icon: Globe2,
    title: "Whakapapa",
    body: "Identity is the thread that connects past, present, and future. Everything we build honours the lineage, language, and stories that make our learners who they are.",
  },
  {
    icon: Users,
    title: "Kotahitanga",
    body: "We are stronger together. Ngaru Pou was built through community, for community — and we are committed to growing that collective strength with everything we do.",
  },
  {
    icon: Sparkles,
    title: "Tūāhuatanga",
    body: "Excellence matters. We hold our learners to high expectations because we believe deeply in their potential — and we build tools worthy of that belief.",
  },
];


export default function AboutUsPage() {
  return (
    <div className="bg-midnight-tidal">
      <PageHero
        eyebrow="About Us"
        heading={<>grounded in culture.<br />built for rangatahi.</>}
        body="Ngaru Pou Cultural Arts Inc. is a community organisation dedicated to the educational, cultural, and personal development of Māori students. We exist because we believe every rangatahi deserves learning that sees them fully — and lifts them higher."
      />

      {/* Who We Are */}
      <section className="section-md">
        <div className="site-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeUp direction="left">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                <Image
                  src="/images/maori-kapa-haka-group.avif"
                  alt="Ngaru Pou community"
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
                a community, not just a platform
              </h2>
              <div className="space-y-4 font-sans text-white/65 text-[1.1rem] leading-relaxed">
                <p>
                  Ngaru Pou Cultural Arts Inc. was founded by educators,
                  parents, and cultural practitioners who saw a gap — Māori
                  students were being asked to succeed in systems that didn&apos;t
                  reflect who they were. We set out to change that.
                </p>
                <p>
                  Our name means &ldquo;the wave post&rdquo; — a symbol of
                  strength, continuity, and connection. Like the waves that have
                  shaped Aotearoa&apos;s shores for generations, we believe
                  knowledge should be a living, moving force that carries
                  rangatahi forward while keeping them anchored to their roots.
                </p>
                <p>
                  We are kaiako, whānau, community members, and learners
                  ourselves. Every decision we make is guided by a simple
                  question: does this serve our students and their futures?
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
              learning rooted in identity
            </h2>
            <p className="font-sans text-iron-depth text-[1.2rem] leading-[1.65] mb-6">
              Our mission is to provide high-quality, culturally grounded
              education that strengthens both academic achievement and Māori
              identity. We believe these two things are not in tension — they
              are inseparable.
            </p>
            <p className="font-sans text-iron-depth/80 text-[1.1rem] leading-relaxed">
              Through Ngaru Pou, we create pathways where rangatahi can develop
              real-world skills — literacy, numeracy, critical thinking, and
              digital fluency — while deepening their understanding of
              whakapapa, tikanga, and te reo Māori. We don&apos;t ask our
              learners to leave their identity at the door. We ask them to bring
              it to the centre.
            </p>
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
              that shape how we build, teach, and show up for our community
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
                  Ngaru Pou started in a community hall with a handful of
                  kaiako, a shared vision, and a lot of determination. Since
                  then, our whānau has grown — learners from across Aotearoa and
                  beyond have joined the platform, and our community of kaiako
                  continues to grow alongside them.
                </p>
                <p>
                  We take the responsibility of online learning seriously.
                  Families trust us with their most precious taonga — their
                  children — and we honour that trust through thoughtful design,
                  safe systems, and a genuine commitment to every student&apos;s
                  wellbeing and success.
                </p>
                <p>
                  If you&apos;re a kaiako interested in joining our team, a parent
                  considering enrolment, or simply someone who believes in what
                  we&apos;re building — we&apos;d love to hear from you.
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
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
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
