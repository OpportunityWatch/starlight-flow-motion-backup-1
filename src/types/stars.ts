
export interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

export interface ShootingStar {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  trail: Array<{ x: number; y: number; opacity: number }>;
  curveStrength: number;
  curveDirection: number;
}
