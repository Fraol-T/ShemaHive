"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotalPrice,
    clearCart,
  } = useCart();

  const [promoCode, setPromoCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 200;
  const progressPercent = Math.min(100, (subtotalPrice / FREE_SHIPPING_THRESHOLD) * 100);
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotalPrice);

  const applyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "FLASH50") {
      setDiscountAmount(subtotalPrice * 0.5);
      setPromoApplied(true);
      setPromoError("");
    } else if (promoCode.trim().toUpperCase() === "SHOPPING10") {
      setDiscountAmount(subtotalPrice * 0.1);
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoError("Invalid code. Try 'FLASH50' for 50% off!");
    }
  };

  const finalTotal = Math.max(0, subtotalPrice - discountAmount);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutComplete(true);
    setTimeout(() => {
      clearCart();
      setIsCheckingOut(false);
      setCheckoutComplete(false);
      setIsCartOpen(false);
    }, 3500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* BACKDROP */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-screen max-w-full sm:max-w-md bg-[#FAF7F2] shadow-2xl flex flex-col justify-between border-l border-[#1C1917]/10 rounded-t-2xl sm:rounded-none overflow-hidden"
          >
            <div className="w-10 h-1 rounded-full bg-[#D6D3D1] mx-auto mt-3 mb-2 sm:hidden" />
            {/* DRAWER HEADER */}
            <div className="p-6 bg-white border-b border-[#E7E2D8] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#1C1917]" />
                <h2 className="font-serif text-xl font-bold text-[#1C1917]">Your Cart</h2>
                <span className="px-2 py-0.5 bg-[#F5B853] text-[#1C1917] text-xs font-bold rounded-full">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-[#78716C] hover:text-[#1C1917] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* FREE SHIPPING PROGRESS BAR */}
            <div className="bg-[#FAF7F2] px-6 py-3 border-b border-[#E7E2D8]">
              <div className="flex justify-between text-xs font-semibold text-[#1C1917] mb-1">
                <span>
                  {amountNeededForFreeShipping === 0 ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> You unlocked Free Express Shipping!
                    </span>
                  ) : (
                    `Add $${amountNeededForFreeShipping.toFixed(2)} more for FREE Express Shipping`
                  )}
                </span>
              </div>
              <div className="w-full bg-[#E7E2D8] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#F5B853] h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* CART ITEMS LIST */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                  <div className="w-16 h-16 rounded-full bg-[#E7E2D8]/50 flex items-center justify-center text-[#78716C]">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#1C1917]">Your cart is empty</h3>
                    <p className="text-xs text-[#78716C] mt-1 max-w-xs">
                      Explore our high-end fashion collection and add items to your cart.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-6 py-2.5 bg-[#F5B853] text-[#1C1917] font-bold text-xs rounded-xs border border-[#1C1917]/20 shadow-sm"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${idx}`}
                    className="flex gap-4 p-3 bg-white rounded-xs border border-[#E7E2D8] shadow-xs relative group"
                  >
                    {/* ITEM THUMBNAIL */}
                    <div className="relative w-20 h-24 rounded-xs overflow-hidden bg-[#FAF7F2] shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover object-center"
                      />
                    </div>

                    {/* ITEM INFO */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-serif text-sm font-bold text-[#1C1917] line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() =>
                              removeFromCart(item.product.id, item.selectedSize, item.selectedColor)
                            }
                            className="text-[#A8A29E] hover:text-red-600 transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-[11px] text-[#78716C] mt-0.5 space-x-2">
                          <span>Size: <strong className="text-[#1C1917]">{item.selectedSize}</strong></span>
                          <span>Color: <strong className="text-[#1C1917]">{item.selectedColor}</strong></span>
                        </div>
                      </div>

                      {/* PRICE & QUANTITY CONTROLS */}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-bold text-[#1C1917]">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        <div className="flex items-center border border-[#E7E2D8] rounded-xs bg-[#FAF7F2]">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.selectedSize, item.selectedColor, -1)
                            }
                            className="p-1 hover:bg-[#E7E2D8] text-[#1C1917]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-[#1C1917]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.selectedSize, item.selectedColor, 1)
                            }
                            className="p-1 hover:bg-[#E7E2D8] text-[#1C1917]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* DRAWER FOOTER (CHECKOUT & SUMMARY) */}
            {cart.length > 0 && (
              <div className="p-6 bg-white border-t border-[#E7E2D8] space-y-4">
                {/* PROMO CODE FORM */}
                <form onSubmit={applyPromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo code (Try FLASH50)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-[#E7E2D8] text-xs rounded-xs focus:outline-none focus:border-[#1C1917]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#1C1917] text-white text-xs font-bold rounded-xs hover:bg-[#333]"
                  >
                    Apply
                  </button>
                </form>

                {promoApplied && (
                  <div className="text-xs text-emerald-700 font-semibold flex justify-between">
                    <span>Discount applied!</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {promoError && (
                  <p className="text-[11px] text-red-600 font-medium">{promoError}</p>
                )}

                {/* SUBTOTAL & TOTAL */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#78716C]">
                    <span>Subtotal</span>
                    <span>${subtotalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#78716C]">
                    <span>Shipping</span>
                    <span>{amountNeededForFreeShipping === 0 ? "FREE" : "$15.00"}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-[#1C1917] pt-2 border-t border-[#E7E2D8]">
                    <span>Total</span>
                    <span>${(finalTotal + (amountNeededForFreeShipping === 0 ? 0 : 15)).toFixed(2)}</span>
                  </div>
                </div>

                {/* CHECKOUT BUTTON */}
                <button
                  onClick={() => setIsCheckingOut(true)}
                  className="w-full py-3.5 bg-[#F5B853] hover:bg-[#E5A742] text-[#1C1917] font-bold text-sm tracking-wide rounded-xs border-2 border-[#1C1917] shadow-[3px_3px_0px_#1C1917] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </div>

        {/* MOCK CHECKOUT MODAL OVERLAY */}
        <AnimatePresence>
          {isCheckingOut && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#FAF7F2] p-6 sm:p-8 rounded-xs max-w-md w-full border border-[#1C1917] shadow-2xl relative"
              >
                {!checkoutComplete ? (
                  <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-[#E7E2D8]">
                      <h3 className="font-serif text-2xl font-bold text-[#1C1917]">
                        Fast Checkout
                      </h3>
                      <button
                        type="button"
                        onClick={() => setIsCheckingOut(false)}
                        className="text-[#78716C]"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="text-xs text-[#78716C]">
                      Order Summary: <strong className="text-[#1C1917]">${finalTotal.toFixed(2)}</strong> ({cart.length} items)
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-[#1C1917] mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          defaultValue="Fraol N."
                          className="w-full px-3 py-2 text-xs border border-[#E7E2D8] bg-white rounded-xs focus:outline-none focus:border-[#1C1917]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1C1917] mb-1">Shipping Address</label>
                        <input
                          type="text"
                          required
                          defaultValue="123 Luxury Fashion Ave, NY"
                          className="w-full px-3 py-2 text-xs border border-[#E7E2D8] bg-white rounded-xs focus:outline-none focus:border-[#1C1917]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1C1917] mb-1">Payment Method</label>
                        <div className="p-3 border border-[#1C1917] bg-white rounded-xs flex items-center justify-between text-xs font-semibold">
                          <span className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            Stripe Test Mode (Card ends **** 4242)
                          </span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 font-bold rounded-sm">Test</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-4 py-3 bg-[#F5B853] hover:bg-[#E5A742] text-[#1C1917] font-bold text-xs uppercase tracking-wider rounded-xs border-2 border-[#1C1917] shadow-[2px_2px_0px_#1C1917]"
                    >
                      Place Test Order (${finalTotal.toFixed(2)})
                    </button>
                  </form>
                ) : (
                  <div className="py-8 text-center space-y-4">
                    <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto animate-bounce" />
                    <h3 className="font-serif text-2xl font-bold text-[#1C1917]">
                      Order Confirmed!
                    </h3>
                    <p className="text-xs text-[#57534E]">
                      Thank you for shopping with <strong>Shoping</strong>. Order reference #SH-{Math.floor(100000 + Math.random() * 900000)}.
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
}
