import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Pub } from '../type/locals';
import { formatDistance } from '../utils/geolocation';

interface PubCardProps {
  pub: Pub & { distance?: number | null };
}

const PubCard: React.FC<PubCardProps> = ({ pub }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/locals/${pub.place_id}`, { state: { pub } })}
      className="bg-[#1A1A1A] border border-[#F7D447]/10 rounded-xl p-5 mb-4 cursor-pointer transition-all duration-200 ease-out hover:border-[#F7D447] group"
    >
      {/* Header Row */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 pr-3">
          <h3 className="text-xl font-bold font-serif text-white leading-tight mb-1.5 group-hover:text-[#f8d548] transition-colors">
            {pub.name}
          </h3>
          <div className="flex items-center text-[#525252]">
            <MapPin size={10} className="mr-1.5 opacity-70" />
            <p className="text-xs font-medium tracking-wide opacity-80 truncate max-w-[200px]">{pub.address}</p>
          </div>
          {pub.distance !== undefined && pub.distance !== null && (
            <p className="text-xs text-[#10B981] mt-1 font-medium">
              {formatDistance(pub.distance)} away
            </p>
          )}
        </div>

        {/* Rating Badge (Boxed - Minimal with Emoji) */}
        {pub.qualityRating && (
          <div className="flex-shrink-0 flex items-center bg-[#252525] px-2 py-1.5 rounded-lg border border-[#333]">
              <span className="text-[10px] mr-1.5 leading-none">⭐</span>
              <span className="text-xs font-bold text-[#F5F5F0] leading-none pt-0.5">{pub.qualityRating}</span>
          </div>
        )}
      </div>

      {/* Footer: Top Split Line */}
      <div className="flex items-center mt-3 pt-2 border-t border-[#2a2a2a]/30">
        <span className="text-sm mr-2 leading-none">🏆</span>
        {pub.topSplit ? (
            <div className="flex items-center">
              <span className="text-[#F5F5F0] text-xs font-medium mr-1.5">Top Split:</span>
              <span className="text-[#10B981] text-sm font-bold">{pub.topSplit.score}%</span>
              <span className="text-[#525252] text-xs mx-2">•</span>
              <span className="text-[#9CA3AF] text-xs">@{pub.topSplit.username}</span>
            </div>
        ) : (
            <span className="text-[#525252] text-xs font-medium">
            Uncharted
            </span>
        )}
      </div>
    </div>
  );
};

export default PubCard;