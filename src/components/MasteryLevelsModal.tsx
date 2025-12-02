import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { TIERS as GAMIFICATION_TIERS, getTotalPoints, getProgressToNextTier } from "@/lib/gamification";

interface MasteryLevelsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTier: string;
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
}: MasteryLevelsModalProps) => {
  const [isPointsOpen, setIsPointsOpen] = useState(false);

  // Calculate progress to next tier
  const totalPoints = getTotalPoints();
  const progress = getProgressToNextTier(totalPoints);
  const currentTierIndex = TIERS.findIndex(t => t.name === currentTier);
  const currentTierInfo = TIERS[currentTierIndex];
  const nextTierInfo = currentTierIndex < TIERS.length - 1 ? TIERS[currentTierIndex + 1] : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-foam-cream max-w-[600px] max-h-[90vh] overflow-y-auto rounded-2xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
        <DialogClose className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center text-xl font-semibold text-stout-black hover:opacity-70 transition-opacity cursor-pointer z-10">
          ✕
        </DialogClose>
        <DialogHeader>
          <DialogTitle className="font-playfair text-3xl font-bold text-stout-black">
            Mastery Levels
          </DialogTitle>
        </DialogHeader>

        {/* Progress Bar Section */}
        <div className="bg-stout-black border border-harp-gold/20 rounded-xl p-6 shadow-[0_4px_6px_rgba(0,0,0,0.3)] mb-4">
          {/* Current Tier */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{currentTierInfo.emoji}</span>
            <div>
              <div className="font-inter text-xl font-bold" style={{ color: currentTierInfo.color }}>
                {currentTier}
              </div>
              <div className="font-inter text-sm italic text-white/70">
                {currentTierInfo.tagline}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative w-full h-3 bg-white/10 rounded-full overflow-hidden mb-3">
            <div
              className="absolute top-0 left-0 h-full bg-harp-gold rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>

          {/* Progress Text */}
          <div className="flex justify-between items-center">
            <div className="font-inter text-sm text-white/80">
              {progress.current.toLocaleString()} / {progress.total.toLocaleString()} pts
            </div>
            {nextTierInfo && (
              <div className="font-inter text-sm font-semibold text-harp-gold">
                Next: {nextTierInfo.emoji} {nextTierInfo.name}
              </div>
            )}
          </div>
        </div>

        {/* Mastery Levels Content - All in one compact box */}
        <div className="bg-stout-black border border-harp-gold/20 rounded-xl p-6 shadow-[0_4px_6px_rgba(0,0,0,0.3)]">

          {/* How Points Work Section */}
          <div className="mb-6">
            <Collapsible open={isPointsOpen} onOpenChange={setIsPointsOpen}>
              <CollapsibleTrigger className="flex justify-between items-center w-full p-4 hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
                <span className="font-inter text-base font-semibold text-white">
                  How Points Work
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-white transition-transform duration-300 ${
                    isPointsOpen ? "rotate-180" : ""
                  }`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <div className="bg-white/5 rounded-lg p-4 space-y-2">
                  <p className="font-inter text-sm font-normal text-white/80">
                    Your score = base points (86% = 86 pts)
                  </p>
                  <p className="font-inter text-sm font-normal text-white/80">
                    ✅ Split detected: +25 pts
                  </p>
                  <p className="font-inter text-sm font-normal text-white/80">
                    ⭐ Survey complete: +15 pts
                  </p>
                  <p className="font-inter text-sm font-normal text-white/80">
                    🔥 First pour today: +10 pts
                  </p>
                  <p className="font-inter text-sm font-normal text-white/80">
                    📸 Share to Instagram: +10 pts
                  </p>
                  <p className="font-inter text-sm font-normal text-white/80">
                    💯 Score 90%+: +20 bonus
                  </p>
                  <p className="font-inter text-sm font-normal text-white/80">
                    🔥 7-day streak: +100 bonus
                  </p>
                  <p className="font-inter text-sm font-normal text-white/80 mt-4 pt-2 border-t border-white/10">
                    Daily limit: 1,000 points max
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Tier List */}
          <div className="space-y-0 border-t border-white/10 pt-4">
            <h3 className="font-inter text-base font-semibold text-white mb-4">
              Tier Levels
            </h3>
            {TIERS.map((tier, index) => {
              const isCurrent = tier.name === currentTier;
              const rangeText =
                tier.max === Infinity
                  ? `${tier.min.toLocaleString()}+`
                  : `${tier.min.toLocaleString()} → ${tier.max.toLocaleString()}`;

              return (
                <div
                  key={tier.name}
                  className={`flex items-center gap-4 p-4 transition-colors ${
                    index < TIERS.length - 1 ? "border-b border-white/10" : ""
                  } ${
                    isCurrent
                      ? "bg-harp-gold/10"
                      : "hover:bg-white/5"
                  }`}
                >
                  <div className="text-3xl">{tier.emoji}</div>
                  <div className="flex-1">
                    <div
                      className="font-inter text-lg font-bold"
                      style={{ color: tier.color }}
                    >
                      {tier.name}
                    </div>
                    <div className="font-inter text-sm font-semibold text-white/60">
                      {rangeText}
                    </div>
                    <div className="font-inter text-sm italic text-white/70">
                      {tier.tagline}
                    </div>
                  </div>
                  {isCurrent && (
                    <div
                      className="font-inter text-xs font-semibold px-2 py-1 rounded"
                      style={{
                        color: tier.color,
                        backgroundColor: "rgba(245, 158, 11, 0.2)",
                      }}
                    >
                      Your level
                    </div>
                  )}
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

