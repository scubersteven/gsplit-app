import { useEffect, useState } from 'react';
import { getStreak, updateStreak } from '@/lib/gamification';

const StreakBadge = () => {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const currentStreak = updateStreak();
    setStreak(currentStreak);
  }, []);

  if (streak === 0) return null;

  return (
    <div 
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 animate-fade-in"
      style={{ 
        animationDelay: '0.5s', 
        animationFillMode: 'both',
        boxShadow: '0 0 20px rgba(251, 146, 60, 0.2)'
      }}
    >
      <span className="text-lg animate-pulse">🔥</span>
      <span className="text-orange-400 text-sm font-bold">
        {streak} {streak === 1 ? 'day' : 'days'}
      </span>
    </div>
  );
};

export default StreakBadge;
