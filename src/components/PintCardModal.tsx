import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, MapPin } from "lucide-react";
import { toast } from "sonner";
import DisplayStars from "@/components/DisplayStars";
import { generatePintShareImage } from "@/utils/sharePintImage";

interface PintCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pintData: {
    id: number;
    image: string;
    score: number;
    splitDetected: boolean;
    feedback: string;
    location: string | null;
    date: string;
    overallRating?: number | null;
  } | null;
}

/**
 * Get score color class based on thresholds
 */
const getScoreColor = (score: number): string => {
  if (score >= 80) return "text-score-excellent";
  if (score >= 60) return "text-score-good";
  return "text-score-poor";
};

/**
 * Format date to readable string
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  const displayHours = hours % 12 || 12;
  return `${month} ${day}, ${displayHours}:${minutes}${ampm}`;
};

const PintCardModal = ({ open, onOpenChange, pintData }: PintCardModalProps) => {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  if (!pintData) return null;

  const handleShare = async () => {
    setIsGeneratingImage(true);
    try {
      // Generate canvas image with pint data
      const imageBlob = await generatePintShareImage({
        pintImage: pintData.image,
        score: pintData.score,
        rating: pintData.overallRating || 0,
        feedback: pintData.feedback,
        location: pintData.location || '',
        date: formatDate(pintData.date),
      });

      // Try native share (mobile)
      if (navigator.share && navigator.canShare) {
        const file = new File([imageBlob], 'my-pint.png', { type: 'image/png' });

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'My GSPLIT Score',
            text: `I scored ${pintData.score}% on the Split the G!`,
          });
          toast.success("Share successful!");
          return;
        }
      }

      // Fallback: Download image (desktop)
      const url = URL.createObjectURL(imageBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'my-pint.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Image downloaded!");
    } catch (error) {
      console.error('Share failed:', error);
      toast.error("Failed to share image");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-transparent border-0 shadow-none p-0 max-w-[380px] [&>button]:hidden">
        <div className="relative w-[95%] max-w-[380px] max-h-[70vh] overflow-y-auto bg-deep-black border-2 border-harp-gold rounded-2xl p-6 animate-scale-in">
          {/* Close Button - Top Right */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 z-10 text-foreground/60 hover:text-foreground transition-colors"
          >
            <X size={24} />
          </button>

          {/* Vertical Compact Layout */}
          <div className="flex flex-col gap-4 mt-8">
            {/* Pint Image */}
            <img
              src={pintData.image}
              alt="Pint"
              className="w-full h-[280px] rounded-xl object-cover border-2 border-harp-gold/30"
            />

            {/* Content */}
            <div className="flex flex-col gap-4">
              {/* Score */}
              <div className={`text-5xl font-bold ${getScoreColor(pintData.score)}`}>
                {pintData.score}%
              </div>

              {/* Star Rating */}
              {pintData.overallRating && pintData.overallRating > 0 && (
                <div>
                  <DisplayStars value={pintData.overallRating} size={28} />
                </div>
              )}

              {/* Feedback */}
              {pintData.feedback && (
                <p className="text-lg italic text-foreground/90 leading-relaxed">
                  "{pintData.feedback}"
                </p>
              )}

              {/* Location & Date */}
              <div className="space-y-2 text-base text-foreground/60">
                {pintData.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={20} className="flex-shrink-0 text-[#D40003]" />
                    <span>{pintData.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span>{formatDate(pintData.date)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Share Button - Bottom */}
          <Button
            onClick={handleShare}
            disabled={isGeneratingImage}
            className="w-full mt-6 h-12 bg-[#FFF8E7] text-[#0A0A0A] hover:bg-[#FFF8E7]/90 font-semibold rounded-lg transition-colors active:bg-[#FFF8E7]/80"
          >
            {isGeneratingImage ? "Generating..." : "Share Pint"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PintCardModal;
