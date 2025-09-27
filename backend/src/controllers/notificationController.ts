import { Request, Response } from "express";
import Notification from "../models/notification";

export const getNotifications = async (_req: Request, res: Response) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );
    res.json(notification);
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
