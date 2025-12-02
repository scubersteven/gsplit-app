import { useNavigate, useLocation } from "react-router-dom";
import { MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import DisplayStars from "@/components/DisplayStars";

interface ReceiptState {
  splitScore?: number;
  splitImage?: string;
  overallRating: number;
  pub: string;
  roast?: string;
}

const PintReceipt = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ReceiptState | null;

  // Mock data for testing - remove after testing
  const mockData: ReceiptState = {
    splitImage: "https://placehold.co/400x400/1a1a1a/ffffff?text=Pint",
    splitScore: 89.5,
    overallRating: 4.2,
    roast: "That's a pour",
    pub: "The Temple Bar",
  };

  const data = state || mockData;
  const { splitScore, splitImage, overallRating, pub, roast } = data;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-[#00B140]";
    if (score >= 60) return "text-[#FFA500]";
    return "text-[#D40003]";
  };

  const handleShare = () => {
    console.log("Share clicked - placeholder");
  };

  // Use placeholder if no image
  const displayImage = splitImage || "https://placehold.co/400x400/1a1a1a/ffffff?text=Pint";
  const displayScore = splitScore ?? 89.5;

  return (
    <div className="min-h-screen bg-stout flex items-center justify-center px-2">
      {/* Receipt Card - Compact Achievement Moment */}
      <div
        className="relative w-[95%] max-w-[400px] bg-deep-black rounded-2xl p-5 space-y-4 shadow-2xl animate-scale-in"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(212, 175, 55, 0.1)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-3 right-3 text-foreground/60 hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Pint Photo - compact */}
        <div className="w-full">
          <img
            src={displayImage}
            alt="Your pint"
            className="w-full max-h-[200px] rounded-xl object-cover"
          />
        </div>

        {/* Split Score */}
        {splitScore && (
          <div className="text-center">
            <span
              className={`font-playfair text-[42px] font-bold ${getScoreColor(displayScore)}`}
            >
              {displayScore.toFixed(1)}%
            </span>
          </div>
        )}

        {/* Star Rating */}
        <div className="flex items-center justify-center gap-2">
          <DisplayStars value={overallRating} maxStars={5} size={26} />
          <span className="text-[22px] font-bold text-foreground">
            {overallRating.toFixed(1)}
          </span>
        </div>

        {/* Roast */}
        {roast && (
          <p className="text-center italic text-foreground/85 text-base">
            "{roast}"
          </p>
        )}

        {/* Pub Location */}
        <div className="flex items-center justify-center gap-2 text-foreground">
          <MapPin size={18} />
          <span className="text-base">{pub}</span>
        </div>

        {/* Action Buttons - Side by Side */}
        <div className="flex gap-3 pt-1">
          <Button
            onClick={() => navigate("/log")}
            variant="outline"
            className="flex-1 h-11 border-foreground text-foreground hover:bg-foreground hover:text-deep-black font-semibold text-sm"
          >
            View Log
          </Button>
          <Button
            onClick={handleShare}
            className="flex-1 h-11 bg-foreground text-deep-black hover:bg-foreground/90 font-semibold text-sm"
          >
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PintReceipt;
