"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Search, X, Star, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { PRODUCTS } from "@/data/products";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, setQuickViewProduct } = useCart();
  const [query, setQuery] = useState("");

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [query]);

  if (!isSearchOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.25 }}
          className="w-full bg-[#FAF7F2] border-b border-[#1C1917]/20 p-6 sm:p-12 shadow-2xl"
        >
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* SEARCH INPUT BAR */}
            <div className="flex items-center justify-between gap-4 pb-4 border-b-2 border-[#1C1917]">
              <div className="flex items-center gap-3 flex-1">
                <Search className="w-6 h-6 text-[#1C1917]" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search clothing, dresses, suits, blazers..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-transparent font-serif text-2xl sm:text-3xl text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none"
                />
              </div>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-2 rounded-full hover:bg-[#E7E2D8] text-[#1C1917] transition-colors"
                aria-label="Close search"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* QUICK SUGGESTIONS */}
            {!query && (
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#78716C]">
                  Popular Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {["Off-Shoulder Set", "Fedora Suit", "Sherpa Coat", "Silk Blouse", "Cashmere Sweater"].map(
                    (tag) => (
                      <button
                        key={tag}
                        onClick={() => setQuery(tag)}
                        className="px-3.5 py-1.5 bg-white text-xs font-semibold text-[#1C1917] rounded-full border border-[#E7E2D8] hover:border-[#1C1917] transition-all"
                      >
                        {tag}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* RESULTS LIST */}
            {query && (
              <div className="space-y-4 pt-2 max-h-[60vh] overflow-y-auto">
                <div className="text-xs font-bold text-[#78716C] uppercase tracking-wider">
                  Found {searchResults.length} matching items
                </div>

                {searchResults.length === 0 ? (
                  <p className="text-sm text-[#78716C] py-8 text-center">
                    No matching items found for &quot;{query}&quot;. Try searching for &quot;suit&quot;, &quot;coat&quot;, or &quot;blouse&quot;.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setQuickViewProduct(product);
                        }}
                        className="flex gap-3 p-3 bg-white rounded-xs border border-[#E7E2D8] hover:border-[#1C1917] hover:shadow-md cursor-pointer transition-all"
                      >
                        <div className="relative w-16 h-20 bg-[#FAF7F2] rounded-xs overflow-hidden shrink-0">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col justify-between flex-1">
                          <div>
                            <span className="text-[10px] font-bold text-[#B08085] uppercase">
                              {product.category}
                            </span>
                            <h4 className="font-serif text-sm font-bold text-[#1C1917] line-clamp-1">
                              {product.name}
                            </h4>
                          </div>
                          <div className="flex justify-between items-center text-xs font-bold">
                            <span className="text-[#1C1917]">${product.price}</span>
                            <span className="text-[#F5B853] flex items-center gap-0.5">
                              View <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
