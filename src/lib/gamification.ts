export interface TierInfo {
  name: string;
  minPoints: number;
  maxPoints: number;
  color: string;
  icon: string;
  tagline: string;
}

export const TIERS: TierInfo[] = [
  { name: 'Tourist', minPoints: 0, maxPoints: 999, color: '#FFF8E7', icon: '📸', tagline: "Still learning where the G is" },
  { name: 'Apprentice', minPoints: 1000, maxPoints: 4999, color: '#FFF8E7', icon: '🪄', tagline: "The line's starting to make sense" },
  { name: 'Local', minPoints: 5000, maxPoints: 14999, color: '#FFF8E7', icon: '🪑', tagline: "You drink with intent" },
  { name: 'Craftsman', minPoints: 15000, maxPoints: 29999, color: '#FFF8E7', icon: '⚒️', tagline: "The foam fears you" },
  { name: 'Master', minPoints: 30000, maxPoints: 49999, color: '#FFF8E7', icon: '🎯', tagline: "Precision is routine" },
  { name: 'Legend', minPoints: 50000, maxPoints: Infinity, color: '#FFF8E7', icon: '🐐', tagline: "The G splits itself for you" },
];

export const getTierFromPoints = (points: number): TierInfo => {
  return TIERS.find(tier => points >= tier.minPoints && points <= tier.maxPoints) || TIERS[0];
};

export const getProgressToNextTier = (points: number): { current: number; total: number; percentage: number } => {
  const currentTier = getTierFromPoints(points);
  const currentTierIndex = TIERS.indexOf(currentTier);
  
  if (currentTierIndex === TIERS.length - 1) {
    return { current: points, total: points, percentage: 100 };
  }

  const nextTier = TIERS[currentTierIndex + 1];
  const pointsInCurrentTier = points - currentTier.minPoints;
  const pointsNeededForNextTier = nextTier.minPoints - currentTier.minPoints;
  const percentage = Math.min((pointsInCurrentTier / pointsNeededForNextTier) * 100, 100);

  return {
    current: pointsInCurrentTier,
    total: pointsNeededForNextTier,
    percentage: Math.round(percentage),
  };
};

export const addPoints = (scoreValue: number): number => {
  try {
    const currentPoints = parseInt(localStorage.getItem('gsplit_total_points') || '0');
    const newPoints = currentPoints + Math.round(scoreValue);
    localStorage.setItem('gsplit_total_points', newPoints.toString());
    return newPoints;
  } catch (error) {
    console.error('Failed to add points:', error);
    return 0;
  }
};

export const getTotalPoints = (): number => {
  try {
    return parseInt(localStorage.getItem('gsplit_total_points') || '0');
  } catch (error) {
    console.error('Failed to get total points:', error);
    return 0;
  }
};

export const updateStreak = (): number => {
  try {
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem('gsplit_last_visit');
    const currentStreak = parseInt(localStorage.getItem('gsplit_streak_count') || '0');

    if (!lastVisit) {
      // First visit
      localStorage.setItem('gsplit_last_visit', today);
      localStorage.setItem('gsplit_streak_count', '1');
      return 1;
    }

    const lastVisitDate = new Date(lastVisit);
    const todayDate = new Date(today);
    const diffTime = todayDate.getTime() - lastVisitDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Same day, keep streak
      return currentStreak;
    } else if (diffDays === 1) {
      // Next day, increment streak
      const newStreak = currentStreak + 1;
      localStorage.setItem('gsplit_last_visit', today);
      localStorage.setItem('gsplit_streak_count', newStreak.toString());
      return newStreak;
    } else {
      // Streak broken, reset to 1
      localStorage.setItem('gsplit_last_visit', today);
      localStorage.setItem('gsplit_streak_count', '1');
      return 1;
    }
  } catch (error) {
    console.error('Failed to update streak:', error);
    return 0;
  }
};

export const getStreak = (): number => {
  try {
    return parseInt(localStorage.getItem('gsplit_streak_count') || '0');
  } catch (error) {
    console.error('Failed to get streak:', error);
    return 0;
  }
};
