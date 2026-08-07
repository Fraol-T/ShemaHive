"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Send, ArrowUpRight, Globe, Share2, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Footer() {
  const { showToast } = useCart();
  const [email, setEmail] = useState("");
  const [openSection, setOpenSection] = useState<string | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      showToast("Thank you for subscribing to our VIP Newsletter!");
      setEmail("");
    }
  };

  return (
    <footer className="w-full bg-[#1C1917] text-[#FAF7F2] pt-16 pb-12 px-4 sm:px-6 lg:px-12 border-t border-[#333]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-12 border-b border-[#333]">
        
        {/* BRAND COLUMN */}
        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#F5B853] flex items-center justify-center">
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
            <span className="font-serif text-2xl font-bold tracking-tight text-white">
              Shoping
            </span>
          </div>

          <p className="text-xs text-[#A8A29E] leading-relaxed max-w-sm">
            High-end curated online clothing store. Modern tailoring, luxury fabrics, and timeless silhouettes crafted just for you.
          </p>

          {/* SOCIAL ICONS */}
          <div className="flex items-center justify-center sm:justify-start space-x-3 pt-2">
            {[
              { name: "Instagram", icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
              { name: "Twitter", icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
              { name: "Facebook", icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" }
            ].map((social) => (
              <a
                key={social.name}
                href="#"
                className="w-8 h-8 rounded-full border border-[#444] flex items-center justify-center text-[#A8A29E] hover:text-[#F5B853] hover:border-[#F5B853] transition-colors"
                aria-label={social.name}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d={social.icon} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* SHOP LINKS */}
        <div className="md:col-span-2 flex flex-col">
          <button 
            onClick={() => setOpenSection(openSection === 'collections' ? null : 'collections')}
            className="w-full flex items-center justify-between md:cursor-default pb-2 md:pb-3"
          >
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              Collections
            </h4>
            <ChevronDown className={`w-4 h-4 md:hidden transition-transform duration-300 ${openSection === 'collections' ? 'rotate-180' : ''}`} />
          </button>
          <div className={`overflow-hidden transition-all duration-300 ${openSection === 'collections' ? 'max-h-48' : 'max-h-0'} md:max-h-none`}>
            <ul className="space-y-2 text-xs text-[#A8A29E] md:mt-0">
              <li><a href="#catalog-section" className="hover:text-white transition-colors">Women's Wear</a></li>
              <li><a href="#catalog-section" className="hover:text-white transition-colors">Men's Apparel</a></li>
              <li><a href="#catalog-section" className="hover:text-white transition-colors">New Arrivals</a></li>
              <li><a href="#catalog-section" className="hover:text-white transition-colors">Flash Sale 50%</a></li>
              <li><a href="#catalog-section" className="hover:text-white transition-colors">Accessories</a></li>
            </ul>
          </div>
        </div>

        {/* CUSTOMER CARE */}
        <div className="md:col-span-2 flex flex-col">
          <button 
            onClick={() => setOpenSection(openSection === 'care' ? null : 'care')}
            className="w-full flex items-center justify-between md:cursor-default pb-2 md:pb-3"
          >
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              Customer Care
            </h4>
            <ChevronDown className={`w-4 h-4 md:hidden transition-transform duration-300 ${openSection === 'care' ? 'rotate-180' : ''}`} />
          </button>
          <div className={`overflow-hidden transition-all duration-300 ${openSection === 'care' ? 'max-h-48' : 'max-h-0'} md:max-h-none`}>
            <ul className="space-y-2 text-xs text-[#A8A29E] md:mt-0">
              <li><a href="#" className="hover:text-white transition-colors">Order Tracking</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns & Exchange</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ & Contact</a></li>
            </ul>
          </div>
        </div>

        {/* NEWSLETTER SUBSCRIBE */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
            Stay in the Loop
          </h4>
          <p className="text-xs text-[#A8A29E]">
            Subscribe to receive private preview access to flash sales, new drops, and 10% off your first order.
          </p>

          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-3 py-2 bg-[#2A2725] border border-[#444] text-xs text-white placeholder:text-[#78716C] rounded-xs focus:outline-none focus:border-[#F5B853]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#F5B853] text-[#1C1917] font-bold text-xs rounded-xs hover:bg-[#E5A742] transition-colors flex items-center gap-1"
            >
              <span>Join</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>

      {/* BOTTOM COPYRIGHT */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#78716C] gap-4">
        <p>© {new Date().getFullYear()} Shoping Inc. All rights reserved.</p>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-[#A8A29E]">Privacy Policy</a>
          <a href="#" className="hover:text-[#A8A29E]">Terms of Service</a>
          <a href="#" className="hover:text-[#A8A29E]">Cookie Preferences</a>
        </div>
      </div>
    </footer>
  );
}
