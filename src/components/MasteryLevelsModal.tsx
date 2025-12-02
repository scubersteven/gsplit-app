import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { TIERS as GAMIFICATION_TIERS } from "@/lib/gamification";

interface MasteryLevelsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTier: string;        // Tier name (e.g., "Local")
  currentTierEmoji: string;   // e.g., "🪑"
  totalPoints: number;        // Total XP earned
  pointsInTier: number;       // Points earned in current tier (for progress bar)
  pointsNeededForNext: number;// Points needed to reach next tier (for progress bar)
  progressPercentage: number; // 0-100 percentage
  nextTierName: string | null;// Next tier name or null if at max
  nextTierEmoji: string | null;
  pointsToNextTier: number;   // Points remaining to next tier
}

// Transform gamification TIERS to match local format
const TIERS = GAMIFICATION_TIERS.map(tier => ({
  name: tier.name,
  emoji: tier.icon,
  color: tier.color,
  min: tier.minPoints,
  max: tier.maxPoints,
  tagline: tier.tagline,
}));

const MasteryLevelsModal = ({
  open,
  onOpenChange,
  currentTier,
  currentTierEmoji,
  totalPoints,
  pointsInTier,
  pointsNeededForNext,
  progressPercentage,
  nextTierName,
  nextTierEmoji,
  pointsToNextTier,
}: MasteryLevelsModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a1a1a] max-w-[400px] max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
        <DialogClose className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center text-xl font-semibold text-[#E8E8DD] hover:opacity-70 transition-opacity cursor-pointer z-10">
          ✕
        </DialogClose>
        <DialogHeader>
          <DialogTitle className="font-playfair text-2xl font-bold text-[#E8E8DD] mb-6">
            Mastery Progress
          </DialogTitle>
        </DialogHeader>

        {/* Hero Section */}
        <div className="mb-6 text-center">
          {/* Current Level Display */}
          <div className="font-inter text-2xl font-bold text-[#E8E8DD] mb-4">
            {currentTierEmoji} {currentTier}
          </div>

          {/* Progress Bar */}
          <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden mb-3">
            <div
              className="absolute top-0 left-0 h-full bg-[#10B981] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Points Fraction */}
          <div className="font-inter text-sm text-[#9CA3AF] mb-2">
            {pointsInTier.toLocaleString()} / {pointsNeededForNext.toLocaleString()} pts
          </div>

          {/* Next Level Info */}
          {nextTierName && (
            <div className="font-inter text-sm text-[#E8E8DD]">
              Next: {nextTierEmoji} {nextTierName} in {pointsToNextTier.toLocaleString()} pts
            </div>
          )}
        </div>

        {/* How to Earn XP Section */}
        <div className="mb-6 pt-4 border-t border-white/10">
          {/* Section Header */}
          <h3 className="font-inter text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">
            How to Earn XP
          </h3>

          {/* XP Methods List */}
          <div className="space-y-2">
            <p className="font-inter text-sm text-[#E8E8DD]">
              Score a pint: +10-100 XP
            </p>
            <p className="font-inter text-sm text-[#E8E8DD]">
              80%+ score: +50 bonus
            </p>
            <p className="font-inter text-sm text-[#E8E8DD]">
              Daily streak: +25/day
            </p>
          </div>
        </div>

        {/* All Levels Section */}
        <div className="pt-4 border-t border-white/10">
          {/* Section Header */}
          <h3 className="font-inter text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">
            All Levels
          </h3>

          {/* Levels List */}
          <div className="space-y-0">
            {TIERS.map((tier, index) => {
              const isCurrent = tier.name === currentTier;
              const isCompleted = totalPoints >= tier.max && tier.max !== Infinity;
              const isFuture = totalPoints < tier.min;

              const rangeText = tier.max === Infinity
                ? `${(tier.min / 1000).toFixed(0)}k+`
                : tier.min < 1000
                  ? `${tier.min} - ${(tier.max / 1000).toFixed(1)}k`
                  : `${(tier.min / 1000).toFixed(1)}k - ${(tier.max / 1000).toFixed(1)}k`;

              return (
                <div
                  key={tier.name}
                  className={`flex items-center justify-between py-3 ${
                    index < TIERS.length - 1 ? "border-b border-white/10" : ""
                  } ${isCurrent ? "bg-[rgba(212,175,55,0.1)]" : ""}`}
                >
                  {/* Left: Emoji + Name */}
                  <div className="flex items-center gap-2">
                    <span className="text-base">{tier.emoji}</span>
                    <div>
                      <div className="font-inter text-base font-bold text-[#E8E8DD]">
                        {tier.name}
                      </div>
                      <div className="font-inter text-sm text-[#9CA3AF]">
                        {rangeText}
                      </div>
                    </div>
                  </div>

                  {/* Right: Status Indicator */}
                  <div>
                    {isCompleted && (
                      <span className="text-base text-[#10B981]">✓</span>
                    )}
                    {isCurrent && (
                      <span className="font-inter text-xs font-semibold text-[#D4AF37]">
                        ← YOU
                      </span>
                    )}
                    {/* Nothing for future tiers */}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MasteryLevelsModal;
