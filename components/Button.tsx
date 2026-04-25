"use client";

import { type LucideIcon } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-light",
  secondary:
    "bg-white/5 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)] backdrop-blur-[5px] hover:bg-white/[0.11]",
  ghost:
    "bg-transparent text-white hover:bg-midnight-tidal hover:text-secondary",
};

export default function Button({
  variant = "primary",
  icon: Icon,
  iconPosition = "right",
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex h-14 cursor-pointer items-center gap-3 rounded-lg px-6 font-sans text-base font-medium transition-all duration-300 ease-[cubic-bezier(.165,.84,.44,1)] hover:-translate-y-0.5 hover:scale-105 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {Icon && iconPosition === "left" && <Icon size={18} />}
      {children}
      {Icon && iconPosition === "right" && <Icon size={18} />}
    </button>
  );
}
