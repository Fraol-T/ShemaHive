"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/context/StoreContext";
import OrderButtons from "./OrderButtons";
import { PlaceholderChip } from "./PlaceholderNotice";

export default function ProductQuickViewModal() {
  const { quickViewProduct, setQuickViewProduct } = useStore();

  // The selection is stored against the product it belongs to, so opening a
  // different product derives back to the first swatch without an effect.
  const [selected, setSelected] = useState<{ id: string; index: number }>({
    id: "",
    index: 0,
  });
  const colorwayIndex =
    quickViewProduct && selected.id === quickViewProduct.id ? selected.index : 0;

  // Escape closes, and the page behind must not scroll while the modal is up.
  useEffect(() => {
    if (!quickViewProduct) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setQuickViewProduct(null);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [quickViewProduct, setQuickViewProduct]);

  const colorways = quickViewProduct?.colorways ?? [];
  const activeColorway = colorways[colorwayIndex];
  const displayImage = activeColorway?.image ?? quickViewProduct?.image;

  return (
    <AnimatePresence>
      {quickViewProduct && (
        /*
          This must be a keyed motion element: AnimatePresence only tracks
          direct motion children, and with a plain <div> here the exit never
          completes and the dialog stays in the DOM forever.
        */
        <motion.div
          key="quickview"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label={quickViewProduct.name}
        >
          <div
            onClick={() => setQuickViewProduct(null)}
            className="fixed inset-0 bg-navy/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 40 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-4xl bg-surface-raised rounded-t-2xl sm:rounded-sm shadow-2xl overflow-y-auto max-h-[92vh] border border-line z-10 mt-8 sm:my-8"
          >
            <div className="w-10 h-1 rounded-full bg-line mx-auto mt-2 sm:hidden" />

            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-surface-raised/90 text-ink hover:bg-surface-sunken transition-all shadow-md"
              aria-label="Close quick view"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/*
                MEDIA COLUMN — the 360 viewer replaces this <Image> for
                colorways that carry a frame sequence (Part B, phase 6).
              */}
              <div className="relative h-72 sm:h-96 md:h-full md:min-h-[520px] bg-surface-sunken">
                {displayImage && (
                  <Image
                    src={displayImage}
                    alt={
                      activeColorway
                        ? `${quickViewProduct.name} in ${activeColorway.name}`
                        : quickViewProduct.name
                    }
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center"
                  />
                )}
                {quickViewProduct.badge && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-gold text-navy font-bold text-xs uppercase tracking-wider rounded-xs shadow-md border border-navy/20">
                    {quickViewProduct.badge}
                  </span>
                )}
              </div>

              {/* DETAILS */}
              <div className="p-6 sm:p-8 flex flex-col gap-5">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-ink-muted">
                      {quickViewProduct.category}
                    </span>
                    <PlaceholderChip />
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
                    {quickViewProduct.name}
                  </h2>

                  <p className="text-sm text-ink-muted leading-relaxed mt-3">
                    {quickViewProduct.description}
                  </p>
                </div>

                {colorways.length > 0 && (
                  <div>
                    <span className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">
                      Colour:{" "}
                      <span className="font-normal text-ink-muted">
                        {activeColorway?.name}
                      </span>
                    </span>
                    <div className="flex items-center gap-2.5">
                      {colorways.map((c, i) => {
                        const isSelected = i === colorwayIndex;
                        return (
                          <button
                            key={c.name}
                            onClick={() =>
                              setSelected({ id: quickViewProduct.id, index: i })
                            }
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-transform ${
                              isSelected
                                ? "border-navy scale-110 shadow-md"
                                : "border-line hover:border-ink-muted"
                            }`}
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                            aria-label={c.name}
                            aria-pressed={isSelected}
                          >
                            {isSelected && (
                              <Check className="w-4 h-4 text-white drop-shadow" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="mt-auto pt-5 border-t border-line">
                  <OrderButtons
                    code={quickViewProduct.code}
                    productName={quickViewProduct.name}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
