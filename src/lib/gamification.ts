export interface TierInfo {
  name: string;
  minPoints: number;
  maxPoints: number;
  color: string;
  icon: string;
}

export const TIERS: TierInfo[] = [
  { name: 'Rookie', minPoints: 0, maxPoints: 99, color: '#9CA3AF', icon: '🌱' },
  { name: 'Bronze', minPoints: 100, maxPoints: 299, color: '#CD7F32', icon: '🥉' },
  { name: 'Silver', minPoints: 300, maxPoints: 599, color: '#C0C0C0', icon: '🥈' },
  { name: 'Gold', minPoints: 600, maxPoints: 999, color: '#D4AF37', icon: '🥇' },
  { name: 'Legend', minPoints: 1000, maxPoints: Infinity, color: '#9333EA', icon: '👑' },
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
  const currentPoints = parseInt(localStorage.getItem('gsplit_total_points') || '0');
  const newPoints = currentPoints + Math.round(scoreValue);
  localStorage.setItem('gsplit_total_points', newPoints.toString());
  return newPoints;
};

export const getTotalPoints = (): number => {
  return parseInt(localStorage.getItem('gsplit_total_points') || '0');
};

export const updateStreak = (): number => {
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
};

export const getStreak = (): number => {
  return parseInt(localStorage.getItem('gsplit_streak_count') || '0');
};
