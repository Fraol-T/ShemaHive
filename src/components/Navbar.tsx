"use client";

import React, { useState } from "react";
import { Search, ShoppingBag, User, Menu, X, Zap } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export default function Navbar({ activeCategory = "All", onSelectCategory }: NavbarProps) {
  const { totalItemsCount, setIsCartOpen, setIsSearchOpen, setIsAccountOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Shop", category: "All" },
    { name: "Man", category: "Man" },
    { name: "Woman", category: "Woman" },
    { name: "Clothes", category: "New Arrivals", badge: "New" },
    { name: "About", category: "About" },
  ];

  const handleNavClick = (category: string) => {
    if (onSelectCategory) {
      onSelectCategory(category);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E7E2D8]/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
        
        {/* LOGO (Left) */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full bg-[#F5B853] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
            {/* Custom SVG Icon matching reference arch/sun icon */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1C1917"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 4a8 8 0 0 0-8 8v4h16v-4a8 8 0 0 0-8-8z" />
              <circle cx="12" cy="13" r="2.5" fill="#1C1917" />
            </svg>
          </div>
          <span className="font-serif text-xl md:text-2xl font-bold tracking-tight text-[#1C1917]">
            Shoping
          </span>
        </Link>

        {/* CENTER NAV LINKS (Desktop) */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = activeCategory === link.category;
            return (
              <div key={link.name} className="relative flex flex-col items-center group">
                {/* Optional Top Badge for "Clothes" matching image */}
                {link.badge && (
                  <span className="absolute -top-4 px-1.5 py-0.5 bg-[#F5B853] text-[#1C1917] text-[10px] font-bold rounded-full flex items-center gap-0.5 shadow-sm border border-[#1C1917]/10 animate-bounce">
                    {link.badge}
                    <Zap className="w-2.5 h-2.5 fill-[#1C1917]" />
                  </span>
                )}
                <button
                  onClick={() => handleNavClick(link.category)}
                  className={`text-sm font-medium transition-colors duration-200 py-1 ${
                    isActive
                      ? "text-[#1C1917] font-semibold"
                      : "text-[#57534E] hover:text-[#1C1917]"
                  }`}
                >
                  {link.name}
                </button>
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-1 w-full h-[2px] bg-[#F5B853] rounded-full"
                  />
                )}
              </div>
            );
          })}
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center space-x-3 md:space-x-6">
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-1.5 text-sm font-medium text-[#1C1917] hover:opacity-80 transition-opacity"
            aria-label="Search items"
          >
            <span className="hidden sm:inline">Search</span>
            <Search className="w-4 h-4 text-[#1C1917]" />
          </button>

          {/* Account Trigger */}
          <button
            onClick={() => setIsAccountOpen(true)}
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-[#1C1917] hover:opacity-80 transition-opacity"
            aria-label="My Account"
          >
            <span>My account</span>
          </button>

          {/* Cart Counter Icon matching image (Circle with count) */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#F5B853] text-[#1C1917] font-bold text-[10px] md:text-xs shadow-sm hover:scale-105 transition-transform border border-[#1C1917]/10"
            aria-label="View Shopping Cart"
          >
            <span>{totalItemsCount}</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#1C1917]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#FAF7F2] border-b border-[#E7E2D8] rounded-t-2xl px-6 py-6 shadow-sm overflow-hidden"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.category)}
                  className="w-full flex items-center justify-between text-left text-lg font-medium text-[#1C1917] py-3 px-2 rounded-lg hover:bg-[#E7E2D8]/40 transition-colors"
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="px-2 py-0.5 bg-[#F5B853] text-[#1C1917] text-xs font-bold rounded-full flex items-center gap-1">
                      {link.badge} <Zap className="w-3 h-3 fill-[#1C1917]" />
                    </span>
                  )}
                </button>
              ))}

              <div className="h-px w-full bg-[#E7E2D8] my-3" />

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAccountOpen(true);
                }}
                className="w-full flex items-center gap-3 text-lg font-medium text-[#1C1917] py-3 px-2 rounded-lg hover:bg-[#E7E2D8]/40 transition-colors"
              >
                <User className="w-5 h-5" />
                <span>My Account</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
