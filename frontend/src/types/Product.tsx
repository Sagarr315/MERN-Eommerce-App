export interface Product {
  _id: string;
  name: string;
  title: string;
  description: string;
  category: "saree" | "kids" | "accessories";
  price: number;
  images: string[];
}
