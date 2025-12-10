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
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[date.getMonth()];
    const day = date.getDate();

    return `${month} ${day}`;
  };

  return (
    <div
      onClick={onClick}
      className="relative group bg-card border border-[#2A2A2A] rounded-xl p-5 shadow-[0_4px_6px_rgba(0,0,0,0.3)] transition-all hover:border-[#F7D447] cursor-pointer"
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
          className="absolute top-3 right-3 flex-shrink-0 text-xs text-[#9CA3AF] cursor-pointer hover:text-[#F7D447] transition-colors"
        >
          Unrated
        </div>
      )}

      <div className="flex gap-4">
        {/* Photo Section */}
        <div className="flex-shrink-0 self-stretch">
          <div className="w-[100px] md:w-[140px] h-full rounded-lg overflow-hidden border border-[#2A2A2A]">
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
          {/* Top Section - Score, Feedback, Metadata */}
          <div>
            {/* Header Row: Score */}
            <div className="flex items-start gap-3">
              {/* Score */}
              <div className={`score-display font-display font-extrabold text-4xl leading-none tracking-tight ${getScoreColor(score)}`}>
                {isPersonalBest && "🏆 "}{score}%
              </div>
            </div>

            {/* Feedback Quote */}
            <p className="mt-2 font-serif text-base md:text-lg italic text-foreground">
              "{feedback}"
            </p>

            {/* Metadata */}
            <div className="mt-2 font-inter text-xs font-semibold text-foreground/60">
              {location && location.length > 2 ? (
                <><span className="text-xs">📍</span> {location} • {formatDate(date)}</>
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
