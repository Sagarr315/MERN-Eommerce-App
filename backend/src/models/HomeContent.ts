
import mongoose, { Schema, Document } from 'mongoose';

export interface IHomeContent extends Document {
  sectionType: 'hero' | 'advertisement';
  position: number;
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  buttonText?: string;
  buttonLink?: string;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  backgroundColor?: string;
  textColor?: string;
}

const HomeContentSchema: Schema = new Schema({
  sectionType: { 
    type: String, 
    enum: ['hero', 'advertisement'], 
    required: true 
  },
  position: { 
    type: Number, 
    required: true 
  },
  title: { 
    type: String 
  },
  subtitle: { 
    type: String 
  },
  description: { 
    type: String 
  },
  imageUrl: { 
    type: String 
  },
  videoUrl: { 
    type: String 
  },
  buttonText: { 
    type: String 
  },
  buttonLink: { 
    type: String 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  startDate: { 
    type: Date 
  },
  endDate: { 
    type: Date 
  },
  backgroundColor: { 
    type: String 
  },
  textColor: { 
    type: String 
  }
}, {
  timestamps: true
});

export default mongoose.model<IHomeContent>('HomeContent', HomeContentSchema);