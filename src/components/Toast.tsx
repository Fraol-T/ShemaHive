"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Toast() {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#1C1917] text-white rounded-xs shadow-2xl border border-[#F5B853]"
      >
        <CheckCircle2 className="w-5 h-5 text-[#F5B853]" />
        <span className="text-xs font-semibold tracking-wide">{toastMessage}</span>
      </motion.div>
    </AnimatePresence>
  );
}
