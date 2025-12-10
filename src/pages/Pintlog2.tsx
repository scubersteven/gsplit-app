import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PintCard from "@/components/PintCard";
import TierProgress from "@/components/TierProgress";
import { MasteryLevelsModal } from "@/components/MasteryLevelsModal";
import PintReceiptModal from "@/components/PintReceiptModal";
import PintCardModal from "@/components/PintCardModal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getTotalPoints, getTierFromPoints, getProgressToNextTier, TIERS } from "@/lib/gamification";
import { getAllPints, getPintStats, deletePint } from "@/utils/db";

interface Pint {
  id: number;
  image: string;
  score: number;
  splitDetected: boolean;
  feedback: string;
  location: string | null;
  date: string;
  surveyComplete: boolean;
  overallRating?: number | null;
}

type FilterType = "all" | "excellent" | "good" | "poor";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [pints, setPints] = useState<Pint[]>([]);
  const [stats, setStats] = useState({ averageScore: 0, bestScore: 0, totalPints: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isMasteryModalOpen, setIsMasteryModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [isPintModalOpen, setIsPintModalOpen] = useState(false);
  const [selectedPint, setSelectedPint] = useState<Pint | null>(null);

  // Load pints from IndexedDB
  useEffect(() => {
    loadPints();
  }, []);

  // Check for receipt data in navigation state
  useEffect(() => {
    if (location.state && (location.state as any).overallRating) {
      // Store receipt data and show modal
      setReceiptData(location.state);
      setIsReceiptModalOpen(true);
      // Clear location state immediately to prevent modal re-showing on refresh
      navigate("/log", { replace: true });
    }
  }, [location.state, navigate]);

  const loadPints = async () => {
    try {
      setIsLoading(true);
      const allPints = await getAllPints();
      const pintStats = await getPintStats();

      // Transform to display format
      const transformedPints: Pint[] = allPints.map((entry) => ({
        id: entry.id,
        image: entry.splitImage,
        score: entry.splitScore,
        splitDetected: entry.splitDetected,
        feedback: entry.feedback,
        location: entry.location || null,
        date: entry.date,
        surveyComplete: !!entry.overallRating,
        overallRating: entry.overallRating || null,
      }));

      setPints(transformedPints);
      setStats(pintStats);
    } catch (error) {
      console.error('Failed to load pints:', error);
      toast({
        title: "Failed to load pints",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePintClick = (pint: Pint) => {
    setSelectedPint(pint);
    setIsPintModalOpen(true);
  };

  const handleDeletePint = async (id: number) => {
    try {
      await deletePint(id);
      await loadPints();
      toast({
        title: "Pint deleted",
        duration: 2000,
      });
    } catch (error) {
      console.error('Failed to delete pint:', error);
      toast({
        title: "Failed to delete pint",
        duration: 3000,
      });
    }
  };

  const totalPints = stats.totalPints;
  const mainRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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

  // Calculate gamification data
  const gamificationTotalPoints = getTotalPoints();
  const currentTier = getTierFromPoints(gamificationTotalPoints);
  const progress = getProgressToNextTier(gamificationTotalPoints);
  const currentTierIndex = TIERS.indexOf(currentTier);
  const nextTier = currentTierIndex < TIERS.length - 1 ? TIERS[currentTierIndex + 1] : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background px-4 md:px-8 py-10 md:py-20">
        <div className="max-w-[900px] mx-auto">
          {/* ROW 1: Title */}
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white">
            My Pints
          </h1>

          {/* ROW 2: Stats Line */}
          <div className="mt-2">
            <p className="text-sm text-foreground/60">
              {stats.totalPints} pints • {stats.averageScore.toFixed(1)}% avg • {stats.bestScore.toFixed(1)}% best
            </p>
          </div>

          {/* ROW 3: Tier Progress Bar */}
          <div className="mt-4 mb-4">
            <TierProgress
              tier={currentTier.name}
              emoji={currentTier.icon}
              progress={progress.percentage}
              onTap={() => setIsMasteryModalOpen(true)}
            />
          </div>

          {/* ROW 4: Filter Tabs */}
          <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1 mt-4">
            <button
              onClick={() => setActiveFilter("all")}
              className={`font-inter text-sm font-semibold px-4 py-2 rounded-sm whitespace-nowrap transition-all ${
                activeFilter === "all"
                  ? "bg-harp-gold/20 text-harp-gold border border-harp-gold/40"
                  : "bg-transparent text-white/60 hover:text-white border border-white/10"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter("excellent")}
              className={`font-inter text-sm font-semibold px-4 py-2 rounded-sm whitespace-nowrap transition-all ${
                activeFilter === "excellent"
                  ? "bg-harp-gold/20 text-harp-gold border border-harp-gold/40"
                  : "bg-transparent text-white/60 hover:text-white border border-white/10"
              }`}
            >
              80%+
            </button>
            <button
              onClick={() => setActiveFilter("good")}
              className={`font-inter text-sm font-semibold px-4 py-2 rounded-sm whitespace-nowrap transition-all ${
                activeFilter === "good"
                  ? "bg-harp-gold/20 text-harp-gold border border-harp-gold/40"
                  : "bg-transparent text-white/60 hover:text-white border border-white/10"
              }`}
            >
              60-79%
            </button>
            <button
              onClick={() => setActiveFilter("poor")}
              className={`font-inter text-sm font-semibold px-4 py-2 rounded-sm whitespace-nowrap transition-all ${
                activeFilter === "poor"
                  ? "bg-harp-gold/20 text-harp-gold border border-harp-gold/40"
                  : "bg-transparent text-white/60 hover:text-white border border-white/10"
              }`}
            >
              &lt;60%
            </button>
          </div>
        </div>
      </header>

      {/* Pint Cards Section */}
      <main
        ref={mainRef}
        className="bg-background px-4 md:px-8 py-4 md:py-8 min-h-[60vh] overflow-y-auto touch-pan-y"
        style={{ overscrollBehavior: "none" }}
      >
        <div className="max-w-[900px] mx-auto relative">
          {/* Loading State */}
          {isLoading ? (
            <div className="text-center py-20">
              <div className="w-8 h-8 border-2 border-harp-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="font-inter text-lg text-white/80">Loading pints...</p>
            </div>
          ) : (
            <>
              {filteredPints.length > 0 ? (
            <div className="space-y-4">
              {filteredPints.map((pint) => (
                <PintCard
                  key={pint.id}
                  {...pint}
                  onClick={() => handlePintClick(pint)}
                />
              ))}
            </div>
          ) : pints.length === 0 ? (
            /* Empty State */
            <div className="text-center py-20">
              <h2 className="font-inter text-xl font-semibold text-white/80 mb-6">
                No splits yet
              </h2>
              <button
                onClick={() => navigate('/')}
                className="bg-harp-gold text-stout-black font-inter text-base font-semibold px-6 py-3 rounded h-auto hover:bg-harp-gold/90 transition-all"
              >
                Split the G
              </button>
            </div>
          ) : (
            /* No Results for Filter */
            <div className="text-center py-20">
              <h2 className="font-inter text-xl font-semibold text-white/80">
                No pints in this range
              </h2>
            </div>
          )}
            </>
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

      {/* Mastery Levels Modal */}
      <MasteryLevelsModal
        open={isMasteryModalOpen}
        onOpenChange={setIsMasteryModalOpen}
      />

      {/* Receipt Modal */}
      <PintReceiptModal
        open={isReceiptModalOpen}
        onOpenChange={setIsReceiptModalOpen}
        receiptData={receiptData}
      />

      {/* Pint Card Modal */}
      <PintCardModal
        open={isPintModalOpen}
        onOpenChange={setIsPintModalOpen}
        pintData={selectedPint}
        onDelete={handleDeletePint}
      />
    </div>
  );
};

export default Index;
