import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
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
  onDelete?: (id: number) => void;
}

/**
 * Format date to readable string (just date, no time)
 */
const formatDateOnly = (dateString: string): string => {
  const date = new Date(dateString);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[date.getMonth()];
  const day = date.getDate();
  return `${month} ${day}`;
};

/**
 * Format date with time for share image
 */
const formatDateTime = (dateString: string): string => {
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

const PintCardModal = ({ open, onOpenChange, pintData, onDelete }: PintCardModalProps) => {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  if (!open || !pintData) return null;

  // Color Logic
  let scoreColor = '#F59E0B'; // Gold
  if (pintData.score < 60) scoreColor = '#EF4444'; // Red
  else if (pintData.score >= 85) scoreColor = '#10B981'; // Green

  // Context Logic
  const dateOnly = formatDateOnly(pintData.date);
  const hasLocation = pintData.location && pintData.location.length > 2;
  const contextText = hasLocation
    ? `📍 ${pintData.location} • ${dateOnly}`
    : dateOnly;

  // Share Handler (preserved from original)
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
        date: formatDateTime(pintData.date),
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

  // Delete Handler
  const handleDelete = () => {
    if (onDelete && pintData) {
      onDelete(pintData.id);
      onOpenChange(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-[320px] bg-[#1A1A1A] rounded-2xl pt-6 px-4 pb-4 flex flex-col items-center animate-in zoom-in-95 duration-200 shadow-2xl border border-[#2a2a2a]">
        {/* Close Button */}
        <div className="w-full flex justify-end mb-2 -mt-2">
          <button
            onClick={() => onOpenChange(false)}
            className="text-[#525252] hover:text-[#F5F5F0] transition-colors p-1 rounded-full hover:bg-[#2a2a2a]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Pint Image */}
        <div className="w-full mb-4 flex justify-center">
          <div className="rounded-lg overflow-hidden shadow-lg border border-[#2a2a2a]">
            <img
              src={pintData.image}
              alt="Pint Detail"
              className="w-auto h-auto max-w-full max-h-[280px] object-contain transition-transform duration-300 hover:scale-105 block"
            />
          </div>
        </div>

        {/* Score */}
        <div className="mb-1.5">
          <span
            className="font-serif font-bold leading-none tracking-tighter"
            style={{ fontSize: '56px', color: scoreColor }}
          >
            {pintData.score}%
          </span>
        </div>

        {/* Feedback Quote */}
        <div className="mb-2.5 text-center w-full px-1">
          <p className="font-serif italic text-[16px] text-[#E8E8DD] leading-tight line-clamp-2">
            "{pintData.feedback}"
          </p>
        </div>

        {/* Context (Location + Date) */}
        <div className="mb-4 text-center">
          <p className="font-sans text-[13px] font-medium text-[#9CA3AF] tracking-wide">
            {contextText}
          </p>
        </div>

        {/* Buttons */}
        <div className="w-full space-y-3">
          {/* Share Button */}
          <button
            onClick={handleShare}
            disabled={isGeneratingImage}
            className="w-full bg-[#2A2A2A] hover:bg-[#333333] border border-[#444] text-[#F5F5F0] font-bold py-3 rounded-lg text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingImage ? "Generating..." : "Share"}
          </button>

          {/* Delete Button */}
          {onDelete && (
            <div className="text-center">
              <button
                onClick={handleDelete}
                className="text-[#EF4444] text-xs font-medium hover:text-[#ff6b6b] transition-colors opacity-80 hover:opacity-100"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PintCardModal;
