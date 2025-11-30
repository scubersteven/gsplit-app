import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PintCard from "@/components/PintCard";
import TierProgressCard from "@/components/TierProgressCard";
import StatsCard from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getTotalPoints, getTierFromPoints, getProgressToNextTier, TIERS } from "@/lib/gamification";

interface Pint {
  id: number;
  image: string;
  score: number;
  splitDetected: boolean;
  feedback: string;
  location: string | null;
  date: string;
  surveyComplete: boolean;
}

interface PintLogEntry {
  id: number;
  date: string;
  splitScore?: number;
  splitImage?: string;
  overallRating?: number;
  location?: string;
  splitDetected?: boolean;
  feedback?: string;
  [key: string]: any;
}

type FilterType = "all" | "excellent" | "good" | "poor";

// Generate feedback based on score
const getFeedback = (score: number): string => {
  if (score >= 90) return "Absolute cinema";
  if (score >= 80) return "Textbook execution";
  if (score >= 70) return "Solid pour";
  if (score >= 60) return "Not bad";
  if (score >= 50) return "Back to basics";
  return "Keep practicing";
};

const Index = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [pints, setPints] = useState<Pint[]>([]);

  // Load pints from localStorage
  useEffect(() => {
    loadPints();
  }, []);

  const loadPints = () => {
    try {
      const rawLog = localStorage.getItem("pintLog");
      if (!rawLog) {
        setPints([]);
        return;
      }

      const pintLogEntries: PintLogEntry[] = JSON.parse(rawLog);

      // Transform localStorage data to Pint format
      const transformedPints: Pint[] = pintLogEntries.map((entry) => ({
        id: entry.id,
        image: entry.splitImage || "https://images.unsplash.com/photo-1608270586620-248524c67de9",
        score: entry.splitScore || 0,
        splitDetected: entry.splitDetected ?? (entry.splitScore ? entry.splitScore > 60 : false),
        feedback: entry.feedback || getFeedback(entry.splitScore || 0),
        location: entry.location || null,
        date: entry.date,
        surveyComplete: !!entry.overallRating,
      }));

      // Sort by date (newest first)
      transformedPints.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setPints(transformedPints);
    } catch (error) {
      console.error("Failed to load pints from localStorage:", error);
      setPints([]);
    }
  };
  const totalPints = pints.length;
  const maxPints = 30;
  const storagePercent = (totalPints / maxPints) * 100;
  const mainRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const { toast } = useToast();

  const PULL_THRESHOLD = 80;
  const MAX_PULL = 120;

  const filterPints = (pints: Pint[], filter: FilterType) => {
    switch (filter) {
      case "excellent":
        return pints.filter(p => p.score >= 80);
      case "good":
        return pints.filter(p => p.score >= 60 && p.score < 80);
      case "poor":
        return pints.filter(p => p.score < 60);
      default:
        return pints;
    }
  };

  const filteredPints = filterPints(pints, activeFilter);

  // Pull to refresh handlers
  useEffect(() => {
    const mainElement = mainRef.current;
    if (!mainElement) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (mainElement.scrollTop === 0 && !isRefreshing) {
        startY.current = e.touches[0].clientY;
        setIsPulling(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling || isRefreshing) return;

      const currentY = e.touches[0].clientY;
      const distance = currentY - startY.current;

      if (distance > 0 && mainElement.scrollTop === 0) {
        e.preventDefault();
        const pull = Math.min(distance, MAX_PULL);
        setPullDistance(pull);
      }
    };

    const handleTouchEnd = () => {
      if (!isPulling) return;

      if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
        triggerRefresh();
      } else {
        setPullDistance(0);
      }
      setIsPulling(false);
    };

    mainElement.addEventListener("touchstart", handleTouchStart, { passive: true });
    mainElement.addEventListener("touchmove", handleTouchMove, { passive: false });
    mainElement.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      mainElement.removeEventListener("touchstart", handleTouchStart);
      mainElement.removeEventListener("touchmove", handleTouchMove);
      mainElement.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isPulling, pullDistance, isRefreshing]);

  const triggerRefresh = async () => {
    setIsRefreshing(true);
    setPullDistance(PULL_THRESHOLD);

    // Reload data from localStorage
    await new Promise(resolve => setTimeout(resolve, 500));
    loadPints();

    // Refresh complete
    setIsRefreshing(false);
    setPullDistance(0);

    toast({
      title: "Pints refreshed ✓",
      duration: 2000,
    });
  };

  const pullOpacity = Math.min(pullDistance / PULL_THRESHOLD, 1);
  const pullRotation = (pullDistance / MAX_PULL) * 360;
  const isReadyToRefresh = pullDistance >= PULL_THRESHOLD;

  // Calculate gamification data
  const totalPoints = getTotalPoints();
  const currentTier = getTierFromPoints(totalPoints);
  const progress = getProgressToNextTier(totalPoints);
  const currentTierIndex = TIERS.indexOf(currentTier);
  const nextTier = currentTierIndex < TIERS.length - 1 ? TIERS[currentTierIndex + 1] : null;

  // Calculate stats from real data
  const averageScore = pints.length > 0
    ? pints.reduce((sum, pint) => sum + pint.score, 0) / pints.length
    : 0;
  const bestScore = pints.length > 0
    ? Math.max(...pints.map(p => p.score))
    : 0;

  return (
    <div className="min-h-screen">
      {/* Header - Foam Cream */}
      <header className="bg-foam-cream px-4 md:px-8 py-10 md:py-20">
        <div className="max-w-[900px] mx-auto">
          {/* Title */}
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-stout-black">
            My Pints
          </h1>

          {/* Storage Indicator */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-inter text-base font-semibold text-stout-black/60">
                {totalPints} / {maxPints}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-2 bg-stout-black/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-harp-gold rounded-full transition-all duration-300"
                style={{ width: `${storagePercent}%` }}
              />
            </div>

            {/* Warning */}
            {totalPints >= 28 && (
              <p className="font-inter text-sm font-semibold text-score-good mt-2">
                ⚠️ Almost full! Oldest pints auto-deleted.
              </p>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="mt-8 flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveFilter("all")}
              className={`font-inter text-sm font-semibold px-4 py-2 rounded-lg transition-all ${
                activeFilter === "all"
                  ? "bg-stout-black text-foam-cream"
                  : "bg-transparent text-stout-black/60 hover:text-stout-black"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter("excellent")}
              className={`font-inter text-sm font-semibold px-4 py-2 rounded-lg transition-all ${
                activeFilter === "excellent"
                  ? "bg-stout-black text-foam-cream"
                  : "bg-transparent text-stout-black/60 hover:text-stout-black"
              }`}
            >
              80%+
            </button>
            <button
              onClick={() => setActiveFilter("good")}
              className={`font-inter text-sm font-semibold px-4 py-2 rounded-lg transition-all ${
                activeFilter === "good"
                  ? "bg-stout-black text-foam-cream"
                  : "bg-transparent text-stout-black/60 hover:text-stout-black"
              }`}
            >
              60-79%
            </button>
            <button
              onClick={() => setActiveFilter("poor")}
              className={`font-inter text-sm font-semibold px-4 py-2 rounded-lg transition-all ${
                activeFilter === "poor"
                  ? "bg-stout-black text-foam-cream"
                  : "bg-transparent text-stout-black/60 hover:text-stout-black"
              }`}
            >
              &lt;60%
            </button>
          </div>
        </div>
      </header>

      {/* Pint Cards Section - Stout Black */}
      <main 
        ref={mainRef}
        className="bg-stout-black px-4 md:px-8 py-4 md:py-8 min-h-[60vh] overflow-y-auto touch-pan-y"
        style={{ overscrollBehavior: "none" }}
      >
        <div className="max-w-[900px] mx-auto relative">
          {/* Pull to Refresh Indicator */}
          {(isPulling || isRefreshing) && (
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center transition-all duration-300"
              style={{
                opacity: isRefreshing ? 1 : pullOpacity,
                transform: `translateX(-50%) translateY(${isRefreshing ? '0' : `-${100 - (pullDistance / MAX_PULL) * 100}%`})`,
              }}
            >
              <div
                className="bg-harp-gold/10 rounded-full p-4 flex items-center justify-center"
                style={{
                  transform: `scale(${isReadyToRefresh ? 1.1 : 1})`,
                  transition: "transform 200ms ease-out",
                }}
              >
                <span
                  className="text-2xl text-harp-gold"
                  style={{
                    transform: isRefreshing ? "none" : `rotate(${pullRotation}deg)`,
                    display: "inline-block",
                    animation: isRefreshing ? "spin 1s linear infinite" : "none",
                  }}
                >
                  ⟳
                </span>
              </div>
              {isRefreshing && (
                <span className="font-inter text-sm font-semibold text-foam-cream/80 mt-2">
                  Refreshing...
                </span>
              )}
            </div>
          )}
          {/* Tier Progress Card */}
          <TierProgressCard
            currentTier={currentTier.name}
            emoji={currentTier.icon}
            color={currentTier.color}
            currentPoints={totalPoints}
            tierMin={currentTier.minPoints}
            tierMax={currentTier.maxPoints}
            progress={progress.percentage}
            nextTier={nextTier?.name || "Legend"}
            nextEmoji={nextTier?.icon || "👑"}
            pointsToNext={nextTier ? nextTier.minPoints - totalPoints : 0}
          />

          {/* Stats Card */}
          <StatsCard
            averageScore={averageScore}
            bestScore={bestScore}
            totalPints={totalPints}
          />

          {filteredPints.length > 0 ? (
            <div className="space-y-4">
              {filteredPints.map((pint) => (
                <PintCard key={pint.id} {...pint} />
              ))}
            </div>
          ) : pints.length === 0 ? (
            /* Empty State */
            <div className="text-center py-20">
              <h2 className="font-inter text-xl font-semibold text-foam-cream/60 mb-6">
                No splits yet
              </h2>
              <button
                onClick={() => navigate('/')}
                className="bg-harp-gold text-stout-black font-inter text-base font-semibold px-6 py-3 rounded-lg h-auto hover:bg-harp-gold/90 transition-all"
              >
                Split the G
              </button>
            </div>
          ) : (
            /* No Results for Filter */
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="font-inter text-xl font-semibold text-foreground/60">
                No pints in this range
              </h2>
            </div>
          )}
        </div>

        <style>{`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </main>
    </div>
  );
};

export default Index;
