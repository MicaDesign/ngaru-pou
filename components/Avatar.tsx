"use client";

/* eslint-disable @next/next/no-img-element */

type Props = {
  src?: string | null;
  name: string;
  size?: number;
  className?: string;
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Deterministic colour from name
const COLOURS = [
  "bg-primary",
  "bg-secondary",
  "bg-lagoon-drift",
  "bg-semantic-green",
  "bg-[#7c6ff7]",
  "bg-[#f76f8e]",
  "bg-[#f7a76f]",
];

function colourFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLOURS[Math.abs(hash) % COLOURS.length];
}

export default function Avatar({ src, name, size = 36, className = "" }: Props) {
  const style = { width: size, height: size, minWidth: size, fontSize: size * 0.38 };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={style}
        className={`rounded-full object-cover shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      style={style}
      className={`rounded-full shrink-0 flex items-center justify-center font-sans font-semibold text-white ${colourFor(name)} ${className}`}
    >
      {initials(name)}
    </div>
  );
}
