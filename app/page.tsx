import HeroSection from "@/components/HeroSection";
import KaupapaSection from "@/components/KaupapaSection";
import IdentitySection from "@/components/IdentitySection";
import EngageSection from "@/components/EngageSection";
import CommunitySection from "@/components/CommunitySection";
import GallerySection from "@/components/GallerySection";
import { getGalleryItems, type GalleryItem } from "@/lib/airtable";

// For any video item without a manually uploaded thumbnail, fetch one from
// Vimeo's public oEmbed API. Results are cached for 1 hour on the server.
async function enrichWithVimeoThumbnails(items: GalleryItem[]): Promise<GalleryItem[]> {
  return Promise.all(
    items.map(async (item) => {
      // Skip non-videos and items that already have a thumbnail
      if (item.type !== "Video" || !item.videoUrl || item.thumbnail?.[0]?.url) return item;
      try {
        const oembedUrl = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(item.videoUrl)}&width=1280`;
        const res = await fetch(oembedUrl, { next: { revalidate: 3600 } });
        if (!res.ok) return item;
        const data = await res.json() as { thumbnail_url?: string };
        if (data.thumbnail_url) {
          return { ...item, thumbnail: [{ url: data.thumbnail_url }] };
        }
      } catch {
        // If Vimeo is unreachable, fall back to gradient placeholder
      }
      return item;
    })
  );
}

export default async function Home() {
  const rawItems = await getGalleryItems().catch(() => []);
  const galleryItems = await enrichWithVimeoThumbnails(rawItems);

  return (
    <>
      <HeroSection />
      <KaupapaSection />
      <IdentitySection />
      <EngageSection />
      <GallerySection items={galleryItems} />
      <CommunitySection />
    </>
  );
}
