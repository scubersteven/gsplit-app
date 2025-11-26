import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { generateShareImageV2, shareToInstagramV2 } from "@/utils/shareImageV2";
import { useCountUp } from "@/hooks/useCountUp";
import StreakBadge from "@/components/StreakBadge";
import TierBadge from "@/components/TierBadge";
import { addPoints } from "@/lib/gamification";

/**
 * Get score color (MATCHES ShareableResult colors)
 */
const getScoreColor = (score: number): string => {
  if (score >= 80) return "#36B37E"; // Irish green - vibrant! (MATCHED)
  if (score >= 60) return "#E8A849"; // Softer amber (MATCHED)
  return "#C45C4B"; // Softer red (MATCHED)
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
  const displayedScore = useCountUp(score, 2000, 400); // Animate score countup

  // Get user pub name from localStorage
  const userPubName = localStorage.getItem('userPubName');

  // MOCK DATA: Generate competitive context
  const mockRank = Math.floor(Math.random() * 50) + 1;
  const mockPercentile = score >= 85 ? Math.floor(Math.random() * 15) + 1 :
                         score >= 60 ? Math.floor(Math.random() * 20) + 15 :
                         Math.floor(Math.random() * 50) + 50;

  useEffect(() => {
    if (score > 0) {
      // Add points for gamification
      addPoints(score);

      // Save basic pint log immediately
      const existingLog = JSON.parse(localStorage.getItem("pintLog") || "[]");

      // Generate unique ID for this pint
      const pintId = Date.now();

      const newEntry = {
        id: pintId,
        date: new Date().toISOString(),
        splitScore: score,
        splitImage: image,
        splitDetected: splitDetected ?? false,
        feedback: feedback || "That's a pour",
        location: userPubName || undefined,
        ranking: `Top ${mockPercentile}% this week`,
        // Survey data (null until completed)
        overallRating: null,
        price: null,
        taste: null,
        temperature: null,
        creaminess: null,
        headSize: null,
        twoPart: null,
        settled: null,
        tilted: null,
        authentic: null
      };

      localStorage.setItem("pintLog", JSON.stringify([newEntry, ...existingLog]));

      // Store pintId for survey flow (BEFORE toast)
      sessionStorage.setItem("currentPintId", pintId.toString());

      // Show success toast AFTER score animation completes
      setTimeout(() => {
        toast.success("🍺 Pint saved to your log!", {
          description: "View all your pints in the Log tab",
          duration: 3000,
        });
      }, 2500); // Delay 2500ms so score animation finishes first
    }
  }, [score, image, splitDetected, feedback, userPubName, mockPercentile]);

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

  return (
    <div className="min-h-screen bg-[#1C1410]">

      {/* Foam Header - "The Verdict" */}
      <div className="w-full mb-0 animate-fade-in relative overflow-hidden">
        <div className="bg-[#fdecd0] pt-5 pb-2 md:pt-8 md:pb-6 flex flex-col justify-center items-center gap-1 md:gap-2">
          <h1 className="text-[#1C1410] text-4xl md:text-5xl font-display font-bold tracking-wide">
            The Verdict
          </h1>
          {feedback && (
            <p className="text-[#1C1410]/70 text-sm md:text-lg font-body italic font-normal text-center">
              "{feedback}"
            </p>
          )}
        </div>
      </div>

      {/* Responsive Container */}
      <div className="mx-auto max-w-[360px] md:max-w-[900px] px-4 flex flex-col gap-4 md:gap-8 pb-8 md:pb-16 mt-4 md:mt-6">
        
        {/* Top Row - Pint Photo + Stats Box */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          
          {/* Left - Pint Photo */}
          <div className="w-full md:w-1/2">
            <div className="w-full aspect-[9/16] md:aspect-[4/5] rounded-lg overflow-hidden animate-fade-in shadow-lg">
              <img 
                src={image}
                alt="Your pint analysis"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right - Stats Box */}
          <div className="w-full md:w-1/2 flex">
            <div
              className="border-2 border-[#D4AF37] rounded-lg p-3 md:p-6 animate-scale-in w-full flex flex-col justify-center relative"
              style={{
                animationDelay: '0.2s',
                animationFillMode: 'both',
                background: 'linear-gradient(135deg, #2A2A2A 0%, #242220 100%)',
                boxShadow: '0 6px 12px rgba(44, 24, 16, 0.5), 0 2px 4px rgba(44, 24, 16, 0.3), 0 0 20px rgba(212, 175, 55, 0.15)'
              }}
            >
          
              {/* Top badges row */}
              <div className="absolute top-1 md:top-3 left-2 md:left-3 right-2 md:right-3 flex items-center justify-between gap-1 md:gap-2">
                <StreakBadge />
                <TierBadge />
              </div>

              <div className="space-y-4 md:space-y-4 flex flex-col items-center mt-10 md:mt-10">

                {/* Score with countup animation */}
                <div className="animate-score-pop text-center" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
                  <div
                    className="text-6xl md:text-[80px] font-body font-black leading-none"
                    style={{
                      color: getScoreColor(score),
                      letterSpacing: '-0.02em',
                      textShadow: '0 4px 12px rgba(44, 24, 16, 0.4)'
                    }}
                  >
                    {displayedScore.toFixed(1)}%
                  </div>
                </div>
            
                {/* Centered stats */}
                <div className="space-y-1.5 text-center pt-2 w-full">
                  {/* Ranking */}
                  <div className="animate-fade-in" style={{ animationDelay: '0.7s', animationFillMode: 'both' }}>
                    <span className="text-[#D4AF37] text-sm md:text-lg font-body font-semibold">
                      Rank: Top {mockPercentile}% this week
                    </span>
                  </div>

                  {/* Split Status */}
                  <div className="animate-fade-in" style={{ animationDelay: '0.9s', animationFillMode: 'both' }}>
                    <span className="text-[#FFF8E7] text-sm md:text-base font-body font-semibold">
                      Split detected: {splitDetected ? '✅' : '❌'}
                    </span>
                  </div>

                  {/* Location */}
                  {userPubName && (
                    <div className="animate-fade-in" style={{ animationDelay: '1.1s', animationFillMode: 'both' }}>
                      <span className="text-[#FFF8E7] text-sm md:text-base font-body font-semibold">
                        Location 📍: {userPubName}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row - Action Buttons */}
        <div className="flex flex-col items-center space-y-2 animate-fade-in mt-2 md:mt-6" style={{ animationDelay: '1.4s', animationFillMode: 'both' }}>

          {/* Button 1 - Share to Instagram */}
          <Button
            onClick={handleInstagramShare}
            disabled={isGeneratingImage}
            className="w-full h-10 md:h-14 text-xs md:text-base font-ui font-semibold bg-[#fdecd0] hover:bg-[#fdecd0]/90 text-[#1C1410] rounded-md transition-all duration-300"
          >
            {isGeneratingImage ? "Generating..." : "Share to Instagram 📸"}
          </Button>

          {/* Button 2 - Challenge Friend */}
          <Button
            onClick={handleShare}
            className="w-full h-10 md:h-14 text-xs md:text-base font-ui font-semibold bg-[#fdecd0] hover:bg-[#fdecd0]/90 text-[#1C1410] rounded-md transition-all duration-300"
          >
            Challenge Friend ⚔️
          </Button>

          {/* Button 3 - Try Again */}
          <Button
            onClick={() => navigate("/split")}
            className="w-full h-10 md:h-14 text-xs md:text-base font-ui font-semibold bg-[#fdecd0] hover:bg-[#fdecd0]/90 text-[#1C1410] rounded-md transition-all duration-300"
          >
            Try Again 🔄
          </Button>

          {/* Button 4 - Rate this Pint */}
          <Button
            onClick={() => {
              const pintId = sessionStorage.getItem("currentPintId");
              navigate("/survey", {
                state: {
                  pintLogId: pintId ? parseInt(pintId) : null,
                  splitScore: score,
                  splitImage: image
                }
              });
            }}
            className="w-full h-10 md:h-14 text-xs md:text-base font-ui font-semibold bg-[#fdecd0] hover:bg-[#fdecd0]/90 text-[#1C1410] rounded-md transition-all duration-300"
          >
            Rate this Pint ⭐
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GSplitResultV2;