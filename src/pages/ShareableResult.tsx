import React, { useState } from 'react';

interface ShareableResultProps {
  score: number;
  pintImage: string;
  comment?: string;
  location?: string;
  ranking?: string | number;
  streakDays?: number;
  splitDetected?: boolean;
  mode?: 'share' | 'challenge';
  challengeTo?: string;
}

const ShareableResult: React.FC<ShareableResultProps> = ({
  score,
  pintImage,
  comment,
  location,
  ranking,
  streakDays,
  splitDetected,
  mode,
  challengeTo
}) => {
  const [frameError, setFrameError] = useState(false);

  // Parse ranking to number
  const getRankNumber = (ranking?: string | number): number => {
    if (typeof ranking === 'number') return ranking;
    if (typeof ranking === 'string') {
      const match = ranking.match(/\d+/);
      return match ? parseInt(match[0]) : 35;
    }
    return 35;
  };

  // Fallback values
  const displayComment = comment || "Nice pour";
  const displayLocation = location;
  const displayStreakDays = streakDays || 1;
  const rankNumber = getRankNumber(ranking);

  // Streak pluralization
  const streakText = displayStreakDays === 1 ? '1 day' : `${displayStreakDays} days`;

  // Color Logic: <60 Red, 60-84 Gold, 85+ Green
  let scoreColor = '#F59E0B'; // Gold (Default/Middle)
  if (score < 60) scoreColor = '#EF4444'; // Red
  else if (score >= 85) scoreColor = '#10B981'; // Green

  return (
    <div className="w-[1080px] h-[1920px] flex flex-col relative overflow-hidden">

        {/* --- TOP SECTION: CREAM (58%) --- */}
        <div className="h-[58%] w-full bg-[#FFF8E7] flex flex-col items-center justify-start relative overflow-hidden pt-8">

            {/* THE MASTERPIECE FRAME */}
            <div className="relative h-[92%] aspect-[5/6] drop-shadow-2xl">

                {/* A. The Gold Frame (Top Layer - z-20) */}
                <div className="relative z-20 w-full h-full">
                    {!frameError ? (
                        <img
                            src="https://i.imgur.com/1DEGVvK.png"
                            alt="Baroque Frame"
                            className="w-full h-full object-fill pointer-events-none"
                            onError={() => setFrameError(true)}
                        />
                    ) : (
                        <div className="w-full h-full border-[6px] border-[#F59E0B] rounded-lg" />
                    )}
                </div>

                {/* B. The User Photo (Bottom Layer - z-10) */}
                <div className="absolute top-[15%] left-[17%] w-[66%] h-[70%] z-10 bg-black rounded-lg overflow-hidden">
                    <img
                        src={pintImage}
                        alt="Pint"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 shadow-[inset_0_0_8px_rgba(0,0,0,0.25)] pointer-events-none"></div>
                </div>
            </div>
        </div>

        {/* --- BOTTOM SECTION: BLACK (36%) --- */}
        <div className="flex-1 w-full bg-[#1A1A1A] flex flex-col items-center px-6 pt-4">

            {/* SCORE */}
            <div className="relative z-30 mb-3">
                <span
                    className="font-serif font-bold text-[140px] leading-none tracking-tighter drop-shadow-lg"
                    style={{ color: scoreColor }}
                >
                    {score}%
                </span>
            </div>

            {/* ROAST QUOTE */}
            <div className="text-center mb-3 max-w-[95%]">
                <p className="font-serif italic font-normal text-[#E8E8DD] text-[42px] leading-snug">
                    "{displayComment}"
                </p>
            </div>

            {/* CONTEXT LINE */}
            <div className="flex items-center justify-center gap-4 text-[#9CA3AF] font-sans text-[28px] font-medium tracking-wide w-full">
                <span className="whitespace-nowrap">🔥 {streakText}</span>
                {displayLocation && (
                    <>
                        <span className="text-[24px]">•</span>
                        <span className="truncate max-w-[400px]">📍 {displayLocation}</span>
                    </>
                )}
                <span className="text-[24px]">•</span>
                <span className="whitespace-nowrap">Top {rankNumber}%</span>
            </div>

            {/* FOOTER */}
            <div className="pb-10 pt-4">
                <span className="font-sans text-[28px] font-medium tracking-wide text-[#F5F5F0]">
                    GSplit.app
                </span>
            </div>
        </div>
    </div>
  );
};

export default ShareableResult;
