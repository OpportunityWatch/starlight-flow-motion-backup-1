
import { Star } from '../types/stars';

export const generateStars = (count: number, width: number, height: number): Star[] => {
  const stars: Star[] = [];
  
  for (let i = 0; i < count; i++) {
    stars.push({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.01,
      twinkleOffset: Math.random() * Math.PI * 2,
    });
  }
  
  return stars;
};

export const updateStarTwinkle = (star: Star, time: number): number => {
  return star.opacity + Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.3;
};
