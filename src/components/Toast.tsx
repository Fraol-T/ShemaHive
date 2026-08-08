"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/context/StoreContext";

export default function Toast() {
  const { toastMessage } = useStore();

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          role="status"
          aria-live="polite"
          className="fixed bottom-20 md:bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-navy text-on-navy rounded-xs shadow-2xl border border-gold"
        >
          <CheckCircle2 className="w-5 h-5 text-gold" />
          <span className="text-xs font-semibold tracking-wide">{toastMessage}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
