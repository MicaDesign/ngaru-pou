import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, User } from "lucide-react";
import { getBlogPosts } from "@/lib/airtable";
import FadeUp from "@/components/FadeUp";

const CATEGORY_COLOURS: Record<string, string> = {
  Culture:   "bg-primary/15 text-primary",
  Education: "bg-[#5b5fef]/15 text-[#8b8fff]",
  News:      "bg-secondary/15 text-secondary",
  Events:    "bg-[#8b5cf6]/15 text-[#a78bfa]",
  Community: "bg-[#f97316]/15 text-[#fb923c]",
};

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
}

export default async function BlogPage() {
  const posts = await getBlogPosts().catch(() => []);

  if (posts.length === 0) notFound();

  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen bg-midnight-tidal">
      <section className="site-container py-16 md:py-20">

        {/* Header */}
        <FadeUp>
          <h1 className="font-display text-5xl md:text-6xl text-white mb-3">our blog</h1>
          <p className="font-sans text-white/50 text-[1.1rem] max-w-xl leading-relaxed mb-12">
            Stories, insights, and updates from the Ngaru Pou whānau.
          </p>
        </FadeUp>

        {/* Featured post */}
        <FadeUp delay={0.1}>
          <Link
            href={`/blog/${featured.slug}`}
            className="group block rounded-2xl overflow-hidden border border-white/10 bg-iron-depth hover:border-primary transition-all duration-300 mb-10"
          >
            <div className="flex flex-col lg:flex-row">
              {/* Cover image */}
              <div className="relative w-full lg:w-[480px] aspect-[16/9] lg:aspect-auto lg:self-stretch shrink-0 bg-iron-depth overflow-hidden">
                {featured.coverImage?.[0]?.url ? (
                  <Image
                    src={featured.coverImage[0].url}
                    alt={featured.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 480px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-iron-depth" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 p-8 md:p-10 flex flex-col gap-4 justify-center">
                <div className="flex items-center gap-3">
                  <span className={`font-sans text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full ${CATEGORY_COLOURS[featured.category] ?? "bg-white/10 text-white/60"}`}>
                    {featured.category}
                  </span>
                  <span className="font-sans text-xs text-white/30 uppercase tracking-widest">Latest</span>
                </div>
                <h2 className="font-display text-3xl md:text-4xl text-white leading-tight group-hover:text-primary transition-colors duration-200">
                  {featured.title}
                </h2>
                <p className="font-sans text-white/60 leading-relaxed line-clamp-3">
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-4 mt-auto pt-2">
                  <span className="flex items-center gap-1.5 font-sans text-xs text-white/40">
                    <User size={12} />
                    {featured.author}
                  </span>
                  <span className="flex items-center gap-1.5 font-sans text-xs text-white/40">
                    <CalendarDays size={12} />
                    {formatDate(featured.publishedDate)}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </FadeUp>

        {/* Rest of posts */}
        {rest.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, i) => (
              <FadeUp key={post.id} delay={0.05 * (i + 1)}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col h-full rounded-2xl overflow-hidden border border-white/10 bg-iron-depth hover:border-primary transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Cover */}
                  <div className="relative w-full aspect-[16/9] overflow-hidden bg-iron-depth shrink-0">
                    {post.coverImage?.[0]?.url ? (
                      <Image
                        src={post.coverImage[0].url}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-iron-depth" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-3 p-6 flex-1">
                    <span className={`self-start font-sans text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full ${CATEGORY_COLOURS[post.category] ?? "bg-white/10 text-white/60"}`}>
                      {post.category}
                    </span>
                    <h3 className="font-display text-xl text-white leading-tight group-hover:text-primary transition-colors duration-200 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="font-sans text-sm text-white/55 leading-relaxed line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 pt-2 border-t border-white/[0.07]">
                      <span className="flex items-center gap-1.5 font-sans text-xs text-white/35">
                        <CalendarDays size={11} />
                        {formatDate(post.publishedDate)}
                      </span>
                    </div>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
