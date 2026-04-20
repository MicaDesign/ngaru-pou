"use client";

import Link from "next/link";
import { Compass, Eye } from "lucide-react";
import Button from "@/components/Button";

export default function HeroCTAs() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
      <Link href="/signup">
        <Button variant="secondary" icon={Compass}>
          Begin Your Journey
        </Button>
      </Link>
      <Link href="/how-it-works">
        <Button variant="ghost" icon={Eye}>
          See How It Works
        </Button>
      </Link>
    </div>
  );
}
