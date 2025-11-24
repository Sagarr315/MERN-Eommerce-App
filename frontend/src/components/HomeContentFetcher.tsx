import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import type { HomeContent } from '../types/HomeContent';

const HomeContentFetcher = () => {
  const [heroContent, setHeroContent] = useState<HomeContent | null>(null);
  const [advertisements, setAdvertisements] = useState<HomeContent[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/home-content');
        const data: HomeContent[] = response.data;
        
        const hero = data.find(item => item.sectionType === 'hero') || null;
        const ads = data.filter(item => item.sectionType === 'advertisement');
        
        setHeroContent(hero);
        setAdvertisements(ads);
      } catch (error) {
        console.error('Error fetching banners:', error);
      }
    };

    fetchData();
  }, []);

  return { heroContent, advertisements };
};

export default HomeContentFetcher;