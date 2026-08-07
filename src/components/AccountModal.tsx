"use client";

import React, { useState } from "react";
import { X, User, Lock, Mail, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

export default function AccountModal() {
  const { isAccountOpen, setIsAccountOpen, showToast } = useCart();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isAccountOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(isRegister ? "Account created successfully!" : "Logged in successfully!");
    setIsAccountOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-[#FAF7F2] rounded-xs shadow-2xl p-6 sm:p-8 border border-[#1C1917]"
        >
          <button
            onClick={() => setIsAccountOpen(false)}
            className="absolute top-4 right-4 p-2 text-[#78716C] hover:text-[#1C1917]"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-[#F5B853] flex items-center justify-center mx-auto mb-3 text-[#1C1917] shadow-sm">
              <User className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#1C1917]">
              {isRegister ? "Create Your Account" : "Welcome Back"}
            </h3>
            <p className="text-xs text-[#78716C] mt-1">
              {isRegister
                ? "Join Shoping for exclusive flash sales & order tracking"
                : "Sign in to access saved items & checkout"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1C1917] mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#78716C] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-[#E7E2D8] bg-white rounded-xs focus:outline-none focus:border-[#1C1917]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1917] mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#78716C] absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-[#E7E2D8] bg-white rounded-xs focus:outline-none focus:border-[#1C1917]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#F5B853] hover:bg-[#E5A742] text-[#1C1917] font-bold text-xs uppercase tracking-wider rounded-xs border-2 border-[#1C1917] shadow-[2px_2px_0px_#1C1917] transition-all flex items-center justify-center gap-2"
            >
              <span>{isRegister ? "Create Account" : "Sign In"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-[#78716C] pt-4 border-t border-[#E7E2D8]">
            {isRegister ? (
              <p>
                Already have an account?{" "}
                <button
                  onClick={() => setIsRegister(false)}
                  className="font-bold text-[#1C1917] underline hover:text-[#F5B853]"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => setIsRegister(true)}
                  className="font-bold text-[#1C1917] underline hover:text-[#F5B853]"
                >
                  Create one now
                </button>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
