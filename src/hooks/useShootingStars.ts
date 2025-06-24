
import { useState, useEffect, useCallback } from 'react';
import { ShootingStar } from '../types/stars';
import { createShootingStar, updateShootingStar, shouldRemoveShootingStar } from '../utils/shootingStarPhysics';

export const useShootingStars = (width: number, height: number, isMobile: boolean) => {
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const [nextClusterTime, setNextClusterTime] = useState(0);
  const [isInCluster, setIsInCluster] = useState(false);
  const [clusterCount, setClusterCount] = useState(0);
  
  const spawnShootingStarCluster = useCallback(() => {
    const clusterSize = Math.floor(Math.random() * 3) + 1; // 1-3 stars
    const stars: ShootingStar[] = [];
    
    for (let i = 0; i < clusterSize; i++) {
      setTimeout(() => {
        const newStar = createShootingStar(width, height, isMobile);
        setShootingStars(prev => [...prev, newStar]);
      }, i * (Math.random() * 500 + 200)); // 200-700ms delay between stars
    }
    
    setClusterCount(clusterSize);
    setIsInCluster(true);
    
    // Set next cluster time (1-4 seconds quiet period)
    const quietTime = Math.random() * 3000 + 1000;
    setNextClusterTime(Date.now() + quietTime);
  }, [width, height, isMobile]);
  
  useEffect(() => {
    const checkForNewCluster = () => {
      if (!isInCluster && Date.now() >= nextClusterTime) {
        spawnShootingStarCluster();
      }
    };
    
    const interval = setInterval(checkForNewCluster, 100);
    return () => clearInterval(interval);
  }, [nextClusterTime, isInCluster, spawnShootingStarCluster]);
  
  const updateShootingStars = useCallback(() => {
    setShootingStars(prev => {
      const updated = prev
        .map(updateShootingStar)
        .filter(star => !shouldRemoveShootingStar(star, height));
      
      // Check if cluster is complete
      if (isInCluster && updated.length === 0) {
        setIsInCluster(false);
      }
      
      return updated;
    });
  }, [height, isInCluster]);
  
  return { shootingStars, updateShootingStars };
};
