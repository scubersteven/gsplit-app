import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { generateShareImageV2, shareToInstagramV2 } from "@/utils/shareImageV2";
import { useCountUp } from "@/hooks/useCountUp";
import { addPoints, updateStreak } from "@/lib/gamification";
import { compressImage } from "@/utils/imageCompression";
import { savePint } from "@/utils/db";

/**
 * Get score color
 */
const getScoreColor = (score: number): string => {
  if (score >= 80) return "#00B140"; // Bright green
  if (score >= 60) return "#FFA500"; // Orange
  return "#D40003"; // Red
};

const GSplitResultV2 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, image, feedback, splitDetected } = location.state || {
    score: 0,
    image: null,
    feedback: "That's a pour",
    splitDetected: false
  };

  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [showSavedBanner, setShowSavedBanner] = useState(false);
  const displayedScore = useCountUp(score, 2000, 400); // Animate score countup
  const hasSaved = useRef(false); // Track if pint has been saved

  // Get user pub name from localStorage (memoized to prevent re-renders)
  const userPubName = useMemo(() => {
    try {
      return localStorage.getItem('userPubName');
    } catch (error) {
      console.error('Failed to get user pub name:', error);
      return null;
    }
  }, []);

  // MOCK DATA: Generate competitive context once (useMemo or useState would work, but useState is simpler)
  const [mockPercentile] = useState(() =>
    score >= 85 ? Math.floor(Math.random() * 15) + 1 :
    score >= 60 ? Math.floor(Math.random() * 20) + 15 :
    Math.floor(Math.random() * 50) + 50
  );

  useEffect(() => {
    // Prevent multiple saves
    if (hasSaved.current) {
      console.log("⏭️ [DEBUG] Already saved, skipping...");
      return;
    }

    // SET FLAG IMMEDIATELY - before any async operations
    hasSaved.current = true;
    console.log("🔒 [DEBUG] Save flag set, proceeding with save operation...");

    // Cleanup flag for unmount prevention
    let cancelled = false;

    // IIFE for async operations inside useEffect
    (async () => {
      if (cancelled) {
        console.log("🚫 [DEBUG] Operation cancelled (component unmounted)");
        return;
      }

      console.log("🔍 [DEBUG] useEffect triggered!", { score, image, splitDetected, feedback, userPubName, mockPercentile });

      if (score > 0 && image) {
        console.log("✅ [DEBUG] Score > 0, proceeding with save...");

        try {
          // Step 1: Compress image to 150KB
          console.log("🗜️ [DEBUG] Starting image compression...");
          const compressedImage = await compressImage(image, 150);
          console.log("✅ [DEBUG] Image compressed successfully");

          // Check if cancelled after async operation
          if (cancelled) {
            console.log("🚫 [DEBUG] Operation cancelled after compression");
            return;
          }

          // Step 2: Add points for gamification
          addPoints(score);
          console.log("💰 [DEBUG] Points added");

          // Step 3: Generate unique ID for this pint
          const pintId = Date.now();

          const newEntry = {
            id: pintId,
            date: new Date().toISOString(),
            splitScore: score,
            splitImage: compressedImage,
            splitDetected: splitDetected ?? false,
            feedback: feedback || "That's a pour",
            location: userPubName || null,
            ranking: `Top ${mockPercentile}% this week`,
            // Survey data (null until completed)
            overallRating: null,
            price: null,
            taste: null,
            temperature: null,
            creaminess: null,
            pourTechnique: null,
          };

          console.log("📝 [DEBUG] New entry created");

          // Check if cancelled before save
          if (cancelled) {
            console.log("🚫 [DEBUG] Operation cancelled before save");
            return;
          }

          // Step 4: Save to IndexedDB (no trimming needed!)
          await savePint(newEntry);
          console.log("✅ [DEBUG] Pint saved to IndexedDB");

          // Step 5: Store pintId for survey flow
          sessionStorage.setItem("currentPintId", pintId.toString());
          console.log("🔑 [DEBUG] Stored pintId in sessionStorage:", pintId);

          // Step 6: Show visible banner AND toast
          setTimeout(() => {
            if (cancelled) return;
            console.log("🍞 [DEBUG] Showing saved banner...");
            setShowSavedBanner(true);
            toast.success("🍺 Pint saved to your log!", {
              description: "View all your pints in the Log tab",
              duration: 6000,
              position: "top-center",
            });

            // Hide banner after 4 seconds
            setTimeout(() => {
              if (cancelled) return;
              setShowSavedBanner(false);
            }, 4000);
          }, 2000); // Wait 2 seconds for page to fully load

        } catch (error: any) {
          if (cancelled) return;
          console.error("❌ [DEBUG] Failed to save pint:", error);

          // Show specific error message
          setTimeout(() => {
            if (cancelled) return;
            if (error.message?.includes('quota')) {
              toast.error("Storage full", {
                description: "Please delete old pints to free up space",
                duration: 4000,
              });
            } else {
              toast.error("Failed to save pint", {
                description: "Please try again",
                duration: 4000,
              });
            }
          }, 2500);
        }
      } else {
        console.log("⚠️ [DEBUG] Score NOT > 0 or no image, skipping save. Score:", score);
      }
    })();

    // Cleanup function
    return () => {
      console.log("🧹 [DEBUG] Cleanup: Cancelling any pending operations");
      cancelled = true;
    };
  }, [score, image, splitDetected, feedback, userPubName, mockPercentile]); // Added mockPercentile back since it's used

  if (!image) {
    navigate("/split");
    return null;
  }

  const handleShare = async () => {
    const shareText = `I just scored ${score}% on Gsplit! ${feedback} 🍺`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Gsplit Score",
          text: shareText,
          url: shareUrl,
        });
        toast.success("Shared successfully!");
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Error sharing:", error);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        toast.success("Link copied to clipboard!");
      } catch (error) {
        toast.error("Failed to copy link");
      }
    }
  };

  const handleInstagramShare = async () => {
    setIsGeneratingImage(true);

    try {
      const imageBlob = await generateShareImageV2({
        score: score,
        splitDetected: splitDetected ?? false,
        feedback: feedback || "That's a pour",
        location: userPubName || undefined,
        ranking: `Top ${mockPercentile}% this week`,
        pintImage: image // User's actual pint photo
      });

      await shareToInstagramV2(imageBlob, score);
      toast.success("Image ready to share!");
    } catch (error) {
      console.error("Error generating share image:", error);
      toast.error("Failed to generate share image");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Get streak count
  const currentStreak = updateStreak();

  return (
    <div className="min-h-screen bg-[#0A0A0A]">

      {/* Saved Banner */}
      {showSavedBanner && (
        <div className="fixed top-[65%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100] animate-fade-in-opacity">
          <div className="bg-white text-black px-3 py-1.5 rounded shadow-sm flex items-center gap-1.5 border border-black/10">
            <span className="text-sm">📁</span>
            <div className="font-normal text-xs">Pint Saved</div>
          </div>
        </div>
      )}

      {/* Responsive Container */}
      <div className="mx-auto max-w-[360px] md:max-w-[500px] px-6 flex flex-col pt-6 pb-8">
        
        {/* Score - THE HERO */}
        <div className="text-center mb-2 animate-score-pop" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          <div
            className="score-display font-display font-black text-7xl leading-none tracking-tight"
            style={{
              color: getScoreColor(score),
              textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}
          >
            {displayedScore.toFixed(1)}%
          </div>
        </div>

        {/* Feedback Quote */}
        {feedback && (
          <div className="text-center mb-4 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
            <p className="text-[#E8E8DD] text-lg font-body italic">
              "{feedback}"
            </p>
          </div>
        )}

        {/* Context Line: Streak + Location + Rank - ALL IN ONE LINE */}
        <div className="text-center mb-6 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
          <span className="text-[#E8E8DD]/70 text-sm font-body">
            🔥 {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
            {userPubName && (
              <> • 📍 {userPubName}</>
            )}
            {' '} • Top {mockPercentile}%
          </span>
        </div>

        {/* Pint Photo */}
        <div className="w-full max-h-[45vh] mb-6 rounded-xl overflow-hidden animate-fade-in" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
          <img
            src={image}
            alt="Your pint"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Primary Button: Share to Instagram */}
        <Button
          onClick={handleInstagramShare}
          disabled={isGeneratingImage}
          className="w-full h-12 text-base font-body font-semibold bg-[#00B140] hover:bg-[#00B140]/90 text-white rounded-lg mb-3 animate-fade-in"
          style={{ animationDelay: '1s', animationFillMode: 'both' }}
        >
          {isGeneratingImage ? "Generating..." : "Share to Instagram 📸"}
        </Button>

        {/* Secondary Button: Challenge a Mate */}
        <Button
          onClick={handleShare}
          className="w-full h-12 text-base font-body font-semibold bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#0A0A0A] rounded-lg mb-3 animate-fade-in"
          style={{ animationDelay: '1.1s', animationFillMode: 'both' }}
        >
          Challenge a Mate ⚔️
        </Button>

        {/* Text Links */}
        <div className="flex items-center justify-center gap-2 animate-fade-in" style={{ animationDelay: '1.2s', animationFillMode: 'both' }}>
          <button
            onClick={() => {
              try {
                const pintId = sessionStorage.getItem("currentPintId");
                navigate("/survey", {
                  state: {
                    pintLogId: pintId ? parseInt(pintId) : null,
                    splitScore: score,
                    splitImage: image
                  }
                });
              } catch (error) {
                console.error("Failed to navigate to survey:", error);
                toast.error("Failed to load survey");
              }
            }}
            className="text-[#E8E8DD] text-sm font-body underline hover:text-[#D4AF37] transition-colors"
          >
            Rate this Pint
          </button>
          <span className="text-[#E8E8DD]/50 text-sm">•</span>
          <button
            onClick={() => navigate("/")}
            className="text-[#E8E8DD] text-sm font-body underline hover:text-[#D4AF37] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default GSplitResultV2;