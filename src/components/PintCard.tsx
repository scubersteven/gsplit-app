import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  isPersonalBest?: boolean;
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
  isPersonalBest,
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
    const now = new Date();

    // Reset time components for accurate day comparison
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const diffTime = nowOnly.getTime() - dateOnly.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays <= 3) return `${diffDays} days ago`;

    // 3+ days: show actual date
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[date.getMonth()];
    const day = date.getDate();
    return `${month} ${day}`;
  };

  return (
    <div
      onClick={onClick}
      className="relative group bg-card border border-[#2A2A2A] rounded-xl p-2.5 shadow-[0_4px_6px_rgba(0,0,0,0.3)] transition-all hover:border-[#F7D447] cursor-pointer"
    >
      {/* Star Rating Badge OR Unrated Badge - absolute top right */}
      {overallRating ? (
        <div className="absolute top-3 right-3 flex-shrink-0 flex items-center bg-[#252525] px-2 py-1.5 rounded-lg border border-[#333]">
          <span className="text-[10px] mr-1.5 leading-none">⭐</span>
          <span className="text-xs font-bold text-[#F5F5F0] leading-none pt-0.5">
            {overallRating.toFixed(1)}
          </span>
        </div>
      ) : (
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleCompleteRating();
          }}
          className="absolute top-3 right-3 flex-shrink-0 text-[13px] text-cream cursor-pointer hover:underline transition-all"
        >
          Rate →
        </div>
      )}

      <div className="flex gap-4">
        {/* Photo Section */}
        <div className="flex-shrink-0 self-stretch">
          <div className="w-[80px] md:w-[120px] h-[120px] md:h-[140px] rounded-lg overflow-hidden border border-[#2A2A2A]">
            {!imageError ? (
              <img
                src={image}
                alt="Guinness pint"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          {/* Score */}
          <div className={`score-display font-display font-extrabold text-4xl md:text-5xl leading-none tracking-tight ${getScoreColor(score)}`}>
            {isPersonalBest && "🏆 "}{score}%
          </div>

          {/* Feedback + Date Group */}
          <div className="flex flex-col gap-0.5">
            {/* Feedback Quote */}
            <p className="font-serif text-base md:text-lg italic text-foreground line-clamp-2">
              "{feedback}"
            </p>

            {/* Metadata */}
            <div className="font-inter text-sm font-semibold text-foreground/60">
              {location && location.length > 2 ? (
                <>{location} • {formatDate(date)}</>
              ) : (
                formatDate(date)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PintCard;
