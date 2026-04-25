import Link from "next/link";
import Image from "next/image";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-[calc(100vh-6rem)] overflow-hidden bg-midnight-tidal flex items-center justify-center px-6">
      <div className="relative z-10 flex flex-col items-center text-center max-w-xl">
        <Link
          href="/"
          className="mb-10 inline-block opacity-80 transition-transform duration-200 hover:scale-105 hover:opacity-100"
          aria-label="Ngaru Pou — back to homepage"
        >
          <Image
            src="/images/logo-icon-4.svg"
            alt="Ngaru Pou"
            width={72}
            height={72}
            className="h-16 w-16"
            priority
          />
        </Link>

        <p className="font-sans text-xs uppercase tracking-[0.3em] text-primary mb-4">
          404
        </p>

        <h1 className="font-display text-5xl md:text-7xl text-white leading-none mb-5">
          page not found
        </h1>

        <p className="font-sans text-white/60 leading-relaxed mb-10 max-w-md">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-flex h-14 items-center gap-3 rounded-lg px-6 bg-primary text-white font-sans font-medium transition-all duration-300 ease-[cubic-bezier(.165,.84,.44,1)] hover:bg-primary-light hover:-translate-y-0.5"
        >
          <Home size={18} />
          Go home
        </Link>
      </div>

      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-12 -right-12 h-80 w-80 md:h-[460px] md:w-[460px]"
        viewBox="0 0 460 460"
        fill="none"
      >
        <line
          x1="0"
          y1="460"
          x2="460"
          y2="0"
          strokeWidth="1"
          className="stroke-current text-primary"
        />
        <line
          x1="60"
          y1="460"
          x2="460"
          y2="60"
          strokeWidth="1"
          strokeOpacity="0.45"
          className="stroke-current text-white"
        />
        <line
          x1="120"
          y1="460"
          x2="460"
          y2="120"
          strokeWidth="1"
          className="stroke-current text-secondary"
        />
        <line
          x1="180"
          y1="460"
          x2="460"
          y2="180"
          strokeWidth="1"
          strokeOpacity="0.7"
          className="stroke-current text-lagoon-drift"
        />
        <line
          x1="240"
          y1="460"
          x2="460"
          y2="240"
          strokeWidth="1"
          strokeOpacity="0.3"
          className="stroke-current text-white"
        />
      </svg>
    </div>
  );
}
