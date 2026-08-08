"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { Eye, Heart, Rotate3D, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Category, CATEGORIES, Product, has360 } from "@/types/product";
import { PRODUCTS } from "@/data/products";
import { useStore } from "@/context/StoreContext";
import { PlaceholderChip } from "./PlaceholderNotice";

interface ProductCatalogProps {
  selectedCategory: Category;
  onCategoryChange: (cat: Category) => void;
}

type SortKey = "featured" | "nameAsc" | "newest";

export default function ProductCatalog({
  selectedCategory,
  onCategoryChange,
}: ProductCatalogProps) {
  const { setQuickViewProduct } = useStore();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortKey>("featured");

  const filters: Category[] = ["All", ...CATEGORIES, "New Arrivals"];

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    if (selectedCategory === "New Arrivals") {
      result = result.filter((p) => p.isNewArrival);
    } else if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (sortBy === "nameAsc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "newest") {
      result.sort((a, b) => Number(b.isNewArrival ?? false) - Number(a.isNewArrival ?? false));
    }

    return result;
  }, [selectedCategory, sortBy]);

  return (
    <section
      id="catalog-section"
      className="w-full bg-surface-raised py-16 px-4 sm:px-6 lg:px-12 border-t border-line"
    >
      <div className="max-w-7xl mx-auto">
        {/* HEADER & FILTERS */}
        {/* Side-by-side only at lg — at md the filter row needs the full width. */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ink-muted mb-2">
              <Sparkles className="w-4 h-4 text-gold" />
              <span>The Collection</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ink">
              Every piece, woven by hand
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto min-w-0">
            {/* min-w-0 lets this flex item shrink so overflow-x-auto actually scrolls */}
            <div className="flex overflow-x-auto scrollbar-hide flex-nowrap xl:flex-wrap items-center gap-2.5 min-w-0 flex-1">
              {filters.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onCategoryChange(cat)}
                  className={`whitespace-nowrap shrink-0 px-4 py-2 text-xs sm:text-sm font-semibold rounded-full border transition-all ${
                    selectedCategory === cat
                      ? "bg-navy text-on-navy border-navy shadow-sm"
                      : "bg-surface text-ink border-line hover:border-navy"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative hidden sm:block sm:ml-2">
              <label htmlFor="catalog-sort" className="sr-only">
                Sort products
              </label>
              <select
                id="catalog-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="bg-surface border border-line-strong text-ink text-xs sm:text-sm font-medium py-2 px-3 rounded-xs focus:outline-none focus:border-navy cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="newest">New arrivals first</option>
                <option value="nameAsc">Name: A–Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* GRID */}
        <motion.div
          layout
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product: Product) => {
              const isLiked = wishlist.includes(product.id);
              const spinnable = has360(product);
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.35 }}
                  key={product.id}
                  className="group relative bg-surface rounded-xs border border-line overflow-hidden hover:shadow-xl transition-all flex flex-col"
                >
                  {/* IMAGE — fixed aspect normalises the mixed source ratios */}
                  <button
                    onClick={() => setQuickViewProduct(product)}
                    className="relative w-full aspect-[3/4] overflow-hidden bg-surface-sunken cursor-pointer"
                    aria-label={`View ${product.name}`}
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />

                    {product.badge && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-gold text-navy font-bold text-[11px] uppercase tracking-wider rounded-xs shadow-sm border border-navy/20 z-10">
                        {product.badge}
                      </span>
                    )}

                    {spinnable && (
                      <span
                        className="absolute bottom-3 left-3 z-10 flex items-center gap-1 px-2 py-1 bg-navy/85 text-on-navy text-[10px] font-semibold uppercase tracking-wider rounded-xs backdrop-blur-sm"
                        title="360° view available"
                      >
                        <Rotate3D className="w-3 h-3" />
                        360°
                      </span>
                    )}

                    <span className="absolute inset-0 bg-navy/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-4 py-2 bg-surface-raised text-ink font-semibold text-xs rounded-xs shadow-md flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" />
                        Quick View
                      </span>
                    </span>
                  </button>

                  <button
                    onClick={(e) => toggleWishlist(product.id, e)}
                    className={`absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-md transition-transform hover:scale-110 ${
                      isLiked
                        ? "bg-navy text-gold"
                        : "bg-surface-raised/85 text-ink hover:bg-surface-raised"
                    }`}
                    aria-label={isLiked ? "Remove from saved" : "Save this piece"}
                    aria-pressed={isLiked}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? "fill-gold" : ""}`} />
                  </button>

                  {/* DETAILS */}
                  <div className="p-3 sm:p-4 lg:p-5 flex flex-col flex-1 gap-2 bg-surface-raised">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[9px] sm:text-[11px] font-semibold tracking-wider text-ink-muted uppercase">
                        {product.category}
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-mono font-semibold text-ink-muted">
                        {product.code}
                      </span>
                    </div>

                    <button
                      onClick={() => setQuickViewProduct(product)}
                      className="text-left font-serif text-sm sm:text-base lg:text-lg font-bold text-ink hover:text-navy/70 transition-colors line-clamp-2"
                    >
                      {product.name}
                    </button>

                    <p className="hidden sm:block text-xs text-ink-muted line-clamp-2">
                      {product.description}
                    </p>

                    <div className="mt-auto pt-3 border-t border-line">
                      <PlaceholderChip />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <p className="text-center text-sm text-ink-muted py-16">
            Nothing in this category yet.
          </p>
        )}
      </div>
    </section>
  );
}
