import cloudinary from "../config/cloudinary";
import { Request, Response } from "express";
import Product from "../models/Product";

// Create new product (Admin only)
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { title, description, price, stock, category } = req.body;

    // Validate required fields
    if (!title || !price || !stock) {
      return res.status(400).json({ message: "Title, price, stock required" });
    }

    let imageUrls: string[] = [];

    if (req.file) {
      try {
        const fileBase64 = `data:${
          req.file.mimetype
        };base64,${req.file.buffer.toString("base64")}`;
        const uploaded = await cloudinary.uploader.upload(fileBase64, {
          folder: "ecommerce_products",
        });
        imageUrls.push(uploaded.secure_url);
      } catch (err: any) {
        console.error("Cloudinary upload error:", err);
        return res
          .status(500)
          .json({ message: "Cloudinary upload failed", error: err.message });
      }
    }

    // Create product in database
    const product = await Product.create({
      title,
      description,
      price,
      stock,
      category,
      images: imageUrls, // array of image URLs
    });

    res.status(201).json({ message: "Product created", product });
  } catch (error: any) {
    console.error("Create product error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
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

// Get products with optional category, search, and pagination
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, search, page = '1', limit = '10' } = req.query;

    const query: any = {};

    // Filter by category if provided
    if (category) {
      query.category = category.toString();
    }

    // Search by name (case-insensitive)
    if (search) {
      query.name = { $regex: search.toString(), $options: 'i' };
    }

    // Pagination
    const pageNumber = parseInt(page.toString(), 10);
    const pageSize = parseInt(limit.toString(), 10);
    const skip = (pageNumber - 1) * pageSize;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .skip(skip)
      .limit(pageSize);

    res.json({
      total,
      page: pageNumber,
      pageSize,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
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
