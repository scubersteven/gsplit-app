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
  streakDays = 1,
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

  const rankNumber = getRankNumber(ranking);
  const streakText = streakDays === 1 ? '1 day' : `${streakDays} days`;

  // Color Logic
  let scoreColor = '#F59E0B'; // Gold (60-84)
  if (score < 60) scoreColor = '#EF4444'; // Red
  else if (score >= 85) scoreColor = '#10B981'; // Green

  return (
    <div
      style={{
        width: '1080px',
        height: '1920px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* --- TOP SECTION: CREAM (1100px) --- */}
      <div
        style={{
          width: '100%',
          height: '1100px',
          backgroundColor: '#FFF8E7',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Frame Container: 900px wide */}
        <div
          style={{
            position: 'relative',
            width: '900px',
            aspectRatio: '5/6',
            filter: 'drop-shadow(0 25px 25px rgba(0,0,0,0.25))',
          }}
        >
          {/* A. Gold Frame (Top Layer) */}
          <div
            style={{
              position: 'relative',
              zIndex: 20,
              width: '100%',
              height: '100%',
            }}
          >
            {!frameError ? (
              <img
                src="https://i.imgur.com/1DEGVvK.png"
                alt="Baroque Frame"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'fill',
                  pointerEvents: 'none',
                }}
                onError={() => setFrameError(true)}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  border: '20px solid #F59E0B',
                  borderRadius: '40px',
                }}
              />
            )}
          </div>

          {/* B. User Photo (Bottom Layer) */}
          <div
            style={{
              position: 'absolute',
              zIndex: 10,
              top: '15%',
              left: '17%',
              width: '66%',
              height: '70%',
              backgroundColor: '#000',
              overflow: 'hidden',
              borderRadius: '50px',
            }}
          >
            <img
              src={pintImage}
              alt="Pint"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        </div>
      </div>

      {/* --- BOTTOM SECTION: BLACK (820px) --- */}
      <div
        style={{
          width: '100%',
          height: '820px',
          backgroundColor: '#1A1A1A',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 48px',
        }}
      >
        {/* 1. SCORE */}
        <div style={{ marginBottom: '24px' }}>
          <span
            style={{
              fontFamily: 'Playfair Display, serif',
              fontWeight: 'bold',
              fontSize: '160px',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              color: scoreColor,
              textShadow: '0 4px 12px rgba(0,0,0,0.5)',
            }}
          >
            {score}%
          </span>
        </div>

        {/* 2. ROAST QUOTE */}
        <div
          style={{
            marginBottom: '40px',
            textAlign: 'center',
            maxWidth: '900px',
          }}
        >
          <p
            style={{
              fontFamily: 'Playfair Display, serif',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: '48px',
              lineHeight: 1.3,
              color: '#E8E8DD',
            }}
          >
            "{comment || 'Nice pour'}"
          </p>
        </div>

        {/* 3. CONTEXT LINE */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            fontSize: '32px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            color: '#9CA3AF',
          }}
        >
          <span>🔥 {streakText}</span>
          {location && (
            <>
              <span style={{ opacity: 0.5 }}>•</span>
              <span>📍 {location}</span>
            </>
          )}
          <span style={{ opacity: 0.5 }}>•</span>
          <span>Top {rankNumber}%</span>
        </div>

        {/* Spacer */}
        <div style={{ height: '80px' }}></div>

        {/* 4. FOOTER */}
        <div style={{ opacity: 0.8 }}>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: '32px',
              color: '#F5F5F0',
            }}
          >
            GSplit.app
          </span>
        </div>
      </div>
    </div>
  );
};

export default ShareableResult;
