import HeroSection from "@/components/HeroSection";
import KaupapaSection from "@/components/KaupapaSection";
import IdentitySection from "@/components/IdentitySection";
import EngageSection from "@/components/EngageSection";
import CommunitySection from "@/components/CommunitySection";
import GallerySection from "@/components/GallerySection";
import { getGalleryItems } from "@/lib/airtable";

export default async function Home() {
  const galleryItems = await getGalleryItems().catch(() => []);

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
