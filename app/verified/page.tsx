"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function VerifiedPage() {
  return (
    <div className="min-h-screen bg-iron-depth flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.165, 0.84, 0.44, 1] }}
        className="w-full max-w-md bg-midnight-tidal border border-white/10 rounded-2xl p-8 md:p-10 shadow-xl flex flex-col items-center text-center gap-6"
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.165, 0.84, 0.44, 1] }}
        >
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ delay: 0.7, duration: 0.6, ease: "easeInOut" }}
          >
            <CheckCircle size={64} className="text-secondary" />
          </motion.div>
        </motion.div>

        <div>
          <h1 className="font-display text-4xl text-white mb-2">email verified!</h1>
          <p className="text-white/50 text-sm leading-relaxed">
            Your account is ready. Time to begin.
          </p>
          <p className="text-white/30 text-sm italic mt-3">
            Ko tō ako, ko tō mana.
          </p>
        </div>

        <div className="w-full flex flex-col gap-3">
          <Link
            href="/dashboard"
            className="w-full flex items-center justify-center py-3.5 rounded-lg bg-primary hover:bg-primary-light text-white font-semibold transition-all duration-300"
          >
            Begin Your Journey
          </Link>
          <Link
            href="/"
            className="w-full flex items-center justify-center py-3 rounded-lg border border-white/20 text-white/60 hover:border-white/40 hover:text-white font-semibold text-sm transition-all duration-200"
          >
            Back to Homepage
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
