"use client";

import React, { useState } from "react";
import { StoreProvider } from "@/context/StoreContext";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductCatalog from "@/components/ProductCatalog";
import ProductQuickViewModal from "@/components/ProductQuickViewModal";
import SearchModal from "@/components/SearchModal";
import Toast from "@/components/Toast";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { PlaceholderBanner } from "@/components/PlaceholderNotice";
import { Category } from "@/types/product";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");

  const scrollToCatalog = () => {
    document.getElementById("catalog-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat as Category);
    scrollToCatalog();
  };

  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col bg-surface text-ink font-sans antialiased selection:bg-gold selection:text-navy pb-16 md:pb-0">
        <PlaceholderBanner />

        <Navbar
          activeCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />

        <main className="flex-1">
          <HeroSection onShopClick={scrollToCatalog} />
          <ProductCatalog
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </main>

        <ProductQuickViewModal />
        <SearchModal />
        <Toast />

        <Footer />
        <BottomNav onBrowseClick={scrollToCatalog} />
      </div>
    </StoreProvider>
  );
}
