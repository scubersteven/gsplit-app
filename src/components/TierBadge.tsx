import { useEffect, useState } from 'react';
import { getTierFromPoints, getTotalPoints } from '@/lib/gamification';

const TierBadge = () => {
  const [tier, setTier] = useState(() => getTierFromPoints(getTotalPoints()));

  useEffect(() => {
    const points = getTotalPoints();
    setTier(getTierFromPoints(points));
  }, []);

  return (
    <div 
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border animate-fade-in"
      style={{ 
        backgroundColor: `${tier.color}15`,
        borderColor: `${tier.color}40`,
        animationDelay: '0.6s', 
        animationFillMode: 'both',
        boxShadow: `0 0 20px ${tier.color}30`
      }}
    >
      <span className="text-lg">{tier.icon}</span>
      <span 
        className="text-sm font-bold"
        style={{ color: tier.color }}
      >
        {tier.name}
      </span>
    </div>
  );
};

export default TierBadge;
