import React from 'react';

interface TierProgressProps {
  tier: string;
  emoji: string;
  progress: number;
  onTap?: () => void;
}

const TierProgress: React.FC<TierProgressProps> = ({ tier, emoji, progress, onTap }) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div
      className="flex items-center w-full gap-3 font-body cursor-pointer"
      onClick={onTap}
    >
      <div className="flex items-center flex-shrink-0">
        <span className="text-base mr-2 leading-none">{emoji}</span>
        <span className="text-[#E8E8DD] text-sm font-medium">{tier}</span>
      </div>

      <div className="flex-grow bg-[#2A2A2A] h-2 rounded-sm overflow-hidden">
        <div
          className="bg-[#F7D447] h-full rounded-sm transition-all duration-500 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>

      <div className="text-[#E8E8DD] text-sm font-medium flex-shrink-0 min-w-[32px] text-right">
        {Math.round(clampedProgress)}%
      </div>
    </div>
  );
};

export default TierProgress;
