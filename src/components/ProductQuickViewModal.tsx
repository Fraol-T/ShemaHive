"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Star, ShoppingBag, Check, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductQuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  if (!quickViewProduct) return null;

  const currentSize = selectedSize || quickViewProduct.sizes[0] || "M";
  const currentColor = selectedColor || quickViewProduct.colors[0]?.name || "Default";

  const handleAddToCart = () => {
    addToCart(quickViewProduct, currentSize, currentColor, quantity);
    setQuickViewProduct(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto">
        {/* BACKDROP */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setQuickViewProduct(null)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* MODAL CONTAINER */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 40 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-4xl bg-[#FAF7F2] rounded-t-2xl sm:rounded-xs shadow-2xl overflow-y-auto max-h-[90vh] sm:max-h-none border border-[#1C1917]/20 z-10 mt-8 mb-0 sm:my-8"
        >
          <div className="w-10 h-1 rounded-full bg-[#D6D3D1] mx-auto mt-2 mb-0 sm:hidden" />
          {/* CLOSE BUTTON */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 text-[#1C1917] hover:bg-white hover:scale-105 transition-all shadow-md"
            aria-label="Close product quick view"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* LEFT: IMAGE DISPLAY */}
            <div className="relative h-64 sm:h-80 md:h-full min-h-[280px] sm:min-h-[400px] bg-white">
              <Image
                src={quickViewProduct.image}
                alt={quickViewProduct.name}
                fill
                className="object-cover object-center"
              />
              {quickViewProduct.badge && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-[#F5B853] text-[#1C1917] font-bold text-xs uppercase tracking-wider rounded-sm shadow-md border border-[#1C1917]/20">
                  {quickViewProduct.badge}
                </span>
              )}
            </div>

            {/* RIGHT: DETAILS & OPTIONS */}
            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
              
              <div>
                {/* CATEGORY & RATING */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#B08085]">
                    {quickViewProduct.category} Collection
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{quickViewProduct.rating}</span>
                    <span className="text-[#78716C] font-normal">
                      ({quickViewProduct.reviewsCount} reviews)
                    </span>
                  </div>
                </div>

                {/* TITLE */}
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]">
                  {quickViewProduct.name}
                </h2>

                {/* PRICING */}
                <div className="flex items-baseline gap-3 mt-3 mb-4">
                  <span className="text-2xl font-extrabold text-[#1C1917]">
                    ${quickViewProduct.price}
                  </span>
                  {quickViewProduct.originalPrice && (
                    <span className="text-base text-[#9CA3AF] line-through">
                      ${quickViewProduct.originalPrice}
                    </span>
                  )}
                  {quickViewProduct.discountPercentage && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-sm">
                      Save {quickViewProduct.discountPercentage}%
                    </span>
                  )}
                </div>

                {/* DESCRIPTION */}
                <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed mb-6">
                  {quickViewProduct.description}
                </p>

                {/* COLOR SELECTION */}
                {quickViewProduct.colors.length > 0 && (
                  <div className="mb-5">
                    <span className="block text-xs font-bold text-[#1C1917] uppercase tracking-wider mb-2">
                      Color: <span className="font-normal text-[#57534E]">{currentColor}</span>
                    </span>
                    <div className="flex items-center gap-2.5">
                      {quickViewProduct.colors.map((c) => {
                        const isSelected = currentColor === c.name;
                        return (
                          <button
                            key={c.name}
                            onClick={() => setSelectedColor(c.name)}
                            className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-transform ${
                              isSelected
                                ? "border-[#1C1917] scale-110 shadow-md"
                                : "border-transparent opacity-80 hover:opacity-100"
                            }`}
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 text-white drop-shadow" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* SIZE SELECTION */}
                {quickViewProduct.sizes.length > 0 && (
                  <div className="mb-6">
                    <span className="block text-xs font-bold text-[#1C1917] uppercase tracking-wider mb-2">
                      Select Size:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {quickViewProduct.sizes.map((sz) => {
                        const isSelected = currentSize === sz;
                        return (
                          <button
                            key={sz}
                            onClick={() => setSelectedSize(sz)}
                            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xs border transition-all ${
                              isSelected
                                ? "bg-[#1C1917] text-white border-[#1C1917] shadow-sm"
                                : "bg-white text-[#1C1917] border-[#E7E2D8] hover:border-[#1C1917]"
                            }`}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* QUANTITY PICKER */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-xs font-bold text-[#1C1917] uppercase tracking-wider">
                    Quantity:
                  </span>
                  <div className="flex items-center border border-[#E7E2D8] bg-white rounded-xs">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-1 text-base font-bold text-[#1C1917] hover:bg-[#FAF7F2]"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 text-sm font-semibold text-[#1C1917]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3 py-1 text-base font-bold text-[#1C1917] hover:bg-[#FAF7F2]"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS & PERKS */}
              <div className="space-y-4 pt-4 border-t border-[#E7E2D8]">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3.5 bg-[#F5B853] hover:bg-[#E5A742] text-[#1C1917] font-bold text-sm tracking-wide rounded-xs border-2 border-[#1C1917] shadow-[3px_3px_0px_#1C1917] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Shopping Cart — ${(quickViewProduct.price * quantity).toFixed(2)}</span>
                </button>

                {/* PERKS LIST */}
                <div className="grid grid-cols-3 gap-2 text-[11px] text-[#78716C] pt-2">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#F5B853]" />
                    <span>Free Shipping</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-[#F5B853]" />
                    <span>30-Day Returns</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#F5B853]" />
                    <span>Authentic Item</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
