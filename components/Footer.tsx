"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, Mail } from "lucide-react";

const footerColumns = [
  [
    { label: "Courses", href: "/lessons" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "About Us", href: "/about-us" },
  ],
  [
    { label: "F.A.Q.", href: "/faq" },
    { label: "Sign Up", href: "/signup" },
    { label: "Log In", href: "/login" },
  ],
  [
    { label: "Code of Conduct", href: "/enrolment/code-of-conduct" },
    { label: "Uniform Regulations", href: "/enrolment/uniform-regulations" },
    { label: "Handy Hints", href: "/enrolment/handy-hints" },
    { label: "Terms of Service", href: "/enrolment/terms-of-service" },
    { label: "Legal & Privacy", href: "/enrolment/legal" },
  ],
];

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer className="border-t border-white/[0.11] bg-midnight-tidal pt-16 pb-8">
      <div className="site-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <Link
            href="/"
            className="inline-block w-[14rem] transition-transform duration-300 ease-[cubic-bezier(.165,.84,.44,1)] hover:scale-[1.05]"
          >
            <Image
              src="/images/main-logo-white-tagline.svg"
              alt="Ngaru Pou"
              width={224}
              height={64}
            />
          </Link>
          {footerColumns.map((col, i) => (
            <ul key={i} className="flex flex-col gap-1 items-start">
              {col.map(({ label, href }) => {
                const isActive = pathname === href;
                return (
                  <li key={label}>
                    <Link
                      href={href}
                      aria-current={isActive ? "page" : undefined}
                      className={`font-sans text-[1.1rem] px-[10px] py-[5px] rounded-full inline-block transition-colors duration-300 ease-[cubic-bezier(.165,.84,.44,1)] ${
                        isActive
                          ? "bg-primary text-white"
                          : "text-white hover:text-primary"
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          ))}
        </div>

        <div className="h-px bg-white/[0.11] my-6" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <p className="font-sans text-[1.1rem] text-white/50">
              © {new Date().getFullYear()} Ngaru Pou
            </p>
            <Link
              href="https://www.micadesign.com.au/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[1.1rem] text-white/50 transition-colors duration-300 ease-[cubic-bezier(.165,.84,.44,1)] hover:text-primary"
            >
              Designed by Mica Design
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="#"
              aria-label="Visit Ngaru Pou on X"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)] backdrop-blur-sm transition-all duration-300 ease-[cubic-bezier(.165,.84,.44,1)] hover:bg-white/[0.11] hover:-translate-y-0.5"
            >
              <Globe size={16} />
            </Link>
            <Link
              href="#"
              aria-label="Contact Ngaru Pou"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)] backdrop-blur-sm transition-all duration-300 ease-[cubic-bezier(.165,.84,.44,1)] hover:bg-white/[0.11] hover:-translate-y-0.5"
            >
              <Mail size={16} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
