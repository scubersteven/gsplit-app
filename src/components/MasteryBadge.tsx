interface MasteryBadgeProps {
  tierName: string;
  emoji: string;
  progress: number; // 0-100 percentage
  onClick: () => void;
}

const MasteryBadge = ({ tierName, emoji, progress, onClick }: MasteryBadgeProps) => {
  // SVG circle properties
  const size = 24; // Will use Tailwind responsive classes for 22px on mobile
  const strokeWidth = 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 cursor-pointer hover:shadow-[0_0_8px_rgba(212,175,55,0.3)] transition-shadow rounded-full px-2 py-1"
    >
      {/* Progress Ring */}
      <div className="relative w-6 h-6 md:w-7 md:h-7 flex-shrink-0">
        <svg
          className="w-full h-full -rotate-90"
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background circle (unfilled portion) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="rgba(255, 255, 255, 0.1)"
            stroke="none"
          />

          {/* Border ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#D4AF37"
            strokeWidth={strokeWidth}
          />

          {/* Progress fill */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius - strokeWidth / 2}
            fill="none"
            stroke="#10B981"
            strokeWidth={strokeWidth - 0.5}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Emoji overlay - only show on larger screens */}
        <div className="absolute inset-0 flex items-center justify-center text-[10px] md:text-xs">
          {emoji}
        </div>
      </div>

      {/* Tier Name */}
      <span className="font-inter text-sm font-medium text-[#E8E8DD]">
        {tierName}
      </span>
    </button>
  );
};

export default MasteryBadge;
