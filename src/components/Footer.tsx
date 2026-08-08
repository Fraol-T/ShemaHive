"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { BRAND, FOLLOW_LINKS } from "@/data/brand";
import { InstagramIcon, TelegramIcon } from "./icons";
import Logo from "./Logo";

/**
 * Footer sits on beige, so it uses the light logo variant while the header
 * uses the dark one. Collections and Customer Care were removed — with no
 * checkout, order tracking and returns links had nothing to point at.
 */
export default function Footer() {
  return (
    <footer className="w-full bg-surface text-ink pt-16 pb-10 px-4 sm:px-6 lg:px-12 border-t border-line">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-line">
        {/* BRAND */}
        <div className="md:col-span-6 space-y-4">
          <Logo on="light" className="h-14" />
          <p className="text-sm text-ink-muted leading-relaxed max-w-md">
            {BRAND.description}
          </p>
          <p className="font-serif text-lg text-ink italic">{BRAND.tagline}</p>
        </div>

        {/* FOLLOW */}
        <div className="md:col-span-6 md:pl-8">
          <h4 className="font-serif text-sm font-bold text-ink uppercase tracking-wider mb-2">
            Stay in the loop
          </h4>
          <p className="text-sm text-ink-muted mb-5 max-w-sm">
            New pieces are posted to our channels first. Join us there to see each
            batch as it comes off the loom.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={FOLLOW_LINKS.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-0 group flex items-center justify-between gap-3 px-4 py-3 bg-navy text-on-navy rounded-xs border-2 border-navy hover:bg-ink transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <TelegramIcon className="w-5 h-5 text-gold" />
                <span className="text-sm font-bold">Join our Telegram</span>
              </span>
              <ArrowUpRight className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            <a
              href={FOLLOW_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-0 group flex items-center justify-between gap-3 px-4 py-3 bg-surface-raised text-ink rounded-xs border-2 border-navy hover:bg-surface-sunken transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <InstagramIcon className="w-5 h-5" />
                <span className="text-sm font-bold">Follow on Instagram</span>
              </span>
              <ArrowUpRight className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-ink-muted gap-3">
        <p>
          © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
        </p>
        <p className="font-mono">Handwoven in Ethiopia</p>
      </div>
    </footer>
  );
}
