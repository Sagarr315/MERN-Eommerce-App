import { Request, Response } from "express";
import Cart, { ICart } from "../models/cart"; 
import Product from "../models/Product";

// Add product to cart
export const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId) {
      res.status(400).json({ message: "userId and productId required" });
      return;
    }

    const productExists = await Product.findById(productId);
    if (!productExists) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    let cart: ICart | null = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        products: [{ productId, quantity }],
      });
    } else {
      const itemIndex = cart.products.findIndex(
        (p) => p.productId.toString() === productId
      );

      if (itemIndex > -1) {
        
        const item = cart.products[itemIndex];
        if (item) {
          item.quantity = item.quantity + quantity;
        }
      } else {
        cart.products.push({ productId, quantity });
      }

      await cart.save();
    }

    res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get user cart
export const getCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId }).populate("products.productId");
    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update product quantity in cart
export const updateCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, productId, quantity } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    const itemIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId
    );

    if (itemIndex === -1) {
      res.status(404).json({ message: "Product not in cart" });
      return;
    }


    const item = cart.products[itemIndex];
    if (item) {
      item.quantity = quantity;
    }

    await cart.save();

    res.json({ message: "Cart updated", cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Remove product from cart
export const removeFromCart = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    cart.products = cart.products.filter(
      (p) => p.productId.toString() !== productId
    );

    await cart.save();

    res.json({ message: "Product removed from cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
