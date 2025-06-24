

import { ShootingStar } from '../types/stars';

export const createShootingStar = (width: number, height: number, isMobile: boolean): ShootingStar => {
  const spawnSide = Math.random();
  let x: number, y: number, vx: number, vy: number;
  
  // Spawn from bottom and lower 25% of sides
  if (spawnSide < 0.6) {
    // Bottom spawn - increased speed by 10%
    x = Math.random() * width;
    y = height + 10;
    vx = (Math.random() - 0.5) * (isMobile ? 4.4 : 6.6); // 4*1.1 = 4.4, 6*1.1 = 6.6
    vy = -(Math.random() * 3 + 4) * (isMobile ? 1.1 : 1.32); // 1*1.1 = 1.1, 1.2*1.1 = 1.32
  } else {
    // Side spawn (lower 25%) - increased speed by 10%
    const isLeft = Math.random() < 0.5;
    x = isLeft ? -10 : width + 10;
    y = height * 0.75 + Math.random() * height * 0.25;
    vx = isLeft ? (Math.random() * 4 + 3) * 1.1 : -((Math.random() * 4 + 3) * 1.1); // Increased by 10%
    vy = -(Math.random() * 3 + 2) * (isMobile ? 1.1 : 1.32); // 1*1.1 = 1.1, 1.2*1.1 = 1.32
  }
  
  return {
    id: Date.now() + Math.random(),
    x,
    y,
    vx,
    vy,
    life: 0,
    maxLife: isMobile ? 120 : 160, // Increased from 60/80 to 120/160 for longer flight paths
    trail: [],
    curveStrength: Math.random() * 0.015 + 0.01, // Reduced from 0.03 + 0.02 to 0.015 + 0.01
    curveDirection: Math.random() < 0.5 ? -1 : 1,
  };
};

export const updateShootingStar = (star: ShootingStar): ShootingStar => {
  // Apply gentler curve effect for more subtle arc
  star.vx += star.curveStrength * star.curveDirection;
  star.vy += star.curveStrength * 0.2; // Reduced from 0.3 to 0.2 for less upward curve
  
  // Calculate speed to determine how many trail points to add
  const speed = Math.sqrt(star.vx * star.vx + star.vy * star.vy);
  const trailPointsToAdd = Math.max(1, Math.ceil(speed / 3)); // Add more points for faster stars
  
  // Add multiple trail points for smoother trails on fast stars
  for (let i = 0; i < trailPointsToAdd; i++) {
    const interpolationFactor = i / trailPointsToAdd;
    const trailX = star.x + (star.vx * interpolationFactor);
    const trailY = star.y + (star.vy * interpolationFactor);
    star.trail.unshift({ x: trailX, y: trailY, opacity: 1 });
  }
  
  // Update position
  star.x += star.vx;
  star.y += star.vy;
  
  // Limit trail length and fade
  if (star.trail.length > star.maxLife) {
    star.trail.splice(star.maxLife);
  }
  
  // Fade trail
  star.trail.forEach((point, index) => {
    point.opacity = Math.max(0, 1 - (index / star.maxLife));
  });
  
  star.life++;
  
  return star;
};

export const shouldRemoveShootingStar = (star: ShootingStar, height: number): boolean => {
  // Only remove when star reaches well past the top of screen or exceeds max life significantly
  return star.y < -100 || star.life > star.maxLife * 2.5;
};
