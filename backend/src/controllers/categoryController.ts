import { Request, Response } from "express";
import Category from "../models/Category";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, parentCategory } = req.body;
    const category = await Category.create({
      name,
      parentCategory: parentCategory || null,
    });
    res.status(201).json(category);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

//  GET ALL ACTIVE CATEGORIES (for customers)
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find({ isActive: true }); //  Only active
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

//  GET ALL CATEGORIES - INCLUDING INACTIVE (for admin)
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find(); //  All categories
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

//  ACTIVATE CATEGORY
export const activateCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category activated successfully", category });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

//  DEACTIVATE CATEGORY
export const deactivateCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deactivated successfully", category });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
