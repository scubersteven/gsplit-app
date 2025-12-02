import { useState, useEffect } from "react";
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
import { getAllPints, getPintStats } from "@/utils/db";

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
  const [weeklyData, setWeeklyData] = useState<{ day: string; points: number }[]>([
    { day: "Su", points: 0 },
    { day: "Mo", points: 0 },
    { day: "Tu", points: 0 },
    { day: "We", points: 0 },
    { day: "Th", points: 0 },
    { day: "Fr", points: 0 },
    { day: "Sa", points: 0 },
  ]);
  const [stats, setStats] = useState({
    averageScore: 0,
    bestScore: 0,
    totalPints: 0
  });

  // Load real data from IndexedDB
  useEffect(() => {
    const loadWeeklyPoints = async () => {
      try {
        const pints = await getAllPints();
        const pintStats = await getPintStats();

        // Get last 7 days (today and previous 6 days)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 6);

        // Initialize daily totals
        const dailyPoints: { [key: string]: number } = {};
        const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

        // Create entries for last 7 days
        for (let i = 0; i < 7; i++) {
          const date = new Date(sevenDaysAgo);
          date.setDate(sevenDaysAgo.getDate() + i);
          const dayName = dayNames[date.getDay()];
          const dateKey = date.toDateString();
          dailyPoints[dateKey] = 0;
        }

        // Aggregate points by day
        pints.forEach(pint => {
          const pintDate = new Date(pint.date);
          pintDate.setHours(0, 0, 0, 0);
          const dateKey = pintDate.toDateString();

          // Only count pints from last 7 days
          if (dailyPoints.hasOwnProperty(dateKey)) {
            // Points = score value (matches addPoints logic in gamification.ts)
            dailyPoints[dateKey] += Math.round(pint.splitScore);
          }
        });

        // Convert to array format for graph
        const weeklyDataArray = [];
        for (let i = 0; i < 7; i++) {
          const date = new Date(sevenDaysAgo);
          date.setDate(sevenDaysAgo.getDate() + i);
          const dayName = dayNames[date.getDay()];
          const dateKey = date.toDateString();

          weeklyDataArray.push({
            day: dayName,
            points: dailyPoints[dateKey] || 0
          });
        }

        setWeeklyData(weeklyDataArray);
        setStats(pintStats);
      } catch (error) {
        console.error('Failed to load weekly points:', error);
        // Keep default zero values on error
      }
    };

    if (open) {
      loadWeeklyPoints();
    }
  }, [open]);

  const maxPoints = Math.max(...weeklyData.map((d) => d.points), 1); // Min 1 to avoid divide by zero
  const graphHeight = 120;
  const graphWidth = 100;
  const padding = 10;

  // Generate path for line graph
  const points = weeklyData.map((d, i) => {
    const x = (i / (weeklyData.length - 1)) * (graphWidth - 2 * padding) + padding;
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

        {/* Stats Card */}
        <div className="bg-stout-black border border-harp-gold/20 rounded-xl p-6 shadow-[0_4px_6px_rgba(0,0,0,0.3)] mb-4">
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            {/* Average Score */}
            <div className="text-center">
              <div className="font-inter text-xs md:text-sm font-semibold text-foam-cream/60 mb-2 uppercase tracking-wider">
                Avg.
              </div>
              <div className="font-inter text-3xl md:text-5xl font-bold text-white leading-none">
                {stats.averageScore.toFixed(1)}%
              </div>
            </div>

            {/* Best Score */}
            <div className="text-center">
              <div className="font-inter text-xs md:text-sm font-semibold text-foam-cream/60 mb-2 uppercase tracking-wider">
                Best
              </div>
              <div className="font-inter text-3xl md:text-5xl font-bold text-white leading-none">
                {stats.bestScore.toFixed(1)}%
              </div>
            </div>

            {/* Total Pints */}
            <div className="text-center">
              <div className="font-inter text-xs md:text-sm font-semibold text-foam-cream/60 mb-2 uppercase tracking-wider">
                Pints
              </div>
              <div className="font-inter text-3xl md:text-5xl font-bold text-white leading-none">
                {stats.totalPints}
              </div>
            </div>
          </div>
        </div>

        {/* Mastery Levels Content - All in one compact box */}
        <div className="bg-stout-black border border-harp-gold/20 rounded-xl p-6 shadow-[0_4px_6px_rgba(0,0,0,0.3)]">

          {/* Weekly Trend Graph */}
          <div className="mb-6">
            <h3 className="font-inter text-base font-semibold text-white mb-4">
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
                  stroke="rgba(255, 255, 255, 0.1)"
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
              {weeklyData.map((d, i) => {
                const x = (i / (weeklyData.length - 1)) * (graphWidth - 2 * padding) + padding;
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
              {weeklyData.map((d) => (
                <span
                  key={d.day}
                  className="font-inter text-xs font-medium text-white/60"
                >
                  {d.day}
                </span>
              ))}
            </div>
          </div>

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

