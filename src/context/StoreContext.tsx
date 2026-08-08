"use client";

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Product } from "@/types/product";

/**
 * UI state for the storefront.
 *
 * This is a showcase catalog, not a shop — there is no cart, no checkout and
 * no accounts. Ordering happens over Telegram/Instagram (see @/data/brand),
 * so all this holds is which overlay is open and the transient toast.
 */
interface StoreContextType {
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastMessage(msg);
    toastTimer.current = setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const value = useMemo(
    () => ({
      quickViewProduct,
      setQuickViewProduct,
      isSearchOpen,
      setIsSearchOpen,
      toastMessage,
      showToast,
    }),
    [quickViewProduct, isSearchOpen, toastMessage, showToast]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
