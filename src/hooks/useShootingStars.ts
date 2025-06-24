import { useState, useEffect, useCallback, useRef } from 'react';
import { ShootingStar } from '../types/stars';
import { createShootingStar, updateShootingStar, shouldRemoveShootingStar } from '../utils/shootingStarPhysics';

export const useShootingStars = (width: number, height: number, isMobile: boolean) => {
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const [nextClusterTime, setNextClusterTime] = useState(0);
  const [isInCluster, setIsInCluster] = useState(false);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  
  // Keep ref in sync with state
  useEffect(() => {
    shootingStarsRef.current = shootingStars;
  }, [shootingStars]);
  
  const spawnShootingStarCluster = useCallback(() => {
    const clusterSize = Math.floor(Math.random() * 3) + 1; // 1-3 stars
    
    for (let i = 0; i < clusterSize; i++) {
      setTimeout(() => {
        const newStar = createShootingStar(width, height, isMobile);
        setShootingStars(prev => [...prev, newStar]);
      }, i * (Math.random() * 500 + 200)); // 200-700ms delay between stars
    }
    
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
  
  // Return a function that can be called to get updated stars without causing re-renders
  const getUpdatedShootingStars = useCallback(() => {
    const currentStars = shootingStarsRef.current;
    const updated = currentStars
      .map(updateShootingStar)
      .filter(star => !shouldRemoveShootingStar(star, height));
    
    // Update the ref immediately
    shootingStarsRef.current = updated;
    
    // Only update state if there's a meaningful change
    if (updated.length !== currentStars.length || updated.length === 0) {
      setShootingStars(updated);
      
      // Check if cluster is complete
      if (isInCluster && updated.length === 0) {
        setIsInCluster(false);
      }
    }
    
    return updated;
  }, [height, isInCluster]);
  
  return { shootingStars: shootingStarsRef.current, getUpdatedShootingStars };
};
