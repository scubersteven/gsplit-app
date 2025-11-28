import logo from "@/assets/g-split-logo.png";

interface ShareableResultProps {
  score: number;
  splitDetected: boolean;
  comment?: string;
  location?: string;
  ranking?: string;
  mode?: 'share' | 'challenge';
  challengeTo?: string;
  pintImage: string; // Required - always passed from shareImageV2
}

const ShareableResult = ({
  score = 86.9,
  splitDetected = true,
  comment = "Decent pour",
  location = "Temple Bar",
  ranking = "Top 11% this week",
  mode = 'share',
  challengeTo,
  pintImage
}: ShareableResultProps) => {

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#36B37E"; // Irish green - vibrant!
    if (score >= 60) return "#E8A849"; // Softer amber
    return "#C45C4B"; // Softer red
  };

  return (
    <div className="w-[1080px] h-[1920px] flex flex-col relative bg-[#1C1410]">

      {/* Foam Header - "The Verdict" */}
      <div className="w-full mb-0 relative overflow-hidden">
        <div className="bg-[#fdecd0] pt-20 pb-14 flex flex-col justify-center items-center gap-3">
          <h1 className="text-[#1C1410] text-7xl font-display font-bold tracking-wide">
            The Verdict
          </h1>
          {comment && (
            <p className="text-[#1C1410]/70 text-2xl font-body italic font-normal text-center px-8">
              "{comment}"
            </p>
          )}
        </div>
      </div>

      {/* Content Container */}
      <div className="w-full relative z-10 flex flex-col items-center px-8 py-8">

        {/* Pint Photo Container */}
        <div className="w-full max-w-[750px] h-[950px] rounded-lg overflow-hidden shadow-lg flex items-center justify-center bg-black/10">
          <img
            src={pintImage}
            alt="Pint analysis"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Stats Box */}
        <div className="w-full max-w-[750px] mt-8">
          <div className="border-2 border-[#D4AF37] rounded-lg p-6"
            style={{
              background: 'linear-gradient(135deg, #2A2A2A 0%, #242220 100%)',
              boxShadow: '0 6px 12px rgba(44, 24, 16, 0.5), 0 2px 4px rgba(44, 24, 16, 0.3), 0 0 20px rgba(212, 175, 55, 0.15)'
            }}>
            <div className="space-y-4 flex flex-col items-center">

              {/* Score - BIGGER */}
              <div className="text-center">
                <div
                  className="text-[80px] font-body font-black leading-none"
                  style={{
                    color: getScoreColor(score),
                    letterSpacing: '-0.02em',
                    textShadow: '0 4px 12px rgba(44, 24, 16, 0.4)'
                  }}
                >
                  {score.toFixed(1)}%
                </div>
              </div>

              {/* Centered stats */}
              <div className="space-y-1.5 text-center pt-2 w-full">
                {/* Ranking */}
                {ranking && (
                  <div>
                    <span className="text-[#D4AF37] text-lg font-body font-semibold">
                      Rank: {ranking}
                    </span>
                  </div>
                )}

                {/* Split Status */}
                <div>
                  <span className="text-[#FFF8E7] text-base font-body font-semibold">
                    Split detected: {splitDetected ? '✅' : '❌'}
                  </span>
                </div>

                {/* Location */}
                {location && (
                  <div>
                    <span className="text-[#FFF8E7] text-base font-body font-semibold">
                      Location 📍: {location}
                    </span>
                  </div>
                )}
              </div>

              {/* Challenge Mode Callout */}
              {mode === 'challenge' && (
                <div className="text-[#FFF8E7] text-xs font-ui font-semibold tracking-wider text-center pt-1">
                  CAN YOU BEAT THIS?
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Logo watermark */}
        <div className="absolute bottom-4 right-6 flex items-center gap-2">
          <img
            src={logo}
            alt="Gsplit"
            className="h-8 w-auto opacity-60"
          />
        </div>
      </div>
    </div>
  );
};

export default ShareableResult;
