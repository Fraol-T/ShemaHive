/**
 * Single source of truth for brand identity and outbound links.
 *
 * Two distinct sets of social links, deliberately not interchangeable:
 *  - ORDER_CONTACT  → a person. Where a shopper goes to buy a specific piece.
 *  - FOLLOW_LINKS   → the brand channels. Where a visitor goes to keep up.
 */

export const BRAND = {
  name: "Shema Hive",
  wordmark: "SHEMAHIVE",
  tagline: "For the bold and proud",
  description:
    "Handwoven Ethiopian ruanas, scarves and outerwear. Every piece woven on a traditional loom.",
} as const;

/**
 * The palette lives in globals.css as @theme tokens and components must use
 * those. This is the one exception: browser metadata (theme-color, manifest)
 * cannot read a CSS variable, so navy is repeated here. Keep it in sync with
 * --color-navy.
 */
export const BRAND_COLORS = {
  navy: "#1F2A44",
} as const;

/** Where "order this piece" buttons go. */
export const ORDER_CONTACT = {
  telegram: "https://t.me/HawiHailuY",
  instagram: "https://www.instagram.com/hawi_hailu_y/",
} as const;

/** Where "follow the brand" links go. */
export const FOLLOW_LINKS = {
  telegram: "https://t.me/Shemahive",
  instagram: "https://www.instagram.com/shemahive/",
} as const;

/**
 * Neither Telegram direct chats nor Instagram DMs accept a prefilled message,
 * so the buttons can only open the account. Shoppers quote the product code
 * instead — which is why every product carries one.
 */
export const ORDER_INSTRUCTIONS =
  "Quote the product code when you message us and we'll know exactly which piece you mean.";

/**
 * Product names and descriptions are still placeholder copy pending the real
 * text from the client. While this is true the UI marks that content visibly,
 * per the brief's rule that placeholders must never read as final.
 * Flip to false once real copy lands.
 */
export const PLACEHOLDER_COPY = true;
