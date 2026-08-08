import { Product } from "@/types/product";

/**
 * Catalog built from the client's own photography in /public/products.
 *
 * NAMES AND DESCRIPTIONS ARE PLACEHOLDER COPY pending real text from the
 * client — see PLACEHOLDER_COPY in @/data/brand, which drives the visible
 * "draft copy" marking in the UI. Photography, colorways and codes are real.
 *
 * Product codes come from the source photo filenames so they trace back to
 * the client's own numbering.
 */
export const PRODUCTS: Product[] = [
  {
    id: "ruana-signature",
    code: "SH-232",
    name: "Signature Handwoven Ruana",
    category: "Ruanas",
    description:
      "Open-front ruana woven on a traditional loom, finished with a hand-knotted fringe. The banded motif runs the full width of the body.",
    image: "/products/232_0.jpg",
    badge: "HANDWOVEN",
    isNewArrival: true,
    // Three of the four colourways have a 360 sequence; Mustard does not, so
    // it exercises the standard-gallery fallback with real content.
    colorways: [
      {
        name: "Charcoal",
        hex: "#2B2B2E",
        image: "/products/232_0.jpg",
        frames360: "/products/360/ruana-charcoal",
      },
      {
        name: "Olive",
        hex: "#5A6141",
        image: "/products/233_1.jpg",
        frames360: "/products/360/ruana-olive",
      },
      {
        name: "Rust",
        hex: "#B4551F",
        image: "/products/221_0.jpg",
        frames360: "/products/360/ruana-rust",
      },
      { name: "Mustard", hex: "#C7A33A", image: "/products/222_1.jpg" },
    ],
  },
  {
    id: "scarf-diamond",
    code: "SH-122",
    name: "Diamond Motif Scarf",
    category: "Scarves",
    description:
      "Long handwoven scarf with a repeating diamond motif, light enough to layer year round.",
    image: "/products/122_0.jpg",
    isNewArrival: true,
  },
  {
    id: "scarf-olive",
    code: "SH-130",
    name: "Olive Patterned Scarf",
    category: "Scarves",
    description:
      "Deep olive scarf with a tonal woven pattern and softly fringed ends.",
    image: "/products/130_0.jpg",
  },
  {
    id: "scarf-heritage",
    code: "SH-133",
    name: "Heritage Stripe Scarf",
    category: "Scarves",
    description:
      "Bold multicolour stripe drawn from traditional Ethiopian weaving, in a generous wrap length.",
    image: "/products/133_0.jpg",
    badge: "BESTSELLER",
  },
  {
    id: "scarf-banded",
    code: "SH-167",
    name: "Banded Wool Scarf",
    category: "Scarves",
    description:
      "Chunky handwoven scarf in a warm banded colourway, made for cold mornings.",
    image: "/products/167_1.jpg",
  },
  {
    id: "wrap-striped",
    code: "SH-149",
    name: "Striped Wrap Shawl",
    category: "Shawls & Vests",
    description:
      "Lightweight striped shawl that drapes easily over the shoulder or doubles as a scarf.",
    image: "/products/149_1.jpg",
  },
  {
    id: "shawl-olive",
    code: "SH-193",
    name: "Olive Diamond Shawl",
    category: "Shawls & Vests",
    description:
      "Olive shawl with a woven diamond band along the border and a fringed edge.",
    image: "/products/193_0.jpg",
    isNewArrival: true,
  },
  {
    id: "vest-mustard",
    code: "SH-237",
    name: "Mustard Patterned Vest",
    category: "Shawls & Vests",
    description:
      "Sleeveless handwoven vest with patch pockets and a fringed hem.",
    image: "/products/237_0.jpg",
    badge: "LIMITED",
  },
  {
    id: "coat-chevron",
    code: "SH-153",
    name: "Chevron Weave Duster",
    category: "Coats & Dusters",
    description:
      "Full-length duster in a cream chevron weave, cut loose with a relaxed sleeve.",
    image: "/products/153_0.jpg",
    badge: "NEW",
    isNewArrival: true,
  },
  {
    id: "coat-rust",
    code: "SH-214",
    name: "Rust Fringed Duster",
    category: "Coats & Dusters",
    description:
      "Floor-length rust duster with a fringed hem and an open, unstructured front.",
    image: "/products/214_0.jpg",
    isNewArrival: true,
  },
  {
    id: "jacket-sage",
    code: "SH-203",
    name: "Sage Patterned Jacket",
    category: "Coats & Dusters",
    description:
      "Cropped handwoven jacket in sage with an all-over geometric pattern and wide sleeves.",
    image: "/products/203_0.jpg",
  },
];
