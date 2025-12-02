import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DisplayStars from "@/components/DisplayStars";

interface PintCardProps {
  id: number;
  image: string;
  score: number;
  splitDetected: boolean;
  feedback: string;
  location: string | null;
  date: string;
  surveyComplete: boolean;
  overallRating?: number | null;
  onClick?: () => void;
}

const PintCard = ({
  id,
  image,
  score,
  splitDetected,
  feedback,
  location,
  date,
  surveyComplete,
  overallRating,
  onClick,
}: PintCardProps) => {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const handleCompleteRating = () => {
    navigate("/survey", {
      state: {
        pintLogId: id,
        splitScore: score,
        splitImage: image,
      },
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-score-excellent";
    if (score >= 60) return "text-score-good";
    return "text-score-poor";
  };

  const formatDate = (dateString: string) => {
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

  return (
    <div
      onClick={onClick}
      className="bg-card border border-harp-gold/20 rounded-xl p-4 shadow-[0_4px_6px_rgba(0,0,0,0.3)] transition-all hover:border-harp-gold/40 cursor-pointer"
    >
      <div className="flex gap-4">
        {/* Photo Section */}
        <div className="flex-shrink-0 self-stretch">
          <div className="w-[100px] md:w-[140px] h-full rounded-lg overflow-hidden border border-harp-gold/10">
            {!imageError ? (
              <img
                src={image}
                alt="Guinness pint"
                loading="lazy"
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-deep-black flex items-center justify-center text-4xl">
                🍺
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          {/* Score */}
          <div className={`font-inter font-bold leading-none ${getScoreColor(score)} text-4xl md:text-5xl`}>
            {score}%
          </div>

          {/* Star Rating - show when overallRating exists */}
          {overallRating && (
            <div className="flex items-center gap-2 mt-2">
              <DisplayStars value={overallRating} maxStars={5} size={20} />
              <span className="text-lg font-bold text-foreground">
                {overallRating.toFixed(1)}
              </span>
            </div>
          )}

          {/* Feedback Quote */}
          <p className="mt-2 font-inter text-base md:text-lg italic text-foreground">
            "{feedback}"
          </p>

          {/* Metadata */}
          <div className="mt-2 font-inter text-sm font-semibold text-foreground/60">
            {location ? (
              <>📍 {location} • {formatDate(date)}</>
            ) : (
              formatDate(date)
            )}
          </div>

          {/* Complete Rating Button */}
          {!surveyComplete && (
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handleCompleteRating();
              }}
              className="mt-3 bg-[#FFF8E7] border-[#FFF8E7] text-[#0A0A0A] hover:bg-[#FFF8E7]/90 font-inter text-xs font-medium px-3 py-1.5 h-auto"
            >
              Rate this Pint
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PintCard;
