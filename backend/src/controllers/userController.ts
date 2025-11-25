import { Request, Response } from 'express';
import User from '../models/User';

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById((req as any).user.id).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
};

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phone } = req.body;
    
    const user = await User.findByIdAndUpdate(
      (req as any).user.id,
      { name, phone },
      { new: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({ 
      message: 'Profile updated successfully', 
      user 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating profile' });
  }
};

export const addAddress = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById((req as any).user.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (req.body.isDefault) {
      user.addresses.forEach(addr => { addr.isDefault = false; });
    }
    user.addresses.push(req.body);
    await user.save();
    res.status(201).json({ message: 'Address added successfully', addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: 'Server error while adding address' });
  }
};

export const updateAddress = async (req: Request, res: Response): Promise<void> => {
  try {
    const { addressId } = req.params;
    const user = await User.findById((req as any).user.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const addressIndex = user.addresses.findIndex((addr: any) => addr._id?.toString() === addressId);
    if (addressIndex === -1) {
      res.status(404).json({ message: 'Address not found' });
      return;
    }
    
    if (req.body.isDefault) {
      user.addresses.forEach(addr => { addr.isDefault = false; });
    }
    
    user.addresses[addressIndex] = { ...user.addresses[addressIndex], ...req.body };
    await user.save();
    res.status(200).json({ message: 'Address updated successfully', addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating address' });
  }
};

export const deleteAddress = async (req: Request, res: Response): Promise<void> => {
  try {
    const { addressId } = req.params;
    const user = await User.findById((req as any).user.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.addresses = user.addresses.filter((addr: any) => addr._id?.toString() !== addressId);
    await user.save();
    res.status(200).json({ message: 'Address deleted successfully', addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting address' });
  }
};