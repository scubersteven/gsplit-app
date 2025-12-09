import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { generateShareImage, shareToInstagram } from "@/utils/shareImage";

/**
 * Get score color based on thresholds
 * 85%+ = green, 60-84% = amber, <60% = red
 */
const getScoreColor = (score: number): string => {
  if (score >= 85) return "text-[#10B981]"; // precision green
  if (score >= 60) return "text-[#f59e0b]"; // warm amber
  return "text-[#ef4444]"; // deep red
};

/**
 * Get split detection status color
 */
const getSplitColor = (detected: boolean): string => {
  return detected ? "text-[#10B981]" : "text-[#ef4444]";
};

const GSplitResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, image, feedback, splitDetected } = location.state || {
    score: 0,
    image: null,
    feedback: "That's a pour",
    splitDetected: false
  };
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Get user location from localStorage
  const userLocationStr = localStorage.getItem('userLocation');
  const userLocation = userLocationStr ? JSON.parse(userLocationStr) : null;

  // MOCK DATA: Generate competitive context
  // TODO: Replace with real database queries when backend is ready
  const mockRank = Math.floor(Math.random() * 50) + 1; // Random 1-50
  const mockPercentile = score >= 85 ? Math.floor(Math.random() * 15) + 1 : // Top 15%
                         score >= 60 ? Math.floor(Math.random() * 20) + 15 : // 15-35%
                         Math.floor(Math.random() * 50) + 50; // 50%+

  if (!image) {
    navigate("/split");
    return null;
  }

  const handleShare = async () => {
    const shareText = `I just scored ${score}% on my G-Split! ${feedback} 🍺`;
    const shareUrl = window.location.href;

    // Try native share API first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My G-Split Score",
          text: shareText,
          url: shareUrl,
        });
        toast.success("Shared successfully!");
      } catch (error) {
        // User cancelled or error occurred
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Error sharing:", error);
        }
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        toast.success("Link copied to clipboard!");
      } catch (error) {
        toast.error("Failed to copy link.");
      }
    }
  };

  const handleInstagramShare = async () => {
    setIsGeneratingImage(true);

    try {
      // Generate shareable image
      const imageBlob = await generateShareImage({
        pintImage: image,
        score: score,
        feedback: feedback || "That's a pour",
        splitDetected: splitDetected ?? false,
      });

      // Share to Instagram (mobile) or download (desktop)
      await shareToInstagram(imageBlob, score);

      toast.success("Image ready to share!");
    } catch (error) {
      console.error("Error generating share image:", error);
      toast.error("Failed to generate share image.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Back Button */}
      <div className="px-4 pt-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="gap-2 text-[#9CA3AF] hover:text-[#F5F5F0]"
          size="sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      {/* Section 1: Pint Photo (25% - 16:9 aspect ratio) */}
      <div className="px-4 mt-4">
        <div className="relative w-full max-w-md mx-auto rounded-lg overflow-hidden shadow-lg">
          <img
            src={image}
            alt="Your pint split"
            className="w-full aspect-video object-cover"
          />
        </div>
      </div>

      {/* Section 2: Score Card (35% - ABOVE THE FOLD) */}
      <div className="px-4 mt-4">
        <div className="bg-[#1a1a1a] border-t-2 border-[#D4AF37] rounded-lg p-6">
          {/* 🔍 SCORE Label */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-2xl">🔍</span>
            <span className="text-sm font-semibold text-[#9CA3AF] uppercase tracking-wider">SCORE</span>
          </div>

          {/* Giant Score */}
          <div className={`text-8xl font-black text-center mb-4 ${getScoreColor(score)}`}>
            {score}%
          </div>

          {/* Split Status */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">{splitDetected ? '✅' : '❌'}</span>
            <span className={`text-lg font-semibold ${getSplitColor(splitDetected)}`}>
              {splitDetected ? 'SPLIT DETECTED' : 'NO SPLIT'}
            </span>
          </div>
        </div>
      </div>

      {/* Section 3: Details Card (20%) */}
      <div className="px-4 mt-4">
        <div className="bg-[#1a1a1a] border-t-2 border-[#D4AF37] rounded-lg p-5 space-y-3">
          {/* Feedback */}
          <div className="flex items-start gap-2">
            <span className="text-lg">💬</span>
            <p className="text-lg italic text-[#F5F5F0] leading-relaxed">
              "{feedback || 'No feedback available'}"
            </p>
          </div>

          {/* Location (if user shared location) */}
          {userLocation && (
            <div className="flex items-center gap-2">
              <span className="text-xl">📍</span>
              <span className="text-lg text-[#E8E8DD]">Your Local</span>
            </div>
          )}

          {/* Competitive Context (MOCK DATA) */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <span className="text-sm font-semibold text-[#D4AF37]">#{mockRank} today</span>
            <span className="text-[#666666]">|</span>
            <span className="text-sm font-medium text-[#9CA3AF]">Top {mockPercentile}%</span>
          </div>
        </div>
      </div>

      {/* Section 4: Action Buttons (20%) */}
      <div className="px-4 mt-4 pb-8 space-y-3">
        {/* Share to Instagram - Primary (Green) */}
        <Button
          onClick={handleInstagramShare}
          disabled={isGeneratingImage}
          size="lg"
          className="w-full py-6 text-lg font-semibold bg-[#10B981] hover:bg-[#10B981]/90 text-[#0A0A0A] transition-transform hover:scale-[1.02]"
        >
          {isGeneratingImage ? "Generating..." : "📸 Share to Instagram"}
        </Button>

        {/* Challenge Friend - Secondary (Gold Border) */}
        <Button
          onClick={handleShare}
          size="lg"
          variant="outline"
          className="w-full py-6 text-lg font-semibold border-2 border-[#D4AF37] text-[#F5F5F0] hover:bg-[#D4AF37]/10 transition-transform hover:scale-[1.02]"
        >
          ⚔️ Challenge Friend
        </Button>

        {/* Try Again - Ghost */}
        <Button
          onClick={() => navigate("/split")}
          size="lg"
          variant="ghost"
          className="w-full py-6 text-lg font-semibold text-[#E8E8DD] hover:bg-[#1a1a1a] transition-transform hover:scale-[1.02]"
        >
          🔄 Try Again
        </Button>
      </div>
    </div>
  );
};

export default GSplitResult;
