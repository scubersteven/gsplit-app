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
    if (score >= 80) return "#5D9B5D"; // Softer green
    if (score >= 60) return "#E8A849"; // Softer amber
    return "#C45C4B"; // Softer red
  };

  return (
    <div className="w-full h-screen flex flex-col relative bg-[#1C1410]" style={{ aspectRatio: '9/16', maxHeight: '100vh' }}>

      {/* Foam Header with Title */}
      <div className="w-full relative overflow-visible z-20">
        <div className="bg-[#F5E6C8] pt-6 pb-6 flex justify-center items-center">
          <h1 className="text-[#1C1410] text-2xl font-display font-bold tracking-wide">
            The Verdict
          </h1>
        </div>
        {/* Wavy foam line */}
        <svg
          className="absolute left-0 right-0 w-full"
          style={{ bottom: '-20px' }}
          height="25"
          viewBox="0 0 1200 25"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,12 Q100,9 200,13 Q300,10 400,14 Q500,11 600,13 Q700,10 800,14 Q900,11 1000,13 Q1100,9 1200,12 L1200,0 L0,0 Z"
            fill="#F5E6C8"
          />
        </svg>
      </div>

      {/* Content - On top of backgrounds */}
      <div className="w-full h-full relative z-10 flex flex-col items-center justify-center px-6 py-8 mt-4">

        {/* Challenge Mode Header */}
        <div className="flex flex-col items-center mb-6">
          {mode === 'challenge' && challengeTo && (
            <div className="text-[#3D2817] text-base font-bold mb-2">
              Challenge to {challengeTo}
            </div>
          )}
        </div>

        {/* Pint Photo Container */}
        <div className="w-full max-w-[280px] aspect-[3/4] rounded-lg overflow-hidden">
          <img
            src={pintImage}
            alt="Pint analysis"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Professional Stat Box */}
          <div className="w-full max-w-[280px] mt-6 px-6">
          <div className="border-2 border-[#D4AF37] rounded-lg p-4"
            style={{
              background: 'linear-gradient(135deg, #2A2A2A 0%, #242220 100%)',
              boxShadow: '0 6px 12px rgba(44, 24, 16, 0.5), 0 2px 4px rgba(44, 24, 16, 0.3), 0 0 40px rgba(212, 175, 55, 0.2)'
            }}>
            <div className="space-y-2 flex flex-col items-center">

              {/* Score - Full Width */}
              <div className="text-center">
                <div className="text-[#FFF8E7] text-xs font-body font-semibold mb-0.5">
                  🔍 Score
                </div>
                <div
                  className="text-[36px] font-body font-bold leading-none"
                  style={{
                    color: getScoreColor(score),
                    letterSpacing: '-0.02em',
                    textShadow: '0 4px 12px rgba(44, 24, 16, 0.4)'
                  }}
                >
                  {score}%
                </div>
              </div>

              {/* Left-aligned stats centered on canvas */}
              <div className="space-y-1.5 text-left pt-1 w-full max-w-[200px]">
                {/* Ranking */}
                {ranking && (
                  <div className="text-[#D4AF37] text-sm font-body font-semibold">
                    {ranking}
                  </div>
                )}

                {/* Split Status */}
                <div className="text-[#FFF8E7] text-xs font-body">
                  Split: {splitDetected ? '✅ Detected' : '❌ Not detected'}
                </div>

                {/* Location */}
                {location && (
                  <div className="text-[#FFF8E7] text-xs font-body">
                    📍 Location: {location}
                  </div>
                )}

                {/* Comment */}
                {comment && (
                  <div className="text-[#FFF8E7] text-xs font-body italic font-normal">
                    💬 "{comment}"
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
