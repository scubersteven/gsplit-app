import { useEffect, useState } from 'react';
import { getTierFromPoints, getTotalPoints, TIERS } from '@/lib/gamification';

const TierBadge = () => {
  const [tier, setTier] = useState(() => {
    try {
      return getTierFromPoints(getTotalPoints());
    } catch (error) {
      console.error('Failed to initialize tier:', error);
      return TIERS[0]; // Default to Rookie
    }
  });

  useEffect(() => {
    try {
      const points = getTotalPoints();
      setTier(getTierFromPoints(points));
    } catch (error) {
      console.error('Failed to update tier:', error);
    }
  }, []);

  return (
    <div
      className="flex items-center gap-1.5 animate-fade-in"
      style={{
        animationDelay: '0.6s',
        animationFillMode: 'both'
      }}
    >
      <span className="text-lg">{tier.icon}</span>
      <span
        className="text-sm font-ui font-semibold"
        style={{ color: tier.color }}
      >
        {tier.name}
      </span>
    </div>
  );
};

export default TierBadge;
