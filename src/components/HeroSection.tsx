"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "@/context/StoreContext";
import { PRODUCTS } from "@/data/products";
import { BRAND } from "@/data/brand";

interface HeroSectionProps {
  onShopClick?: () => void;
}

const byId = (id: string) => PRODUCTS.find((p) => p.id === id)!;

/** Rotating seal — gold ring on beige is decoration, so it stays clear of the text rule. */
function HandwovenSeal({ size = "w-28 h-28" }: { size?: string }) {
  return (
    <div className={`relative ${size} flex items-center justify-center`}>
      <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
        <path
          id="sealPath"
          d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
          fill="none"
        />
        <text className="text-[8.5px] font-bold tracking-[0.2em] uppercase fill-navy">
          <textPath href="#sealPath" startOffset="0%">
            · HANDWOVEN IN ETHIOPIA · TRADITIONAL LOOM ·
          </textPath>
        </text>
      </svg>
      <div className="absolute w-12 h-12 rounded-full bg-gold border-2 border-navy flex items-center justify-center shadow-sm">
        <span className="font-serif text-sm font-bold text-navy">SH</span>
      </div>
    </div>
  );
}

export default function HeroSection({ onShopClick }: HeroSectionProps) {
  const { setQuickViewProduct } = useStore();

  const feature = byId("coat-rust");
  const cardA = byId("scarf-heritage");
  const cardB = byId("scarf-diamond");
  const cardC = byId("coat-chevron");

  return (
    <section className="relative w-full bg-surface py-8 lg:py-14 px-4 sm:px-6 lg:px-12 overflow-hidden">
      {/* ================= MOBILE / TABLET ================= */}
      <div className="lg:hidden flex flex-col gap-6 w-full relative z-10">
        <div className="flex justify-between items-start gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-semibold tracking-widest text-ink-muted uppercase">
                Handwoven
              </span>
              <span className="w-12 h-px bg-gold" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight text-ink leading-[1.02]">
              {BRAND.tagline}
            </h1>
          </motion.div>

          <div className="shrink-0 -mt-2">
            <HandwovenSeal size="w-20 h-20" />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative w-full h-[420px]"
        >
          <div className="relative z-10 w-full h-full bg-surface-raised rounded-sm overflow-hidden shadow-xl border border-line">
            <Image
              src={feature.image}
              alt={feature.name}
              fill
              sizes="100vw"
              className="object-cover object-center"
              priority
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
              <button
                onClick={onShopClick}
                className="px-8 py-3 bg-gold hover:bg-gold-hover text-navy font-semibold text-sm tracking-wide border-2 border-navy shadow-[4px_4px_0px_var(--color-navy)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all whitespace-nowrap"
              >
                Explore the collection
              </button>
            </div>
          </div>
        </motion.div>

        <div className="flex overflow-x-auto gap-4 pb-2 snap-x scrollbar-hide">
          {[cardA, cardB, cardC].map((prod) => (
            <button
              key={prod.id}
              onClick={() => setQuickViewProduct(prod)}
              className="snap-start shrink-0 relative w-[110px] sm:w-[150px] h-[130px] sm:h-[170px] rounded-sm overflow-hidden shadow-md border border-line"
            >
              <Image
                src={prod.image}
                alt={prod.name}
                fill
                sizes="150px"
                className="object-cover object-top"
              />
            </button>
          ))}
        </div>
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="hidden lg:grid grid-cols-12 max-w-7xl mx-auto w-full gap-8 items-center relative z-10">
        {/* LEFT */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-semibold tracking-widest text-ink-muted uppercase">
                Handwoven
              </span>
              <span className="w-16 h-px bg-gold" />
            </div>

            <h1 className="font-serif text-6xl xl:text-7xl font-extrabold tracking-tight text-ink leading-[1.02]">
              {BRAND.tagline}
            </h1>

            <p className="mt-5 text-sm text-ink-muted leading-relaxed max-w-sm">
              {BRAND.description}
            </p>

            <button
              onClick={onShopClick}
              className="mt-7 px-7 py-3 bg-gold hover:bg-gold-hover text-navy font-semibold text-sm tracking-wide border-2 border-navy shadow-[4px_4px_0px_var(--color-navy)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              Explore the collection
            </button>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            onClick={() => setQuickViewProduct(cardA)}
            className="group cursor-pointer relative w-full max-w-[260px] h-72 rounded-sm overflow-hidden shadow-md border border-line hover:shadow-xl transition-all hover:-translate-y-1 text-left"
          >
            <Image
              src={cardA.image}
              alt={cardA.name}
              fill
              sizes="260px"
              className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
              {/* solid backing: text over a photo can't be contrast-verified */}
              <span className="text-on-navy font-medium text-xs flex items-center gap-1 bg-navy px-2.5 py-1.5 rounded-xs">
                {cardA.name} <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </motion.button>
        </div>

        {/* CENTER */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <div className="absolute -top-12 right-4 z-20 pointer-events-none">
            <HandwovenSeal size="w-32 h-32" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative w-full max-w-md"
          >
            {/* gold offset block — decoration only */}
            <div className="absolute -bottom-6 -left-6 right-6 top-16 bg-gold rounded-sm shadow-md z-0" />

            <div className="relative z-10 w-full h-[560px] bg-surface-raised rounded-sm overflow-hidden shadow-2xl border border-line group">
              <Image
                src={feature.image}
                alt={feature.name}
                fill
                sizes="(max-width: 1280px) 40vw, 460px"
                className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-700"
                priority
              />
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
                <button
                  onClick={() => setQuickViewProduct(feature)}
                  className="px-8 py-3 bg-gold hover:bg-gold-hover text-navy font-semibold text-sm tracking-wide border-2 border-navy shadow-[4px_4px_0px_var(--color-navy)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                  View this piece
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-3 flex flex-col justify-between items-end gap-12">
          {[cardB, cardC].map((prod, i) => (
            <motion.button
              key={prod.id}
              initial={{ opacity: 0, y: i === 0 ? -20 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 + i * 0.1 }}
              onClick={() => setQuickViewProduct(prod)}
              className="group cursor-pointer relative w-full max-w-[260px] h-72 rounded-sm overflow-hidden shadow-lg border border-line hover:shadow-2xl transition-all hover:-translate-y-1 text-left"
            >
              <Image
                src={prod.image}
                alt={prod.name}
                fill
                sizes="260px"
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                {/* solid backing: text over a photo can't be contrast-verified */}
              <span className="text-on-navy font-medium text-xs flex items-center gap-1 bg-navy px-2.5 py-1.5 rounded-xs">
                  {prod.name} <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
