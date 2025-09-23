import { Request, Response } from "express";
import Wishlist from "../models/wishlist";

// Add product to wishlist
export const addToWishlist = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id; // comes from protect middleware

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, products: [{ productId }] });
    } else {
      const exists = wishlist.products.find(p => p.productId.toString() === productId);
      if (exists) {
        return res.status(400).json({ message: "Product already in wishlist" });
      }
      wishlist.products.push({ productId });
    }

    await wishlist.save();
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//Get wishlist by userId
export const getWishlist = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id; // token identifies user
    const wishlist = await Wishlist.findOne({ userId }).populate("products.productId");

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.products = wishlist.products.filter(
      p => p.productId.toString() !== productId
    );

    await wishlist.save();
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
