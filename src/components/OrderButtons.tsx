"use client";

import React from "react";
import { ORDER_CONTACT, ORDER_INSTRUCTIONS } from "@/data/brand";
import { InstagramIcon, TelegramIcon } from "./icons";

interface OrderButtonsProps {
  /** Shown to the shopper so they can quote it in the message. */
  code: string;
  productName: string;
  size?: "sm" | "lg";
}

/**
 * Replaces the old add-to-cart flow. Neither platform supports prefilling a
 * message, so we surface the product code prominently instead.
 */
export default function OrderButtons({ code, productName, size = "lg" }: OrderButtonsProps) {
  const pad = size === "lg" ? "py-3.5 text-sm" : "py-2.5 text-xs";

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-ink-muted">
        <span className="font-semibold uppercase tracking-wider text-ink">Code</span>
        <span className="px-2 py-0.5 bg-surface-sunken border border-line font-mono font-semibold text-ink rounded-xs">
          {code}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <a
          href={ORDER_CONTACT.telegram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Order ${productName} (${code}) on Telegram`}
          className={`${pad} px-4 bg-gold hover:bg-gold-hover text-navy font-bold tracking-wide rounded-xs border-2 border-navy shadow-[3px_3px_0px_var(--color-navy)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-2`}
        >
          <TelegramIcon className="w-4 h-4" />
          <span>Order on Telegram</span>
        </a>

        <a
          href={ORDER_CONTACT.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Order ${productName} (${code}) on Instagram`}
          className={`${pad} px-4 bg-navy hover:bg-ink text-on-navy font-bold tracking-wide rounded-xs border-2 border-navy hover:opacity-90 transition-all flex items-center justify-center gap-2`}
        >
          <InstagramIcon className="w-4 h-4" />
          <span>Order on Instagram</span>
        </a>
      </div>

      <p className="text-[11px] text-ink-muted leading-relaxed">{ORDER_INSTRUCTIONS}</p>
    </div>
  );
}
