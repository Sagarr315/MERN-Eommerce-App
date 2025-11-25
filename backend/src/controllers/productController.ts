import cloudinary from "../config/cloudinary";
import mongoose from "mongoose";
import { Request, Response } from "express";
import Product from "../models/Product";
import Category from "../models/Category";

// Create new product (Admin only)
export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      price,
      stock,
      category,
      featuredType,
      featuredUntil,
    } = req.body;

    if (!title || !price || !stock || !category) {
      return res
        .status(400)
        .json({ message: "Title, price, stock, and category are required." });
    }

    const imageUrls: string[] = [];

    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        const result = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "ecommerce_products",
              resource_type: "auto",
              timeout: 60000,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(file.buffer);
        });
        imageUrls.push(result.secure_url);
      }
    } else if (req.file) {
      const file = req.file;
      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "ecommerce_products",
            resource_type: "auto",
            timeout: 60000,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(file.buffer);
      });
      imageUrls.push(result.secure_url);
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

    return res
      .status(201)
      .json({ message: "Product created successfully", product });
  } catch (error: any) {
    console.error("Create product error:", error);
    return res
      .status(500)
      .json({ message: "Server error while creating product" });
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
    const {
      category,
      search,
      page = "1",
      limit = "10",
      sort,
      priceRange,
      featuredType,
    } = req.query;

    const query: any = {};

    const activeCategoryIds = await Category.find({ isActive: true }).distinct(
      "_id"
    );
    query.category = { $in: activeCategoryIds };

    if (featuredType) {
      query.featuredType = featuredType;
      query.$or = [
        { featuredUntil: null },
        { featuredUntil: { $gte: new Date() } },
      ];
    }

    if (category) {
      let categoryDoc;

      if (mongoose.Types.ObjectId.isValid(category.toString())) {
        categoryDoc = await Category.findById(category);
      } else {
        categoryDoc = await Category.findOne({
          name: { $regex: new RegExp(`^${category}$`, "i") },
        });
      }

      if (categoryDoc && categoryDoc.isActive) {
        const subcategories = await Category.find({
          parentCategory: categoryDoc._id,
          isActive: true,
        });

        if (subcategories.length > 0) {
          const categoryIds = [
            categoryDoc._id,
            ...subcategories.map((sub) => sub._id),
          ];
          query.category = { $in: categoryIds };
        } else {
          query.category = categoryDoc._id;
        }
      } else {
        return res.json({
          total: 0,
          page: parseInt(page.toString(), 10),
          pageSize: parseInt(limit.toString(), 10),
          products: [],
        });
      }
    }

    if (search) {
      const searchRegex = { $regex: search.toString(), $options: "i" };

      const matchingCategories = await Category.find({
        name: searchRegex,
        isActive: true,
      });

      if (matchingCategories.length > 0) {
        const categoryIds = matchingCategories.map((cat) => cat._id);

        if (query.category) {
          query.$and = [
            { category: query.category },
            {
              $or: [{ title: searchRegex }, { category: { $in: categoryIds } }],
            },
          ];
          delete query.category;
        } else {
          query.$or = [
            { title: searchRegex },
            { category: { $in: categoryIds } },
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

    if (priceRange) {
      const range = priceRange.toString();
      const [min, max] = range.split("-").map(Number);
      query.price = { $gte: min, $lte: max };
    }

    let sortQuery: any = {};
    switch (sort) {
      case "price_low":
        sortQuery = { price: 1 };
        break;
      case "price_high":
        sortQuery = { price: -1 };
        break;
      case "name_desc":
        sortQuery = { title: -1 };
        break;
      case "newest":
        sortQuery = { createdAt: -1 };
        break;
      default:
        sortQuery = { title: 1 };
    }

    const pageNumber = parseInt(page.toString(), 10);
    const pageSize = parseInt(limit.toString(), 10);
    const skip = (pageNumber - 1) * pageSize;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate("category")
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
    res.status(500).json({ message: "Server error", error });
  }
};

export const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    const { type, limit = "12" } = req.query;

    const activeCategoryIds = await Category.find({ isActive: true }).distinct(
      "_id"
    );

    const query: any = {
      isActive: true,
      featuredType: { $ne: null },
      category: { $in: activeCategoryIds },
    };

    if (type && type !== "all") {
      query.featuredType = type;
    }

    query.$or = [
      { featuredUntil: null },
      { featuredUntil: { $gte: new Date() } },
    ];

    const productsLimit = parseInt(limit.toString(), 10);
    const products = await Product.find(query)
      .populate("category")
      .limit(productsLimit)
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update product (Admin only)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);

    const {
      title,
      description,
      price,
      stock,
      category,
      featuredType,
      featuredUntil,
      isActive,
    } = req.body;

    if (!title || !price || !stock || !category) {
      return res
        .status(400)
        .json({ message: "Title, price, stock, and category are required." });
    }

    const updateData: any = {
      title,
      description,
      price: Number(price),
      stock: Number(stock),
      category,
      isActive: isActive === "true" || isActive === true,
      featuredType:
        featuredType && featuredType !== "null" ? featuredType : null,
      featuredUntil: featuredUntil ? new Date(featuredUntil) : null,
    };

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product updated successfully", product });
  } catch (error: any) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "Server error while updating product" });
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

export const updateProductImages = async (req: Request, res: Response) => {
  try {
    const imageUrls: string[] = [];

    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        const result = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "ecommerce_products",
              resource_type: "auto",
              timeout: 60000,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(file.buffer);
        });
        imageUrls.push(result.secure_url);
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: { images: imageUrls } },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Images updated successfully", product });
  } catch (error: any) {
    console.error("Update images error:", error);
    res.status(500).json({ message: "Server error while updating images" });
  }
};