import cloudinary from "../config/cloudinary";
import mongoose from "mongoose";
import { Request, Response } from "express";
import Product from "../models/Product";
import Category from '../models/Category';

// Create new product (Admin only)
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { title, description, price, stock, category, featuredType, featuredUntil } = req.body;

    if (!title || !price || !stock || !category) {
      return res.status(400).json({ message: "Title, price, stock, and category are required." });
    }

    const imageUrls: string[] = [];

    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        const base64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
        const uploaded = await cloudinary.uploader.upload(base64, {
          folder: "ecommerce_products",
        });
        imageUrls.push(uploaded.secure_url);
      }
    } else if (req.file) {
    
      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      const uploaded = await cloudinary.uploader.upload(base64, { folder: "ecommerce_products" });
      imageUrls.push(uploaded.secure_url);
    }

    const product = await Product.create({
      title,
      description,
      price,
      stock,
      category,
      images: imageUrls,
      featuredType: featuredType || null,
      featuredUntil: featuredUntil ? new Date(featuredUntil) : null,
    });

    return res.status(201).json({ message: "Product created successfully", product });
  } catch (error: any) {
    console.error("Create product error:", error);
    return res.status(500).json({ message: "Server error while creating product" });
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

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, search, page = '1', limit = '10', sort, priceRange } = req.query;

    const query: any = {};

    // Filter by category - handle main categories and subcategories
    if (category) {
      let categoryDoc;
      
      // Check if category is ObjectId format (24 character hex string)
      if (mongoose.Types.ObjectId.isValid(category.toString())) {
        // If it's an ID, search by ID
        categoryDoc = await Category.findById(category);
      } else {
        // If it's a name, search by name
        categoryDoc = await Category.findOne({ 
          name: { $regex: new RegExp(`^${category}$`, 'i') } 
        });
      }
      
      if (categoryDoc) {
        // Check if this category has subcategories (is a parent category)
        const subcategories = await Category.find({ parentCategory: categoryDoc._id });
        
        if (subcategories.length > 0) {
          // If main category has subcategories, search products in ALL subcategories
          const categoryIds = [categoryDoc._id, ...subcategories.map(sub => sub._id)];
          query.category = { $in: categoryIds };
        } else {
          // If no subcategories, search ONLY in this specific category
          query.category = categoryDoc._id;
        }
      } else {
        // If category not found, return empty results
        return res.json({
          total: 0,
          page: parseInt(page.toString(), 10),
          pageSize: parseInt(limit.toString(), 10),
          products: [],
        });
      }
    }

    // IMPROVED SEARCH: Search by BOTH title AND category names
    if (search) {
      const searchRegex = { $regex: search.toString(), $options: 'i' };
      
      // Find categories that match the search term
      const matchingCategories = await Category.find({
        name: searchRegex
      });
      
      if (matchingCategories.length > 0) {
        const categoryIds = matchingCategories.map(cat => cat._id);
        
        if (query.category) {
          query.$and = [
            { category: query.category },
            {
              $or: [
                { title: searchRegex },
                { category: { $in: categoryIds } }
              ]
            }
          ];
          delete query.category;
        } else {
          query.$or = [
            { title: searchRegex },
            { category: { $in: categoryIds } }
          ];
        }
      } else {
        if (query.category) {
          query.title = searchRegex;
        } else {
          query.title = searchRegex;
        }
      }
    }

    // Price range filtering
    if (priceRange) {
      const range = priceRange.toString();
      const [min, max] = range.split('-').map(Number);
      query.price = { $gte: min, $lte: max };
    }

    // Sorting logic
    let sortQuery: any = {};
    switch (sort) {
      case 'price_low':
        sortQuery = { price: 1 };
        break;
      case 'price_high':
        sortQuery = { price: -1 };
        break;
      case 'name_desc':
        sortQuery = { title: -1 };
        break;
      case 'newest':
        sortQuery = { createdAt: -1 };
        break;
      default:
        sortQuery = { title: 1 };
    }

    // Pagination
    const pageNumber = parseInt(page.toString(), 10);
    const pageSize = parseInt(limit.toString(), 10);
    const skip = (pageNumber - 1) * pageSize;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category')
      .sort(sortQuery)
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

// 🆕 ADD THIS NEW FUNCTION - Get Featured Products for Homepage
export const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    const { type, limit = '12' } = req.query;

    const query: any = { 
      isActive: true,
      featuredType: { $ne: null } // Only products with featuredType
    };
    
    // Filter by specific featured type if provided
    if (type && type !== 'all') {
      query.featuredType = type;
    }
    
    // Check if featuredUntil is still valid (if set)
    query.$or = [
      { featuredUntil: null },
      { featuredUntil: { $gte: new Date() } }
    ];

    const productsLimit = parseInt(limit.toString(), 10);
    const products = await Product.find(query)
      .populate('category')
      .limit(productsLimit)
      .sort({ createdAt: -1 });
      
    res.json(products);
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

// Delete product (Admin only)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};