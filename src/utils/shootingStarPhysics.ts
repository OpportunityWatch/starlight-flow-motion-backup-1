
import { ShootingStar } from '../types/stars';

export const createShootingStar = (width: number, height: number, isMobile: boolean): ShootingStar => {
  const spawnSide = Math.random();
  let x: number, y: number, vx: number, vy: number;
  
  // Spawn from bottom and lower 25% of sides
  if (spawnSide < 0.6) {
    // Bottom spawn
    x = Math.random() * width;
    y = height + 10;
    vx = (Math.random() - 0.5) * (isMobile ? 4 : 6);
    vy = -(Math.random() * 3 + 4) * (isMobile ? 1 : 1.2);
  } else {
    // Side spawn (lower 25%)
    const isLeft = Math.random() < 0.5;
    x = isLeft ? -10 : width + 10;
    y = height * 0.75 + Math.random() * height * 0.25;
    vx = isLeft ? Math.random() * 4 + 3 : -(Math.random() * 4 + 3);
    vy = -(Math.random() * 3 + 2) * (isMobile ? 1 : 1.2);
  }
  
  return {
    id: Date.now() + Math.random(),
    x,
    y,
    vx,
    vy,
    life: 0,
    maxLife: isMobile ? 40 : 50, // Increased to allow full screen travel
    trail: [],
    curveStrength: Math.random() * 0.03 + 0.02,
    curveDirection: Math.random() < 0.5 ? -1 : 1,
  };
};

export const updateShootingStar = (star: ShootingStar): ShootingStar => {
  // Apply stronger curve effect for more pronounced arc
  star.vx += star.curveStrength * star.curveDirection;
  star.vy += star.curveStrength * 0.3; // Slight upward curve
  
  // Update position
  star.x += star.vx;
  star.y += star.vy;
  
  // Add to trail
  star.trail.unshift({ x: star.x, y: star.y, opacity: 1 });
  
  // Limit trail length and fade
  if (star.trail.length > star.maxLife) {
    star.trail.pop();
  }
  
  // Fade trail
  star.trail.forEach((point, index) => {
    point.opacity = Math.max(0, 1 - (index / star.maxLife));
  });
  
  star.life++;
  
  return star;
};

export const shouldRemoveShootingStar = (star: ShootingStar, height: number): boolean => {
  // Only remove when star reaches the very top of screen or exceeds max life significantly
  return star.y < -50 || star.life > star.maxLife * 2;
};
