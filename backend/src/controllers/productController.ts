import { Request, Response } from "express";
import Product from "../models/Product";

//   Create new product (Admin only)
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { title, description, price, images, stock, category } = req.body;

    const product = await Product.create({
      title,
      description,
      price,
      images,
      stock,
      category,
    });

    res.status(201).json({ message: "Product created", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get single product
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update product (Admin only)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product updated", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//  Delete product (Admin only)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
