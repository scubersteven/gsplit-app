import React from 'react';
import { Star } from 'lucide-react';
import { COLORS } from '../constants';
import { PubStats } from '../type/locals';

interface PubQualityProps {
  rating: number | null;
  count: number;
  stats?: PubStats;
  pub?: {
    place_id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
  };
  onRateClick?: () => void;
}

const PubQuality: React.FC<PubQualityProps> = ({ rating, count, stats, onRateClick }) => {
  const getBestCategoryText = () => {
    if (!stats) return null;
    
    const categories: Array<keyof PubStats> = ['taste', 'temperature', 'head'];
    // Sort by average descending
    const bestCategory = categories.sort((a, b) => stats[b].average - stats[a].average)[0];
    
    const percent = Math.round(stats[bestCategory].percentGood);
    const name = bestCategory === 'temperature' ? 'temps' : bestCategory;
    
    return `${percent}% rated the ${name} 4+`;
  };

  const oneLiner = getBestCategoryText();

  return (
    <div className="mb-8">
      <div className="text-xs uppercase tracking-widest text-[#9CA3AF] font-bold mb-4">
        Pour Quality
      </div>

      {!rating ? (
        <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg bg-[#2A2A2A]">
          <h3 className="text-lg font-bold mb-1 text-[#FFF8E7]">
            ⚖️ Unrated
          </h3>
          <p className="text-sm mb-4 text-[#9CA3AF]">
            How's the pour?
          </p>
          {onRateClick && (
            <button
              onClick={onRateClick}
              className="px-4 py-2 text-sm font-semibold rounded-lg border transition-opacity hover:opacity-80 bg-[#1A1A1A] text-[#FFF8E7] border-[#F7D447]"
            >
              Rate Your Pint
            </button>
          )}
        </div>
      ) : (
        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2a2a2a]">
          <div className="flex items-center mb-3">
            <div className="flex mr-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  className="mr-1"
                  fill={star <= Math.round(rating) ? COLORS.satinGold : 'none'}
                  color={star <= Math.round(rating) ? COLORS.satinGold : '#2a2a2a'}
                />
              ))}
            </div>
            <span className="text-2xl font-bold text-[#F5F5F0]">{rating}</span>
          </div>
          
          {oneLiner && (
            <div className="text-[#E8E8DD] text-sm mb-3 font-medium">
               {oneLiner}
            </div>
          )}

          <div className="text-[#9CA3AF] text-sm">
            {count} pints logged
          </div>
        </div>
      )}
    </div>
  );
};

export default PubQuality;