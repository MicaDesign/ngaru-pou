import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
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

export const metadata: Metadata = {
  title: "Ngaru Pou",
  description:
    "Ngāruapō supports Māori students to thrive in both te ao Māori and te ao whānui.",
  icons: {
    icon: "/images/logo-icon-4.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mi" className={`${inter.variable} ${ngaMihi.variable}`}>
      <body className="font-sans flex flex-col min-h-screen">
        <MemberstackProvider>
          <LayoutShell>{children}</LayoutShell>
        </MemberstackProvider>
        <Analytics />
      </body>
    </html>
  );
}
