import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, User, ArrowLeft } from "lucide-react";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/supabase";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return { title: "Post not found" };

  const ogImages = post.coverImage?.[0]?.url
    ? [{ url: post.coverImage[0].url, alt: post.title }]
    : [];

  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: "article",
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedDate || undefined,
      authors: post.author ? [post.author] : undefined,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || undefined,
      images: ogImages.map((i) => i.url),
    },
  };
}

const CATEGORY_COLOURS: Record<string, string> = {
  Culture:   "bg-primary/15 text-primary",
  Education: "bg-[#5b5fef]/15 text-[#8b8fff]",
  News:      "bg-secondary/15 text-secondary",
  Events:    "bg-[#8b5cf6]/15 text-[#a78bfa]",
  Community: "bg-[#f97316]/15 text-[#fb923c]",
};

function formatDate(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric", month: "long", year: "numeric",
  });
}

// Pre-generate slugs for static params
export async function generateStaticParams() {
  const posts = await getBlogPosts().catch(() => []);
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) notFound();

  // Split content on double newlines into paragraphs
  const paragraphs = post.content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-midnight-tidal">

      {/* Hero */}
      {post.coverImage?.[0]?.url && (
        <div className="relative w-full aspect-[21/7] overflow-hidden bg-iron-depth">
          <Image
            src={post.coverImage[0].url}
            alt={post.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight-tidal via-midnight-tidal/40 to-transparent" />
        </div>
      )}

      <article className="site-container py-12 md:py-16 max-w-3xl">

        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-white/40 hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={13} />
          Back to blog
        </Link>

        {/* Category + meta */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          {post.category && (
            <span className={`font-sans text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full ${CATEGORY_COLOURS[post.category] ?? "bg-white/10 text-white/60"}`}>
              {post.category}
            </span>
          )}
          <span className="flex items-center gap-1.5 font-sans text-xs text-white/40">
            <CalendarDays size={12} />
            {formatDate(post.publishedDate)}
          </span>
          <span className="flex items-center gap-1.5 font-sans text-xs text-white/40">
            <User size={12} />
            {post.author}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-8">
          {post.title}
        </h1>

        {/* Excerpt / lead */}
        {post.excerpt && (
          <p className="font-sans text-lg text-white/70 leading-relaxed border-l-2 border-primary pl-5 mb-10">
            {post.excerpt}
          </p>
        )}

        {/* Body */}
        <div className="flex flex-col gap-5">
          {paragraphs.map((para, i) => (
            <p key={i} className="font-sans text-[1.05rem] text-white/65 leading-[1.8]">
              {para}
            </p>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-14 pt-8 border-t border-white/10 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-sans text-sm text-white/40 hover:text-primary transition-colors"
          >
            <ArrowLeft size={14} />
            All posts
          </Link>
          <p className="font-sans text-xs text-white/30">{post.author}</p>
        </div>
      </article>
    </div>
  );
}
