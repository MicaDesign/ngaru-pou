import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import MemberstackProvider from "@/components/MemberstackProvider";
import LayoutShell from "@/components/LayoutShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const ngaMihi = localFont({
  src: "./fonts/NgaMihi.ttf",
  variable: "--font-nga-mihi",
  display: "swap",
});

const SITE_URL = "https://www.ngarupou.org.au";
const DEFAULT_DESCRIPTION =
  "Ngaru Pou empowers rangatahi through kapa haka, waiata, and culturally grounded education in Western Australia. Discover your identity through te ao Māori.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ngaru Pou — Māori Cultural Arts",
    template: "%s — Ngaru Pou",
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "Māori", "kapa haka", "te reo Māori", "waiata", "rangatahi",
    "Western Australia", "cultural arts", "Ngaru Pou", "te ao Māori",
    "Māori education", "tamariki",
  ],
  authors: [{ name: "Ngaru Pou Cultural Arts Inc.", url: SITE_URL }],
  creator: "Ngaru Pou Cultural Arts Inc.",
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: SITE_URL,
    siteName: "Ngaru Pou",
    title: "Ngaru Pou — Māori Cultural Arts",
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Ngaru Pou — Māori Cultural Arts",
    description: DEFAULT_DESCRIPTION,
  },
  icons: {
    icon: "/images/logo-icon-4.svg",
    apple: "/images/logo-icon-4.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU" className={`${inter.variable} ${ngaMihi.variable}`}>
      <body className="font-sans flex flex-col min-h-screen">
        <MemberstackProvider>
          <LayoutShell>{children}</LayoutShell>
        </MemberstackProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
