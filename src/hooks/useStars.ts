
import { useState, useEffect } from 'react';
import { Star } from '../types/stars';
import { generateStars, updateStarTwinkle } from '../utils/starGeneration';

export const useStars = (width: number, height: number, isMobile: boolean) => {
  const [stars, setStars] = useState<Star[]>([]);
  
  useEffect(() => {
    const starCount = isMobile ? 150 : 200;
    setStars(generateStars(starCount, width, height));
  }, [width, height, isMobile]);
  
  const getStarOpacity = (star: Star, time: number) => {
    return Math.max(0.1, Math.min(1, updateStarTwinkle(star, time)));
  };
  
  return { stars, getStarOpacity };
};
