export interface Product {
  _id: string;
  name: string;
  title: string;
  description: string;
  category: "saree" | "kids" | "accessories";
  price: number;
  images: string[];
  stock: number;
  featuredType?: 'latest' | 'new_arrival' | 'trending' | 'sale' | 'seasonal' | null;
  isInWishlist?: boolean;
}
