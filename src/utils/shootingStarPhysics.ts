
import { ShootingStar } from '../types/stars';

export const createShootingStar = (width: number, height: number, isMobile: boolean): ShootingStar => {
  const spawnSide = Math.random();
  let x: number, y: number, vx: number, vy: number;
  
  // Spawn from bottom and lower 25% of sides
  if (spawnSide < 0.6) {
    // Bottom spawn
    x = Math.random() * width;
    y = height + 10;
    vx = (Math.random() - 0.5) * (isMobile ? 3 : 4);
    vy = -(Math.random() * 2 + 3) * (isMobile ? 0.8 : 1);
  } else {
    // Side spawn (lower 25%)
    const isLeft = Math.random() < 0.5;
    x = isLeft ? -10 : width + 10;
    y = height * 0.75 + Math.random() * height * 0.25;
    vx = isLeft ? Math.random() * 3 + 2 : -(Math.random() * 3 + 2);
    vy = -(Math.random() * 2 + 1) * (isMobile ? 0.8 : 1);
  }
  
  return {
    id: Date.now() + Math.random(),
    x,
    y,
    vx,
    vy,
    life: 0,
    maxLife: isMobile ? 25 : 35,
    trail: [],
    curveStrength: Math.random() * 0.02 + 0.01,
    curveDirection: Math.random() < 0.5 ? -1 : 1,
  };
};

export const updateShootingStar = (star: ShootingStar): ShootingStar => {
  // Apply curve effect (simulating orbital entry)
  star.vx += star.curveStrength * star.curveDirection;
  star.vy += star.curveStrength * 0.5; // Slight upward curve
  
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
  return star.y < height * 0.1 || star.life > star.maxLife * 1.5;
};
