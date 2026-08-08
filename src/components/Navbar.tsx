"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/context/StoreContext";
import { CATEGORIES } from "@/types/product";
import { FOLLOW_LINKS } from "@/data/brand";
import { InstagramIcon, TelegramIcon } from "./icons";
import Logo from "./Logo";

interface NavbarProps {
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export default function Navbar({ activeCategory = "All", onSelectCategory }: NavbarProps) {
  const { setIsSearchOpen } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (category: string) => {
    onSelectCategory?.(category);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-navy/95 backdrop-blur-md border-b border-line-on-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between gap-4">
        {/* LOGO */}
        <Link href="/" className="flex items-center shrink-0" aria-label="Shema Hive home">
          <Logo on="dark" className="h-9 md:h-11" priority />
        </Link>

        {/* CATEGORY NAV (desktop) */}
        <nav className="hidden md:flex items-center gap-7">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <div key={cat} className="relative flex flex-col items-center">
                <button
                  onClick={() => handleNavClick(cat)}
                  className={`text-sm font-medium py-1 transition-colors ${
                    isActive ? "text-on-navy font-semibold" : "text-on-navy-muted hover:text-on-navy"
                  }`}
                >
                  {cat}
                </button>
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-1 w-full h-[2px] bg-gold rounded-full"
                  />
                )}
              </div>
            );
          })}
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-1.5 text-sm font-medium text-on-navy hover:text-gold transition-colors p-2 -mr-1"
            aria-label="Search the collection"
          >
            <span className="hidden lg:inline">Search</span>
            <Search className="w-5 h-5 md:w-4 md:h-4" />
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <a
              href={FOLLOW_LINKS.telegram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Shema Hive on Telegram"
              className="w-8 h-8 rounded-full border border-line-on-navy flex items-center justify-center text-on-navy-muted hover:text-gold hover:border-gold transition-colors"
            >
              <TelegramIcon className="w-4 h-4" />
            </a>
            <a
              href={FOLLOW_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Shema Hive on Instagram"
              className="w-8 h-8 rounded-full border border-line-on-navy flex items-center justify-center text-on-navy-muted hover:text-gold hover:border-gold transition-colors"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-on-navy"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-navy border-b border-line-on-navy px-6 py-4 overflow-hidden"
          >
            <div className="flex flex-col">
              {["All", ...CATEGORIES, "New Arrivals"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleNavClick(cat)}
                  className={`w-full text-left text-base font-medium py-3 border-b border-line-on-navy/50 last:border-0 transition-colors ${
                    activeCategory === cat ? "text-gold" : "text-on-navy hover:text-gold"
                  }`}
                >
                  {cat}
                </button>
              ))}

              <div className="flex items-center gap-3 pt-4">
                <a
                  href={FOLLOW_LINKS.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-on-navy-muted hover:text-gold transition-colors"
                >
                  <TelegramIcon className="w-4 h-4" /> Telegram
                </a>
                <a
                  href={FOLLOW_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-on-navy-muted hover:text-gold transition-colors"
                >
                  <InstagramIcon className="w-4 h-4" /> Instagram
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
