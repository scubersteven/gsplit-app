import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import DisplayStars from "@/components/DisplayStars";
import gsplitLogo from "@/assets/g-split-logo.png";
import { getScoreColorClass } from "@/utils/scoreColors";

interface ReceiptData {
  splitScore?: number | null;
  splitImage?: string | null;
  overallRating: number;
  pub: string;
  roast?: string;
  isSurveyOnly?: boolean;
}

interface PintReceiptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receiptData: ReceiptData | null;
}

const PintReceiptModal = ({
  open,
  onOpenChange,
  receiptData,
}: PintReceiptModalProps) => {
  if (!receiptData) return null;

  const { splitScore, splitImage, overallRating, pub, roast, isSurveyOnly } = receiptData;

  // Determine display mode
  const isGSplitMode = !isSurveyOnly && splitImage && splitImage.length > 0;

  const handleShare = () => {
    console.log("Share clicked - placeholder");
  };

  // IMAGE: G-Split uses pint image, Survey-only uses Gsplit logo
  const displayImage = isGSplitMode ? splitImage : gsplitLogo;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-transparent border-0 shadow-none p-0 max-w-none"
        style={{ backgroundColor: 'transparent' }}
      >
        {/* Dark backdrop is handled by Dialog automatically */}
        <div className="flex items-center justify-center">
          {/* Receipt Card - Compact Achievement Moment */}
          <div
            className="relative w-[95%] max-w-[400px] bg-deep-black rounded-2xl p-5 space-y-4 shadow-2xl animate-scale-in"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(212, 175, 55, 0.1)'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-3 right-3 text-foreground/60 hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* Pint Photo or Logo */}
            <div className="w-full">
              <img
                src={displayImage}
                alt={isGSplitMode ? "Your pint" : "Gsplit logo"}
                className="w-full max-h-[280px] rounded-xl object-cover"
              />
            </div>

            {/* Split Score - ONLY show for G-Split mode */}
            {isGSplitMode && splitScore && (
              <div className="text-center">
                <span
                  className={`score-display font-display text-8xl font-black tracking-tight ${getScoreColorClass(splitScore)}`}
                >
                  {splitScore.toFixed(1)}%
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
              <p className="text-center font-display italic text-foreground/85 text-base">
                "{roast}"
              </p>
            )}

            {/* Pub Location */}
            <div className="flex items-center justify-center gap-2 text-foreground">
              <MapPin size={18} />
              <span className="font-inter text-base">{pub}</span>
            </div>

            {/* Share Button - ONLY show for G-Split mode (shareable score + image) */}
            {isGSplitMode && (
              <div className="flex justify-center pt-1">
                <Button
                  onClick={handleShare}
                  className="w-full h-11 bg-[#FFF8E7] text-[#0A0A0A] hover:bg-[#FFF8E7]/90 font-inter font-semibold text-sm"
                >
                  Share
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PintReceiptModal;
