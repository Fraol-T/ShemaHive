"use client";

import React, { useState } from "react";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductCatalog from "@/components/ProductCatalog";
import ProductQuickViewModal from "@/components/ProductQuickViewModal";
import CartDrawer from "@/components/CartDrawer";
import SearchModal from "@/components/SearchModal";
import AccountModal from "@/components/AccountModal";
import Toast from "@/components/Toast";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { Category } from "@/types/product";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");

  const scrollToCatalog = () => {
    const catalogElem = document.getElementById("catalog-section");
    if (catalogElem) {
      catalogElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat as Category);
    scrollToCatalog();
  };

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1C1917] font-sans antialiased selection:bg-[#F5B853] selection:text-[#1C1917] pb-16 md:pb-0">
        {/* TOP NAVBAR */}
        <Navbar
          activeCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />

        {/* HERO SECTION (Reference Image Visual Match) */}
        <main className="flex-1">
          <HeroSection onShopClick={scrollToCatalog} />

          {/* CURATED PRODUCT CATALOG SECTION */}
          <ProductCatalog
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </main>

        {/* INTERACTIVE MODALS & DRAWERS */}
        <ProductQuickViewModal />
        <CartDrawer />
        <SearchModal />
        <AccountModal />
        <Toast />

        {/* FOOTER */}
        <Footer />

        {/* MOBILE BOTTOM NAVIGATION */}
        <BottomNav />
      </div>
    </CartProvider>
  );
}
