export interface HomeContent {
  _id: string;
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
  startDate?: string;
  endDate?: string;
  backgroundColor?: string;
  textColor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HomeContentState {
  heroContent: HomeContent | null;
  advertisements: HomeContent[];
  loading: boolean;
  error: string | null;
}