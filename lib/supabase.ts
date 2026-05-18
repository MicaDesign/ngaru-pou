import "server-only";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ─── Types ────────────────────────────────────────────────────────────────────

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  author: string;
  category: string;
  publishedDate: string;
  coverImage?: { url: string }[];
  excerpt: string;
  content: string;
  isPublished: boolean;
};

export type GalleryItem = {
  id: string;
  title: string;
  type: "Photo" | "Video" | "";
  photo?: { url: string }[];
  videoUrl: string;
  thumbnail?: { url: string }[];
  caption: string;
  order: number;
  isPublished: boolean;
};

// ─── Blog Posts ───────────────────────────────────────────────────────────────

export async function getBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_date", { ascending: false });

  if (error) throw new Error(`Supabase getBlogPosts: ${error.message}`);

  return (data ?? []).map(rowToBlogPost);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // not found
    throw new Error(`Supabase getBlogPostBySlug: ${error.message}`);
  }

  return data ? rowToBlogPost(data) : null;
}

function rowToBlogPost(row: Record<string, unknown>): BlogPost {
  return {
    id: row.id as string,
    title: (row.title as string) ?? "",
    slug: (row.slug as string) ?? "",
    author: (row.author as string) ?? "",
    category: (row.category as string) ?? "",
    publishedDate: row.published_date
      ? new Date(row.published_date as string).toISOString()
      : "",
    coverImage: row.cover_image_url
      ? [{ url: row.cover_image_url as string }]
      : undefined,
    excerpt: (row.excerpt as string) ?? "",
    content: (row.content as string) ?? "",
    isPublished: (row.is_published as boolean) ?? false,
  };
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw new Error(`Supabase getGalleryItems: ${error.message}`);

  return (data ?? []).map(rowToGalleryItem);
}

function rowToGalleryItem(row: Record<string, unknown>): GalleryItem {
  const type = row.type as string;
  return {
    id: row.id as string,
    title: (row.title as string) ?? "",
    type: type === "Photo" ? "Photo" : type === "Video" ? "Video" : "",
    photo: row.image_url ? [{ url: row.image_url as string }] : undefined,
    videoUrl: (row.video_url as string) ?? "",
    thumbnail: row.image_url ? [{ url: row.image_url as string }] : undefined,
    caption: (row.caption as string) ?? "",
    order: (row.display_order as number) ?? 0,
    isPublished: true,
  };
}
