export type Category = "All" | "Woman" | "Man" | "New Arrivals" | "Flash Sale";

export interface Product {
  id: string;
  name: string;
  category: "Woman" | "Man";
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  badge?: string;
  description: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  isNewArrival?: boolean;
  isFlashSale?: boolean;
  discountPercentage?: number;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}
