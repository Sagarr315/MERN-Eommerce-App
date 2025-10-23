export interface WishlistItem {
  productId: {
    _id: string;
    title: string;
    price: number;
    images: string[];
    stock: number;
    description: string;
  };
  _id: string;
}

export interface Wishlist {
  _id: string;
  userId: string;
  products: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}