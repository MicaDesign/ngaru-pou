"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { getSiteSettings, type SiteSettings } from "@/lib/settings";

const STYLE_CLASSES: Record<SiteSettings["announcementStyle"], string> = {
  info: "bg-primary/15 border-primary/25 text-primary",
  warning: "bg-semantic-yellow/15 border-semantic-yellow/25 text-semantic-yellow",
  success: "bg-semantic-green/15 border-semantic-green/25 text-semantic-green",
};

export default function AnnouncementBanner() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    getSiteSettings().then(setSettings);
  }, []);

  if (!settings?.announcementVisible || !settings.announcementText || dismissed) {
    return null;
  }

  const styleClass = STYLE_CLASSES[settings.announcementStyle] ?? STYLE_CLASSES.info;

  const content = (
    <span className="font-sans text-sm leading-snug">{settings.announcementText}</span>
  );

  return (
    <div className={`border-b ${styleClass} px-4 py-2.5`}>
      <div className="site-container flex items-center justify-between gap-4">
        <div className="flex-1 text-center">
          {settings.announcementLink ? (
            <Link
              href={settings.announcementLink}
              className="hover:underline underline-offset-2 transition-opacity hover:opacity-80"
            >
              {content}
            </Link>
          ) : (
            content
          )}
        </div>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss announcement"
          className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
