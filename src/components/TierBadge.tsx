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
