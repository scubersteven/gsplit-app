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
import { getScoreColor } from "@/utils/scoreColors";

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
  const displayedScore = useCountUp(score, 2000, 400); // Animate score countup
  const hasSaved = useRef(false); // Track if pint has been saved

  // Get user pub name from sessionStorage or localStorage (memoized to prevent re-renders)
  const userPubName = useMemo(() => {
    try {
      // Check sessionStorage first (from PubSelectModal flow on Home page)
      const selectedPub = sessionStorage.getItem('selectedPub');
      if (selectedPub) {
        const pubData = JSON.parse(selectedPub);
        return pubData.name;
      }

      // Fallback to localStorage (from GSplit page direct input flow)
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

  // Scroll to top on mount to show score animation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

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
            location: userPubName && userPubName.length > 2 ? userPubName : null,
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

          // Step 4.5: Also save to backend API
          try {
            // Generate anonymous ID if not exists
            let anonymousId = localStorage.getItem('anonymous_id');
            if (!anonymousId) {
              anonymousId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
              localStorage.setItem('anonymous_id', anonymousId);
            }

            // Get username from sessionStorage (set in PubSelectModal)
            const username = sessionStorage.getItem('gsplit_username');

            // Get pub data from sessionStorage
            const selectedPubStr = sessionStorage.getItem('selectedPub');
            if (selectedPubStr) {
              const selectedPub = JSON.parse(selectedPubStr);

              // Only POST to backend if this is a real Google Places pub (has place_id)
              // Skip API call for custom/free text pub names
              if (selectedPub.place_id) {
                // POST score to backend
                const apiResponse = await fetch(
                  `https://g-split-judge-production.up.railway.app/api/pubs/${selectedPub.place_id}/scores`,
                  {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      score: score,
                      username: username || null,
                      anonymous_id: anonymousId,
                      split_detected: splitDetected,
                      feedback: feedback,
                      ranking: `Top ${mockPercentile}% this week`,
                      pub_name: selectedPub.name,
                      pub_address: selectedPub.address,
                      pub_lat: selectedPub.lat,
                      pub_lng: selectedPub.lng,
                    })
                  }
                );

                if (apiResponse.ok) {
                  console.log("✅ [DEBUG] Score synced to backend");
                }
              } else {
                console.log("ℹ️ [DEBUG] Skipping backend sync - custom pub name (no place_id)");
              }
            }
          } catch (error) {
            console.error('Failed to sync score to backend:', error);
            // Don't block user flow - IndexedDB save succeeded
          }

          // Step 5: Store pintId for survey flow
          sessionStorage.setItem("currentPintId", pintId.toString());
          console.log("🔑 [DEBUG] Stored pintId in sessionStorage:", pintId);

          // Step 6: Show toast notification
          setTimeout(() => {
            if (cancelled) return;
            console.log("🍞 [DEBUG] Showing saved toast...");
            toast.success("Pint saved!", {
              duration: 4000,
              position: "top-center",
            });
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

      await shareToInstagramV2(imageBlob, score, feedback);
      toast.success("Image ready to share!");
    } catch (error) {
      console.error("Error generating share image:", error);
      toast.error("Failed to generate share image.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Get streak count
  const currentStreak = updateStreak();

  return (
    <div className="min-h-screen bg-[#0A0A0A]">

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
            <p className="text-[#E8E8DD] text-lg font-display italic">
              "{feedback}"
            </p>
          </div>
        )}

        {/* Context Line: Streak + Location + Rank - ALL IN ONE LINE */}
        <div className="text-center mb-6 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
          <span className="text-[#E8E8DD]/70 text-sm font-inter">
            🔥 {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
            {userPubName && (
              <> • 📍 {userPubName}</>
            )}
            {' '} • Top {mockPercentile}%
          </span>
        </div>

        {/* Pint Photo */}
        <div className="w-full max-h-[65vh] mb-6 rounded-xl overflow-hidden animate-fade-in" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
          <img
            src={image}
            alt="Your pint"
            className="w-full object-contain"
          />
        </div>

        {/* Primary Button: Share to Instagram */}
        <Button
          onClick={handleInstagramShare}
          disabled={isGeneratingImage}
          className="w-full h-12 text-base font-inter font-semibold bg-[#10B981] hover:bg-[#10B981]/90 text-[#0A0A0A] rounded mb-3 animate-fade-in"
          style={{ animationDelay: '1s', animationFillMode: 'both' }}
        >
          {isGeneratingImage ? "Generating..." : "📸 Share to Instagram"}
        </Button>

        {/* Secondary Button: Rate This Pint */}
        <Button
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
              toast.error("Failed to load survey.");
            }
          }}
          className="w-full h-12 text-base font-body font-semibold bg-transparent border-2 border-[#F7D447] text-[#F5F5F0] hover:bg-[#F7D447]/10 rounded mb-3 animate-fade-in"
          style={{ animationDelay: '1.1s', animationFillMode: 'both' }}
        >
          Rate This Pint
        </Button>

        {/* Text Link: Try Again */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '1.2s', animationFillMode: 'both' }}>
          <button
            onClick={() => navigate("/")}
            className="text-[#E8E8DD] text-sm font-body hover:underline hover:text-[#F5F5F0] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default GSplitResultV2;