
import React, { useRef, useEffect } from 'react';
import { useStars } from '../hooks/useStars';
import { useShootingStars } from '../hooks/useShootingStars';
import { useIsMobile } from '../hooks/use-mobile';

const NightSkyBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const isMobile = useIsMobile();
  
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });
  const { stars, getStarOpacity } = useStars(dimensions.width, dimensions.height, isMobile);
  const { getUpdatedShootingStars } = useShootingStars(dimensions.width, dimensions.height, isMobile);
  
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    let startTime = Date.now();
    
    const animate = () => {
      const currentTime = Date.now();
      const elapsed = (currentTime - startTime) / 1000;
      
      // Clear canvas
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      
      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, dimensions.height);
      gradient.addColorStop(0, '#1a1a2e');
      gradient.addColorStop(1, '#16537e');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);
      
      // Draw twinkling stars
      stars.forEach(star => {
        const opacity = getStarOpacity(star, elapsed);
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      
      // Get updated shooting stars and draw them
      const currentShootingStars = getUpdatedShootingStars();
      
      currentShootingStars.forEach(star => {
        // Calculate fade factor based on position near top of screen
        const fadeZoneHeight = dimensions.height * 0.15; // Top 15% of screen
        const fadeStartY = fadeZoneHeight;
        let globalFadeMultiplier = 1;
        
        if (star.y < fadeStartY) {
          // Gradually fade out as star approaches top
          globalFadeMultiplier = Math.max(0, star.y / fadeStartY);
        }
        
        // Draw trail with fade effect
        star.trail.forEach((point, index) => {
          if (point.opacity > 0) {
            ctx.save();
            ctx.globalAlpha = point.opacity * 0.8 * globalFadeMultiplier;
            
            // Create lighter blue glow effect with larger radius
            const trailSize = isMobile ? 4 : 6;
            const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, trailSize);
            gradient.addColorStop(0, '#7dc8ff');
            gradient.addColorStop(0.5, 'rgba(125, 200, 255, 0.5)');
            gradient.addColorStop(1, 'rgba(125, 200, 255, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(point.x, point.y, trailSize * 0.6, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        });
        
        // Draw shooting star core with fade effect
        ctx.save();
        ctx.globalAlpha = 1 * globalFadeMultiplier;
        ctx.fillStyle = '#7dc8ff';
        ctx.shadowColor = '#7dc8ff';
        ctx.shadowBlur = (isMobile ? 12 : 16) * globalFadeMultiplier;
        ctx.beginPath();
        const coreSize = isMobile ? 2 : 3;
        ctx.arc(star.x, star.y, coreSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, stars, getStarOpacity, getUpdatedShootingStars]);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: -10 }}
    />
  );
};

export default NightSkyBackground;
