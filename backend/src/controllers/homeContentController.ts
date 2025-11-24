import { Request, Response } from 'express';
import HomeContent, { IHomeContent } from '../models/HomeContent';
import cloudinary from '../config/cloudinary';

// Get active home content
export const getActiveHomeContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();
    
    const homeContent = await HomeContent.find({
      isActive: true,
      $or: [
        { startDate: { $exists: false }, endDate: { $exists: false } },
        { startDate: { $lte: now }, endDate: { $gte: now } },
        { startDate: { $lte: now }, endDate: { $exists: false } },
        { startDate: { $exists: false }, endDate: { $gte: now } }
      ]
    }).sort({ position: 1 });

    res.status(200).json(homeContent);
  } catch (error) {
    console.error('Get home content error:', error);
    res.status(500).json({ message: 'Server error while fetching home content' });
  }
};

// Create home content (Admin)
export const createHomeContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      sectionType,
      position,
      title,
      subtitle,
      description,
      buttonText,
      buttonLink,
      isActive,
      startDate,
      endDate,
      backgroundColor,
      textColor
    } = req.body;

    let imageUrl: string | undefined;
    let videoUrl: string | undefined;

    // Handle image upload
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        
        if (file.mimetype.startsWith('image/')) {
          const uploaded = await cloudinary.uploader.upload(base64, {
            folder: 'home_content',
          });
          imageUrl = uploaded.secure_url;
        } else if (file.mimetype.startsWith('video/')) {
          const uploaded = await cloudinary.uploader.upload(base64, {
            resource_type: 'video',
            folder: 'home_content',
          });
          videoUrl = uploaded.secure_url;
        }
      }
    }

    const homeContent = await HomeContent.create({
      sectionType,
      position,
      title,
      subtitle,
      description,
      imageUrl,
      videoUrl,
      buttonText,
      buttonLink,
      isActive: isActive === 'true' || isActive === true,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      backgroundColor,
      textColor
    });

    res.status(201).json({ 
      message: 'Home content created successfully', 
      homeContent 
    });
  } catch (error) {
    console.error('Create home content error:', error);
    res.status(500).json({ message: 'Server error while creating home content' });
  }
};

// Update home content (Admin)
export const updateHomeContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Handle file uploads if any
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        
        if (file.mimetype.startsWith('image/')) {
          const uploaded = await cloudinary.uploader.upload(base64, {
            folder: 'home_content',
          });
          updateData.imageUrl = uploaded.secure_url;
        } else if (file.mimetype.startsWith('video/')) {
          const uploaded = await cloudinary.uploader.upload(base64, {
            resource_type: 'video',
            folder: 'home_content',
          });
          updateData.videoUrl = uploaded.secure_url;
        }
      }
    }

    const homeContent = await HomeContent.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!homeContent) {
      res.status(404).json({ message: 'Home content not found' });
      return;
    }

    res.status(200).json({ 
      message: 'Home content updated successfully', 
      homeContent 
    });
  } catch (error) {
    console.error('Update home content error:', error);
    res.status(500).json({ message: 'Server error while updating home content' });
  }
};

// Delete home content (Admin)
export const deleteHomeContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const homeContent = await HomeContent.findByIdAndDelete(id);
    
    if (!homeContent) {
      res.status(404).json({ message: 'Home content not found' });
      return;
    }

    res.status(200).json({ message: 'Home content deleted successfully' });
  } catch (error) {
    console.error('Delete home content error:', error);
    res.status(500).json({ message: 'Server error while deleting home content' });
  }
};