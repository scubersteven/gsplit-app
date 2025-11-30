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
import { TIERS as GAMIFICATION_TIERS } from "@/lib/gamification";

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

const WEEKLY_DATA = [
  { day: "Su", points: 120 },
  { day: "Mo", points: 240 },
  { day: "Tu", points: 180 },
  { day: "We", points: 360 },
  { day: "Th", points: 360 },
  { day: "Fr", points: 420 },
  { day: "Sa", points: 480 },
];

const MasteryLevelsModal = ({
  open,
  onOpenChange,
  currentTier,
}: MasteryLevelsModalProps) => {
  const [isPointsOpen, setIsPointsOpen] = useState(false);
  const maxPoints = Math.max(...WEEKLY_DATA.map((d) => d.points));
  const graphHeight = 120;
  const graphWidth = 100;
  const padding = 10;

  // Generate path for line graph
  const points = WEEKLY_DATA.map((d, i) => {
    const x = (i / (WEEKLY_DATA.length - 1)) * (graphWidth - 2 * padding) + padding;
    const y = graphHeight - (d.points / maxPoints) * (graphHeight - 2 * padding) - padding;
    return `${x},${y}`;
  }).join(" ");

  const pathD = `M ${points.split(" ").join(" L ")}`;
  
  // Area fill path
  const areaD = `${pathD} L ${graphWidth - padding},${graphHeight - padding} L ${padding},${graphHeight - padding} Z`;

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

        {/* Weekly Trend Graph */}
        <div className="bg-stout-black/5 rounded-xl p-6 mb-6">
          <h3 className="font-inter text-base font-semibold text-stout-black mb-4">
            Points This Week
          </h3>

          <svg
            viewBox={`0 0 ${graphWidth} ${graphHeight}`}
            className="w-full h-[120px]"
            preserveAspectRatio="none"
          >
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((percent) => (
              <line
                key={percent}
                x1={padding}
                y1={graphHeight - (percent / 100) * (graphHeight - 2 * padding) - padding}
                x2={graphWidth - padding}
                y2={graphHeight - (percent / 100) * (graphHeight - 2 * padding) - padding}
                stroke="rgba(26, 26, 26, 0.1)"
                strokeWidth="0.5"
              />
            ))}

            {/* Area fill */}
            <path
              d={areaD}
              fill="rgba(245, 158, 11, 0.1)"
              className="animate-fade-in"
            />

            {/* Line */}
            <path
              d={pathD}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-fade-in"
              style={{
                strokeDasharray: "200",
                strokeDashoffset: "200",
                animation: "dash 1s ease-out forwards",
              }}
            />

            {/* Data points */}
            {WEEKLY_DATA.map((d, i) => {
              const x = (i / (WEEKLY_DATA.length - 1)) * (graphWidth - 2 * padding) + padding;
              const y = graphHeight - (d.points / maxPoints) * (graphHeight - 2 * padding) - padding;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="2"
                  fill="#F59E0B"
                  className="animate-scale-in"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              );
            })}
          </svg>

          {/* X-axis labels */}
          <div className="flex justify-between mt-2 px-2">
            {WEEKLY_DATA.map((d) => (
              <span
                key={d.day}
                className="font-inter text-xs font-medium text-stout-black/60"
              >
                {d.day}
              </span>
            ))}
          </div>
        </div>

        {/* Tier List */}
        <div className="space-y-0">
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
                  index < TIERS.length - 1 ? "border-b border-stout-black/10" : ""
                } ${
                  isCurrent
                    ? "bg-[rgba(245,158,11,0.1)]"
                    : "hover:bg-stout-black/5"
                }`}
              >
                <div className="text-4xl">{tier.emoji}</div>
                <div className="flex-1">
                  <div
                    className="font-inter text-xl font-bold"
                    style={{ color: tier.color }}
                  >
                    {tier.name}
                  </div>
                  <div className="font-inter text-sm font-semibold text-stout-black/60">
                    {rangeText}
                  </div>
                  <div className="font-inter text-sm italic text-stout-black/80">
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

        {/* How Points Work Section */}
        <div className="border-t border-stout-black/10 mt-4 pt-4">
          <Collapsible open={isPointsOpen} onOpenChange={setIsPointsOpen}>
            <CollapsibleTrigger className="flex justify-between items-center w-full p-4 hover:bg-stout-black/5 rounded-lg transition-colors cursor-pointer">
              <span className="font-inter text-base font-semibold text-stout-black">
                How Points Work
              </span>
              <ChevronDown
                className={`h-5 w-5 text-stout-black transition-transform duration-300 ${
                  isPointsOpen ? "rotate-180" : ""
                }`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="bg-stout-black/5 rounded-lg p-4 space-y-2">
                <p className="font-inter text-sm font-normal text-stout-black/80">
                  Your score = base points (86% = 86 pts)
                </p>
                <p className="font-inter text-sm font-normal text-stout-black/80">
                  ✅ Split detected: +25 pts
                </p>
                <p className="font-inter text-sm font-normal text-stout-black/80">
                  ⭐ Survey complete: +15 pts
                </p>
                <p className="font-inter text-sm font-normal text-stout-black/80">
                  🔥 First pour today: +10 pts
                </p>
                <p className="font-inter text-sm font-normal text-stout-black/80">
                  📸 Share to Instagram: +10 pts
                </p>
                <p className="font-inter text-sm font-normal text-stout-black/80">
                  💯 Score 90%+: +20 bonus
                </p>
                <p className="font-inter text-sm font-normal text-stout-black/80">
                  🔥 7-day streak: +100 bonus
                </p>
                <p className="font-inter text-sm font-normal text-stout-black/80 mt-4 pt-2 border-t border-stout-black/10">
                  Daily limit: 1,000 points max
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <style>{`
          @keyframes dash {
            to {
              stroke-dashoffset: 0;
            }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
};

export default MasteryLevelsModal;

