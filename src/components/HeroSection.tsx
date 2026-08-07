"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { PRODUCTS } from "@/data/products";

interface HeroSectionProps {
  onShopClick?: () => void;
}

export default function HeroSection({ onShopClick }: HeroSectionProps) {
  const { setQuickViewProduct, addToCart } = useCart();
  const heroRef = useRef<HTMLDivElement>(null);

  // Main hero products
  const mainModelProduct = PRODUCTS[0]; // Off-Shoulder Set
  const seatedCoatProduct = PRODUCTS[2]; // Sherpa Coat
  const fedoraManProduct = PRODUCTS[1]; // Fedora Suit
  const sunlightWomanProduct = PRODUCTS[3]; // Polka Dot Blouse

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-[calc(100vh-80px)] bg-[#FAF7F2] py-8 lg:py-14 px-4 sm:px-6 lg:px-12 flex flex-col justify-between overflow-hidden"
    >
      {/* ================= MOBILE & TABLET HERO BLOCK ================= */}
      <div className="lg:hidden flex flex-col gap-6 w-full relative z-10">
        
        {/* Headline & Badge Row */}
        <div className="flex justify-between items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs sm:text-sm font-semibold tracking-widest text-[#1C1917] uppercase">
                NEW ARRIVALS
              </span>
              <span className="w-12 sm:w-16 h-[1.5px] bg-[#1C1917]/70" />
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl font-extrabold tracking-tight text-[#1C1917] leading-[0.95]">
              JUST <br />
              FOR{" "}
              <span className="font-script font-normal text-6xl sm:text-7xl text-[#F5B853] inline-block -ml-2 transform -rotate-3 select-none">
                you
              </span>
            </h1>
          </motion.div>

          {/* Flash Sale Badge (Smaller) */}
          <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center -mt-2">
            <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow text-[#1C1917]">
              <path id="circlePathMobile" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
              <text className="text-[9px] font-bold tracking-[0.18em] uppercase fill-[#1C1917]">
                <textPath href="#circlePathMobile" startOffset="0%">
                  ⚡ FLASH SALE UPTO 50% DISCOUNT ⚡
                </textPath>
              </text>
            </svg>
            <div className="absolute w-10 h-10 rounded-full bg-[#FAF7F2] border-2 border-[#1C1917] flex items-center justify-center shadow-md">
              <span className="text-xs font-black text-[#1C1917]">⚡</span>
            </div>
          </div>
        </div>

        {/* Main Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative w-full h-[420px]"
        >
          <div className="relative z-10 w-full h-full bg-white rounded-2xl overflow-hidden shadow-xl border border-[#1C1917]/10 group">
            <Image
              src="/images/hero-main.jpg"
              alt="Summer Riviera Off-Shoulder Set"
              fill
              className="object-cover object-top"
              priority
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
              <button
                onClick={() => {
                  if (onShopClick) onShopClick();
                  else addToCart(mainModelProduct);
                }}
                className="px-8 py-3 bg-[#F5B853] hover:bg-[#E5A742] text-[#1C1917] font-semibold text-sm tracking-wide border-2 border-[#1C1917] shadow-[4px_4px_0px_#1C1917] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-200 whitespace-nowrap"
              >
                Shop Now
              </button>
            </div>
          </div>
        </motion.div>

        {/* Thumbnail Row */}
        <div className="flex overflow-x-auto gap-4 pb-2 snap-x hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {[fedoraManProduct, seatedCoatProduct, sunlightWomanProduct].map((prod, idx) => {
            const images = ["/images/hero-man.jpg", "/images/hero-seated.jpg", "/images/hero-woman.jpg"];
            return (
              <div
                key={idx}
                onClick={() => setQuickViewProduct(prod)}
                className="snap-start flex-shrink-0 relative w-[100px] sm:w-[140px] h-[120px] sm:h-[160px] rounded-xl overflow-hidden shadow-md border border-[#1C1917]/10 cursor-pointer"
              >
                <Image src={images[idx]} alt={prod.name} fill className="object-cover object-top" />
              </div>
            );
          })}
        </div>

      </div>

      {/* ================= HERO GRID CONTAINER (DESKTOP) ================= */}
      <div className="hidden lg:grid grid-cols-12 max-w-7xl mx-auto w-full gap-8 items-center relative z-10">
        
        {/* ================= LEFT COLUMN ================= */}
        <div className="hidden lg:flex lg:col-span-4 flex-col justify-between space-y-12">
          {/* Headline Block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs sm:text-sm font-semibold tracking-widest text-[#1C1917] uppercase">
                NEW ARRIVALS
              </span>
              <span className="w-16 h-[1.5px] bg-[#1C1917]/70" />
            </div>

            <h1 className="font-serif text-5xl sm:text-7xl xl:text-8xl font-extrabold tracking-tight text-[#1C1917] leading-[0.95]">
              JUST <br />
              FOR{" "}
              <span className="font-script font-normal text-6xl sm:text-8xl xl:text-9xl text-[#F5B853] inline-block -ml-2 transform -rotate-3 select-none">
                you
              </span>
            </h1>

            {/* Sparkle Star Graphic */}
            <div className="mt-4 ml-12 text-[#1C1917]">
              <Sparkles className="w-6 h-6 fill-[#1C1917] animate-pulse-subtle" />
            </div>
          </motion.div>

          {/* Bottom Left Card (Fedora Suit Man) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            onClick={() => setQuickViewProduct(fedoraManProduct)}
            className="group cursor-pointer relative w-full sm:w-64 lg:w-60 xl:w-64 h-72 rounded-sm overflow-hidden bg-[#F5B853] shadow-md border border-[#1C1917]/10 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <Image
              src="/images/hero-man.jpg"
              alt="Tailored Beige Blazer & Fedora Suit"
              fill
              className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
              <span className="text-white font-medium text-xs flex items-center gap-1">
                Explore Man Collection <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </motion.div>
        </div>

        {/* ================= CENTER COLUMN (Main Model Showcase) ================= */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative my-6 lg:my-0">
          
          {/* Top Floating Stamp Seal */}
          <div className="absolute -top-10 sm:-top-14 right-2 sm:right-10 z-20 pointer-events-none">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
              {/* Rotating Circular Text SVG */}
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full animate-spin-slow text-[#1C1917]"
              >
                <path
                  id="circlePath"
                  d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                  fill="none"
                />
                <text className="text-[9px] font-bold tracking-[0.18em] uppercase fill-[#1C1917]">
                  <textPath href="#circlePath" startOffset="0%">
                    ⚡ FLASH SALE UPTO 50% DISCOUNT ⚡
                  </textPath>
                </text>
              </svg>

              {/* Inner Badge Icon */}
              <div className="absolute w-12 h-12 rounded-full bg-[#FAF7F2] border-2 border-[#1C1917] flex items-center justify-center shadow-md">
                <span className="text-sm font-black text-[#1C1917]">⚡</span>
              </div>
            </div>
          </div>

          {/* Central Image Container with Mauve Backdrop Offset */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative w-full max-w-sm sm:max-w-md"
          >
            {/* Mauve / Dusty Rose Background Block */}
            <div className="absolute -bottom-6 -left-6 right-6 top-16 bg-[#B08085] rounded-xs shadow-md z-0" />

            {/* Central Model Photo */}
            <div className="relative z-10 w-full h-[460px] sm:h-[540px] bg-white rounded-xs overflow-hidden shadow-2xl border border-[#1C1917]/10 group">
              <Image
                src="/images/hero-main.jpg"
                alt="Summer Riviera Off-Shoulder Set"
                fill
                className="object-cover object-center group-hover:scale-103 transition-transform duration-700"
                priority
              />

              {/* Overlay CTA Button ("Shop Now") matching reference */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
                <button
                  onClick={() => {
                    if (onShopClick) onShopClick();
                    else addToCart(mainModelProduct);
                  }}
                  className="px-8 py-3 bg-[#F5B853] hover:bg-[#E5A742] text-[#1C1917] font-semibold text-sm tracking-wide border-2 border-[#1C1917] shadow-[4px_4px_0px_#1C1917] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
                >
                  Shop Now
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="hidden lg:flex lg:col-span-3 flex-col justify-between items-end space-y-12">
          
          {/* Top Right Card (Seated Coat Model) */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            onClick={() => setQuickViewProduct(seatedCoatProduct)}
            className="group cursor-pointer relative w-full sm:w-64 lg:w-56 xl:w-64 h-72 rounded-xs overflow-hidden bg-white shadow-xl border border-[#1C1917]/10 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <Image
              src="/images/hero-seated.jpg"
              alt="Bouclé Plush Sherpa Winter Coat"
              fill
              className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
              priority
            />

            {/* Overlay Button "View Details" */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setQuickViewProduct(seatedCoatProduct);
                }}
                className="px-5 py-2 bg-[#F5B853] text-[#1C1917] font-semibold text-xs border border-[#1C1917] shadow-sm hover:bg-[#E5A742] transition-colors whitespace-nowrap"
              >
                View Details
              </button>
            </div>

            {/* Decorative Pointer Cursor Icon */}
            <div className="absolute bottom-2 right-4 z-30 pointer-events-none text-[#1C1917] drop-shadow-md">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#1C1917" stroke="white" strokeWidth="1">
                <path d="M3 3l7 18 3-7 7-3L3 3z" />
              </svg>
            </div>
          </motion.div>

          {/* Bottom Right Card (Sunlight Woman Model) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            onClick={() => setQuickViewProduct(sunlightWomanProduct)}
            className="group cursor-pointer relative w-full sm:w-64 lg:w-56 xl:w-64 h-72 rounded-xs overflow-hidden bg-white shadow-lg border border-[#1C1917]/10 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <Image
              src="/images/hero-woman.jpg"
              alt="Polka Dot Silk Blouse & Blazer Set"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />

            {/* Floating Sparkle Icon */}
            <div className="absolute -top-3 left-4 text-[#D1D5DB]">
              <Sparkles className="w-5 h-5 fill-[#9CA3AF]" />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
              <span className="text-white font-medium text-xs flex items-center gap-1">
                Quick View <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
