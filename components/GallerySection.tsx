"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Play, Camera, Film, X } from "lucide-react";
import FadeUp from "@/components/FadeUp";
import type { GalleryItem } from "@/lib/airtable";

// Convert a Vimeo page URL (including unlisted hash tokens) to an embed URL.
// Handles:  https://vimeo.com/123456789/abcdef1234?...
//           https://vimeo.com/123456789
function getVimeoEmbedUrl(url: string): string | null {
  if (!url || url === "#") return null;
  try {
    const u = new URL(url);
    const parts = u.pathname.replace(/^\//, "").split("/");
    const videoId = parts[0];
    const hash = parts[1] ?? "";
    if (!videoId) return null;
    const params = new URLSearchParams({
      autoplay: "1",
      loop: "1",
      byline: "0",
      title: "0",
      portrait: "0",
      ...(hash ? { h: hash } : {}),
    });
    return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
  } catch {
    return null;
  }
}

// ─── Dummy content ────────────────────────────────────────────────────────────

const DUMMY_PHOTOS: GalleryItem[] = [
  { id: "d1", title: "Kapa Haka performance", type: "Photo", caption: "Our rangatahi performing at the regional showcase.", order: 1, isPublished: true, videoUrl: "", photo: [{ url: "/images/maori-kapa-haka-group.avif" }] },
  { id: "d2", title: "Ākonga learning", type: "Photo", caption: "Students working through their weekly lesson.", order: 2, isPublished: true, videoUrl: "", photo: [{ url: "/images/3-moari-girls.avif" }] },
  { id: "d3", title: "Group wānanga", type: "Photo", caption: "A powerful session connecting culture and learning.", order: 3, isPublished: true, videoUrl: "", photo: [{ url: "/images/maori-kapa-haka-group.avif" }] },
  { id: "d4", title: "Te ao Māori", type: "Photo", caption: "Celebrating identity and language.", order: 4, isPublished: true, videoUrl: "", photo: [{ url: "/images/3-moari-girls.avif" }] },
  { id: "d5", title: "Performance night", type: "Photo", caption: "An incredible evening of performance and whanaungatanga.", order: 5, isPublished: true, videoUrl: "", photo: [{ url: "/images/maori-kapa-haka-group.avif" }] },
  { id: "d6", title: "Community celebration", type: "Photo", caption: "Whānau and tamariki coming together.", order: 6, isPublished: true, videoUrl: "", photo: [{ url: "/images/3-moari-girls.avif" }] },
];

const DUMMY_VIDEOS: GalleryItem[] = [
  { id: "v1", title: "Welcome to Ngaru Pou", type: "Video", caption: "An introduction to our kaupapa and vision.", order: 1, isPublished: true, videoUrl: "#", photo: undefined },
  { id: "v2", title: "Te Pūawai — Level 1 highlights", type: "Video", caption: "Watch our youngest ākonga shine.", order: 2, isPublished: true, videoUrl: "#", photo: undefined },
  { id: "v3", title: "Kapa Haka showcase 2024", type: "Video", caption: "Highlights from our annual showcase evening.", order: 3, isPublished: true, videoUrl: "#", photo: undefined },
  { id: "v4", title: "Kaiako wānanga", type: "Video", caption: "Our teachers share their passion for te ao Māori.", order: 4, isPublished: true, videoUrl: "#", photo: undefined },
];

const VIDEO_GRADIENTS = [
  "from-primary/60 to-iron-depth",
  "from-secondary/60 to-iron-depth",
  "from-[#5b5fef]/60 to-iron-depth",
  "from-[#8b5cf6]/60 to-iron-depth",
];

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = { items: GalleryItem[] };

type ModalVideo = { embedUrl: string; title: string; caption?: string } | null;

// ─── Component ───────────────────────────────────────────────────────────────

export default function GallerySection({ items }: Props) {
  const [tab, setTab] = useState<"photos" | "videos">("photos");
  const [modal, setModal] = useState<ModalVideo>(null);

  const livePhotos = items.filter((i) => i.type === "Photo" && i.photo?.[0]?.url);
  const liveVideos = items.filter((i) => i.type === "Video");

  const photos = livePhotos.length > 0 ? livePhotos : DUMMY_PHOTOS;
  const videos = liveVideos.length > 0 ? liveVideos : DUMMY_VIDEOS;

  // Close modal on Escape key
  useEffect(() => {
    if (!modal) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setModal(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [modal]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = modal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modal]);

  return (
    <>
      <section className="section-md bg-midnight-tidal overflow-hidden">
        <div className="site-container">

          {/* Header */}
          <FadeUp className="flex flex-col gap-4 mb-10">
            <h2 className="section-h2 font-display text-white">our gallery</h2>
            <p className="font-sans text-white/60 text-[1.15rem] max-w-xl leading-relaxed">
              Moments from our performances, wānanga, and everyday learning journeys.
            </p>

            {/* Tab toggle */}
            <div className="flex gap-1 p-1 rounded-xl bg-iron-depth border border-white/10 w-fit mt-2">
              {(["photos", "videos"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-5 py-2 rounded-lg font-sans text-sm font-medium transition-all duration-200 ${
                    tab === t
                      ? "bg-primary text-white shadow-sm"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {t === "photos" ? <Camera size={14} /> : <Film size={14} />}
                    {t === "photos" ? "Photos" : "Videos"}
                  </span>
                </button>
              ))}
            </div>
          </FadeUp>

          {/* Photos grid */}
          {tab === "photos" && (
            <FadeUp key="photos">
              <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
                {photos.map((item, i) => (
                  <div
                    key={item.id}
                    className="break-inside-avoid group relative overflow-hidden rounded-xl bg-iron-depth"
                    style={{ aspectRatio: i % 3 === 0 ? "3/4" : i % 3 === 1 ? "1/1" : "4/3" }}
                  >
                    <Image
                      src={item.photo![0].url}
                      alt={item.caption || item.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {item.caption && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                        <p className="font-sans text-xs text-white/90 leading-snug">{item.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </FadeUp>
          )}

          {/* Videos grid */}
          {tab === "videos" && (
            <FadeUp key="videos">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {videos.map((item, i) => {
                  const thumbUrl = item.thumbnail?.[0]?.url;
                  const embedUrl = getVimeoEmbedUrl(item.videoUrl);

                  return (
                    <button
                      key={item.id}
                      onClick={() =>
                        embedUrl &&
                        setModal({ embedUrl, title: item.title, caption: item.caption })
                      }
                      className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-iron-depth transition-all duration-300 hover:-translate-y-1 hover:border-primary text-left cursor-pointer"
                    >
                      {/* Thumbnail */}
                      <div className="relative aspect-video overflow-hidden">
                        {thumbUrl ? (
                          <Image
                            src={thumbUrl}
                            alt={item.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className={`absolute inset-0 bg-gradient-to-br ${VIDEO_GRADIENTS[i % VIDEO_GRADIENTS.length]}`} />
                        )}
                        {/* Play button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-primary/80 group-hover:border-primary transition-all duration-300 group-hover:scale-110">
                            <Play size={22} className="text-white ml-1" fill="white" />
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4 flex flex-col gap-1">
                        <h3 className="font-display text-lg text-white leading-tight">
                          {item.title}
                        </h3>
                        {item.caption && (
                          <p className="font-sans text-xs text-white/50 leading-relaxed line-clamp-2">
                            {item.caption}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </FadeUp>
          )}
        </div>
      </section>

      {/* ── Video modal ─────────────────────────────────────────────────────── */}
      {modal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8"
          onClick={() => setModal(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Panel */}
          <div
            className="relative w-full max-w-4xl rounded-2xl overflow-hidden bg-iron-depth border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setModal(null)}
              aria-label="Close video"
              className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 border border-white/20 text-white/70 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
            >
              <X size={16} />
            </button>

            {/* Vimeo iframe — 16:9 */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={modal.embedUrl}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                title={modal.title}
              />
            </div>

            {/* Caption strip */}
            {(modal.title || modal.caption) && (
              <div className="px-6 py-4">
                {modal.title && (
                  <p className="font-display text-xl text-white">{modal.title}</p>
                )}
                {modal.caption && (
                  <p className="font-sans text-sm text-white/50 mt-1">{modal.caption}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
