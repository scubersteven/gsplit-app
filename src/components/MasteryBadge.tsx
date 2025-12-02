interface MasteryBadgeProps {
  tierName: string;
  emoji: string;
  progress: number; // 0-100 percentage
  onClick: () => void;
}

const MasteryBadge = ({ tierName, emoji, progress, onClick }: MasteryBadgeProps) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 cursor-pointer hover:shadow-[0_0_8px_rgba(212,175,55,0.3)] transition-all rounded-lg px-3 py-2"
    >
      {/* Emoji + Tier Name */}
      <span className="font-inter text-sm font-medium text-[#E8E8DD]">
        {emoji} {tierName}
      </span>

      {/* Horizontal Progress Bar */}
      <div className="relative w-16 md:w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-[#10B981] rounded-full transition-all duration-[600ms] ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Percentage Text */}
      <span className="font-inter text-xs font-normal text-[#9CA3AF]">
        {progress}%
      </span>
    </button>
  );
};

export default MasteryBadge;
