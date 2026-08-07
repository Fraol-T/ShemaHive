"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Star, Eye, ShoppingBag, Heart, Filter, Sparkles } from "lucide-react";
import { Category, Product } from "@/types/product";
import { PRODUCTS } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

interface ProductCatalogProps {
  selectedCategory: Category;
  onCategoryChange: (cat: Category) => void;
}

export default function ProductCatalog({
  selectedCategory,
  onCategoryChange,
}: ProductCatalogProps) {
  const { addToCart, setQuickViewProduct } = useCart();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"featured" | "lowToHigh" | "highToLow" | "rating">("featured");

  const categories: Category[] = ["All", "Woman", "Man", "New Arrivals", "Flash Sale"];

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    if (selectedCategory === "Woman") {
      result = result.filter((p) => p.category === "Woman");
    } else if (selectedCategory === "Man") {
      result = result.filter((p) => p.category === "Man");
    } else if (selectedCategory === "New Arrivals") {
      result = result.filter((p) => p.isNewArrival);
    } else if (selectedCategory === "Flash Sale") {
      result = result.filter((p) => p.isFlashSale);
    }

    if (sortBy === "lowToHigh") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "highToLow") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [selectedCategory, sortBy]);

  return (
    <section id="catalog-section" className="w-full bg-white py-16 px-4 sm:px-6 lg:px-12 border-t border-[#E7E2D8]/80">
      <div className="max-w-7xl mx-auto">
        
        {/* SECTION HEADER & FILTERS */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#B08085] mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Curated Collection</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1917]">
              Explore Collection
            </h2>
          </div>

          {/* CATEGORY TABS & SORT */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
            <div className="flex overflow-x-auto scrollbar-hide flex-nowrap sm:flex-wrap items-center gap-3 w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`whitespace-nowrap shrink-0 px-4 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 ${
                  selectedCategory === cat
                    ? "bg-[#1C1917] text-white shadow-md"
                    : "bg-[#FAF7F2] text-[#57534E] hover:bg-[#E7E2D8] hover:text-[#1C1917]"
                }`}
              >
                {cat}
              </button>
            ))}
            </div>

            {/* SORT SELECTOR */}
            <div className="relative hidden sm:block ml-auto sm:ml-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#FAF7F2] border border-[#E7E2D8] text-[#1C1917] text-xs sm:text-sm font-medium py-2 px-3 rounded-md focus:outline-none focus:border-[#1C1917] cursor-pointer"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* PRODUCTS GRID */}
        <motion.div layout className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-8">
          <AnimatePresence>
            {filteredProducts.map((product) => {
              const isLiked = wishlist.includes(product.id);
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  key={product.id}
                  className="group relative bg-[#FAF7F2]/50 rounded-xs border border-[#E7E2D8]/80 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  {/* IMAGE CONTAINER */}
                  <div className="relative w-full h-48 sm:h-64 lg:h-80 overflow-hidden bg-[#FAF7F2] cursor-pointer" onClick={() => setQuickViewProduct(product)}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* BADGE */}
                    {product.badge && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#F5B853] text-[#1C1917] font-bold text-[11px] uppercase tracking-wider rounded-sm shadow-sm border border-[#1C1917]/10 z-10">
                        {product.badge}
                      </span>
                    )}

                    {/* WISHLIST BUTTON */}
                    <button
                      onClick={(e) => toggleWishlist(product.id, e)}
                      className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-transform duration-200 hover:scale-110 ${
                        isLiked ? "bg-red-500 text-white" : "bg-white/80 text-[#1C1917] hover:bg-white"
                      }`}
                      aria-label="Add to wishlist"
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? "fill-white" : ""}`} />
                    </button>

                    {/* QUICK VIEW HOVER OVERLAY */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuickViewProduct(product);
                        }}
                        className="px-4 py-2 bg-white text-[#1C1917] font-semibold text-xs rounded-sm shadow-md hover:bg-[#F5B853] transition-colors flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Quick View
                      </button>
                    </div>
                  </div>

                  {/* PRODUCT DETAILS */}
                  <div className="p-3 sm:p-4 lg:p-5 flex flex-col flex-1 justify-between bg-white">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[9px] sm:text-[11px] font-semibold tracking-wider text-[#78716C] uppercase">
                          {product.category}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{product.rating}</span>
                          <span className="text-[#A8A29E] font-normal">({product.reviewsCount})</span>
                        </div>
                      </div>

                      <h3
                        onClick={() => setQuickViewProduct(product)}
                        className="font-serif text-sm sm:text-base lg:text-lg font-bold text-[#1C1917] group-hover:text-[#F5B853] transition-colors line-clamp-1 cursor-pointer"
                      >
                        {product.name}
                      </h3>

                      <p className="hidden sm:block text-xs text-[#78716C] line-clamp-2 mt-1 mb-4">
                        {product.description}
                      </p>
                    </div>

                    {/* PRICE & ADD TO CART */}
                    <div className="pt-3 border-t border-[#E7E2D8]/60 flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm sm:text-base lg:text-lg font-bold text-[#1C1917]">
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-[#A8A29E] line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => addToCart(product)}
                        className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 bg-[#F5B853] hover:bg-[#E5A742] text-[#1C1917] text-[10px] sm:text-xs font-bold rounded-xs border border-[#1C1917]/20 flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
