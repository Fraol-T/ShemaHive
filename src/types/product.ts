export const CATEGORIES = [
  "Ruanas",
  "Scarves",
  "Coats & Dusters",
  "Shawls & Vests",
] as const;

export type ProductCategory = (typeof CATEGORIES)[number];
export type Category = "All" | ProductCategory | "New Arrivals";

/**
 * A single colorway of a product.
 *
 * `frames360` points at a directory of 36 evenly-spaced WebP frames
 * (`000.webp` … `035.webp`). Only some colorways have one — the viewer falls
 * back to `image` whenever it is absent.
 */
export interface Colorway {
  name: string;
  hex: string;
  image: string;
  frames360?: string;
}

export interface Product {
  id: string;
  /** Short reference shoppers quote when ordering over Telegram/Instagram. */
  code: string;
  name: string;
  category: ProductCategory;
  description: string;
  /** Primary catalog image. Mirrors colorways[0].image when colorways exist. */
  image: string;
  badge?: string;
  colorways?: Colorway[];
  isNewArrival?: boolean;
}

/** True when a product has at least one colorway with a 360 sequence. */
export function has360(product: Product): boolean {
  return Boolean(product.colorways?.some((c) => c.frames360));
}
