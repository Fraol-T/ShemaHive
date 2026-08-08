"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import { PLACEHOLDER_COPY } from "@/data/brand";

/**
 * The brief requires placeholder content to be visibly marked so it can never
 * be mistaken for final copy. Product photography and codes are real; the
 * names and descriptions are not yet. Both this banner and the per-card chip
 * disappear the moment PLACEHOLDER_COPY flips to false.
 */
export function PlaceholderBanner() {
  if (!PLACEHOLDER_COPY) return null;
  return (
    <div className="w-full bg-navy text-on-navy border-b border-line-on-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-2 flex items-center gap-2.5 text-[11px] sm:text-xs">
        <AlertTriangle className="w-4 h-4 text-gold shrink-0" aria-hidden="true" />
        <p className="leading-snug">
          <span className="font-bold uppercase tracking-wider">Draft build</span>
          <span className="text-on-navy-muted">
            {" "}
            — product names and descriptions are placeholder copy awaiting the client&apos;s
            final text. Photography and product codes are real.
          </span>
        </p>
      </div>
    </div>
  );
}

export function PlaceholderChip({ className = "" }: { className?: string }) {
  if (!PLACEHOLDER_COPY) return null;
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 bg-surface-sunken border border-line-strong text-ink-muted text-[9px] font-bold uppercase tracking-wider rounded-xs ${className}`}
      title="Name and description are placeholder copy"
    >
      Draft copy
    </span>
  );
}
