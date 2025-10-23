export interface CartItem {
  productId: {
    _id: string;
    title: string;
    price: number;
    images: string[];
    stock: number;
  };
  quantity: number;
  _id: string;
}

export interface Cart {
  _id: string;
  userId: string;
  products: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  message: string;
  cart: Cart;
}