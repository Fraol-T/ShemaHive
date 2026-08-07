"use client";

import React, { useState } from "react";
import { Home, Search, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface BottomNavProps {
  onHomeClick?: () => void;
}

export default function BottomNav({ onHomeClick }: BottomNavProps) {
  const { totalItemsCount, setIsSearchOpen, setIsCartOpen, setIsAccountOpen } = useCart();
  const [activeTab, setActiveTab] = useState("home");

  const handleHomeClick = () => {
    setActiveTab("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (onHomeClick) onHomeClick();
  };

  const handleSearchClick = () => {
    setActiveTab("search");
    setIsSearchOpen(true);
  };

  const handleCartClick = () => {
    setActiveTab("cart");
    setIsCartOpen(true);
  };

  const handleAccountClick = () => {
    setActiveTab("account");
    setIsAccountOpen(true);
  };

  const tabs = [
    { id: "home", label: "Home", icon: Home, onClick: handleHomeClick },
    { id: "search", label: "Search", icon: Search, onClick: handleSearchClick },
    { id: "cart", label: "Cart", icon: ShoppingBag, onClick: handleCartClick },
    { id: "account", label: "Account", icon: User, onClick: handleAccountClick },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#FAF7F2]/90 backdrop-blur-md border-t border-[#E7E2D8] shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex justify-around items-center h-16 px-2 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={tab.onClick}
              aria-label={tab.label}
              className="flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all duration-200 active:scale-95"
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-colors duration-200 ${
                    isActive ? "text-[#1C1917]" : "text-[#78716C]"
                  }`}
                />
                {/* Cart badge */}
                {tab.id === "cart" && totalItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#F5B853] text-[#1C1917] text-[9px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center px-1 border border-[#FAF7F2]">
                    {totalItemsCount > 99 ? "99+" : totalItemsCount}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-medium transition-colors duration-200 ${
                  isActive ? "text-[#1C1917]" : "text-[#78716C]"
                }`}
              >
                {tab.label}
              </span>
              {/* Active indicator dot */}
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-[#F5B853] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
