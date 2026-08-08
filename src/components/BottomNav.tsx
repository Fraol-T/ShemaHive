"use client";

import React, { useState } from "react";
import { Home, Search, LayoutGrid } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { ORDER_CONTACT } from "@/data/brand";
import { TelegramIcon } from "./icons";

interface BottomNavProps {
  onHomeClick?: () => void;
  onBrowseClick?: () => void;
}

export default function BottomNav({ onHomeClick, onBrowseClick }: BottomNavProps) {
  const { setIsSearchOpen } = useStore();
  const [activeTab, setActiveTab] = useState("home");

  const tabs = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      onClick: () => {
        setActiveTab("home");
        window.scrollTo({ top: 0, behavior: "smooth" });
        onHomeClick?.();
      },
    },
    {
      id: "browse",
      label: "Browse",
      icon: LayoutGrid,
      onClick: () => {
        setActiveTab("browse");
        onBrowseClick?.();
      },
    },
    {
      id: "search",
      label: "Search",
      icon: Search,
      onClick: () => {
        setActiveTab("search");
        setIsSearchOpen(true);
      },
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-navy/95 backdrop-blur-md border-t border-line-on-navy"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label="Mobile navigation"
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
              aria-current={isActive ? "page" : undefined}
              className="flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all active:scale-95"
            >
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? "text-gold" : "text-on-navy-muted"
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? "text-on-navy" : "text-on-navy-muted"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* Ordering lives on Telegram, so it gets a permanent slot on mobile. */}
        <a
          href={ORDER_CONTACT.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center flex-1 h-full gap-0.5 active:scale-95 transition-all"
          aria-label="Order on Telegram"
        >
          <TelegramIcon className="w-5 h-5 text-gold" />
          <span className="text-[10px] font-medium text-on-navy">Order</span>
        </a>
      </div>
    </nav>
  );
}
