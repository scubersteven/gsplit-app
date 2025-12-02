import { useEffect, useState } from "react";
import MasteryLevelsModal from "./MasteryLevelsModal";
import { getTotalPoints, TIERS, getProgressToNextTier } from "@/lib/gamification";

interface TierProgressCardProps {
  currentTier: string;
  emoji: string;
  color: string;
  currentPoints: number;
  tierMin: number;
  tierMax: number;
  progress: number;
  nextTier: string;
  nextEmoji: string;
  pointsToNext: number;
}

const TierProgressCard = ({
  currentTier,
  emoji,
  color,
  currentPoints,
  tierMax,
  progress,
  nextTier,
  nextEmoji,
  pointsToNext,
}: TierProgressCardProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  const size = 160;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedProgress / 100) * circumference;

  // Calculate gamification data for modal
  const totalPoints = getTotalPoints();
  const progressData = getProgressToNextTier(totalPoints);
  const currentTierIndex = TIERS.findIndex(t => t.name === currentTier);
  const nextTierInfo = currentTierIndex < TIERS.length - 1 ? TIERS[currentTierIndex + 1] : null;

  return (
    <div className="bg-deep-black border-2 border-harp-gold/20 rounded-2xl p-8 shadow-[0_8px_16px_rgba(0,0,0,0.4)] mb-6 text-center">
      {/* Circular Progress Indicator */}
      <div className="relative inline-flex items-center justify-center mb-4">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255, 215, 0, 0.1)"
            strokeWidth={strokeWidth}
          />
          {/* Progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Content inside circle */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-6xl mb-1">{emoji}</div>
          <div className="font-inter text-sm font-semibold text-foam-cream/80">
            {currentPoints.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Tier name */}
      <h2 className="font-inter text-2xl font-bold mt-4" style={{ color }}>
        {currentTier}
      </h2>

      {/* Progress fraction */}
      <p className="font-inter text-base font-semibold text-foam-cream/60 mt-2">
        {currentPoints.toLocaleString()} / {tierMax.toLocaleString()} pts
      </p>

      {/* Next tier preview */}
      <p className="font-inter text-sm font-semibold text-foam-cream/80 mt-2">
        Next: {nextEmoji} {nextTier} in {pointsToNext.toLocaleString()} pts
      </p>

      {/* View Mastery Levels Button */}
      <button
        onClick={() => setModalOpen(true)}
        className="font-inter text-sm font-semibold text-harp-gold mt-3 hover:underline transition-all"
      >
        View Mastery Levels
      </button>

      {/* Modal */}
      <MasteryLevelsModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        currentTier={currentTier}
        currentTierEmoji={emoji}
        totalPoints={totalPoints}
        pointsInTier={progressData.current}
        pointsNeededForNext={progressData.total}
        progressPercentage={progressData.percentage}
        nextTierName={nextTierInfo?.name || null}
        nextTierEmoji={nextTierInfo?.icon || null}
        pointsToNextTier={nextTierInfo ? (nextTierInfo.minPoints - totalPoints) : 0}
      />
    </div>
  );
};

export default TierProgressCard;
