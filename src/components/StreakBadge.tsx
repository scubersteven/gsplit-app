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
      className="flex items-center gap-1.5 animate-fade-in"
      style={{
        animationDelay: '0.5s',
        animationFillMode: 'both'
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
