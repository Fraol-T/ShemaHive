"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Search, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/context/StoreContext";
import { PRODUCTS } from "@/data/products";

const SUGGESTIONS = ["Ruana", "Scarf", "Duster", "Handwoven", "Olive"];

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, setQuickViewProduct } = useStore();
  const [query, setQuery] = useState("");

  // Every close path runs through here so the query clears without an effect.
  const close = useCallback(() => {
    setQuery("");
    setIsSearchOpen(false);
  }, [setIsSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isSearchOpen, close]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return PRODUCTS.filter((p) =>
      [p.name, p.description, p.category, p.code].some((field) =>
        field.toLowerCase().includes(q)
      )
    );
  }, [query]);

  return (
    <AnimatePresence>
      {isSearchOpen && (
        /* keyed motion child — see the note in ProductQuickViewModal */
        <motion.div
          key="search"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-navy/70 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Search the collection"
        >
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.22 }}
            className="w-full bg-surface-raised border-b border-line p-6 sm:p-12 shadow-2xl"
          >
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between gap-4 pb-4 border-b-2 border-navy">
                <div className="flex items-center gap-3 flex-1">
                  <Search className="w-6 h-6 text-ink" />
                  <label htmlFor="site-search" className="sr-only">
                    Search products
                  </label>
                  <input
                    id="site-search"
                    type="text"
                    autoFocus
                    placeholder="Search ruanas, scarves, dusters…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-transparent font-serif text-2xl sm:text-3xl text-ink placeholder:text-ink-subtle focus:outline-none"
                  />
                </div>
                <button
                  onClick={close}
                  className="p-2 rounded-full hover:bg-surface-sunken text-ink transition-colors"
                  aria-label="Close search"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {!query && (
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-ink-muted">
                    Try
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setQuery(tag)}
                        className="px-3.5 py-1.5 bg-surface text-xs font-semibold text-ink rounded-full border border-line hover:border-navy transition-all"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {query && (
                <div className="space-y-4 pt-2 max-h-[60vh] overflow-y-auto">
                  <div className="text-xs font-bold text-ink-muted uppercase tracking-wider">
                    {searchResults.length} matching {searchResults.length === 1 ? "piece" : "pieces"}
                  </div>

                  {searchResults.length === 0 ? (
                    <p className="text-sm text-ink-muted py-8 text-center">
                      Nothing matches &quot;{query}&quot;. Try &quot;ruana&quot;, &quot;scarf&quot;
                      or a product code.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {searchResults.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => {
                            close();
                            setQuickViewProduct(product);
                          }}
                          className="flex gap-3 p-3 bg-surface rounded-xs border border-line hover:border-navy hover:shadow-md cursor-pointer transition-all text-left"
                        >
                          <div className="relative w-16 h-20 bg-surface-sunken rounded-xs overflow-hidden shrink-0">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-col justify-between flex-1 min-w-0">
                            <div>
                              <span className="text-[10px] font-bold text-ink-muted uppercase">
                                {product.category}
                              </span>
                              <h4 className="font-serif text-sm font-bold text-ink line-clamp-2">
                                {product.name}
                              </h4>
                            </div>
                            <div className="flex justify-between items-center text-xs font-bold gap-2">
                              <span className="font-mono text-ink-muted">{product.code}</span>
                              <span className="text-ink flex items-center gap-0.5">
                                View <ArrowRight className="w-3 h-3" />
                              </span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
