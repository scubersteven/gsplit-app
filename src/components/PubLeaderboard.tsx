import React from 'react';
import { LeaderboardEntry } from '../type/locals';

interface PubLeaderboardProps {
  entries: LeaderboardEntry[];
  pub?: {
    place_id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
  };
  onSplitClick?: () => void;
}

const PubLeaderboard: React.FC<PubLeaderboardProps> = ({ entries, onSplitClick }) => {
  const displayedEntries = entries?.slice(0, 5) || [];
  const hasEntries = displayedEntries.length > 0;

  return (
    <div className="mb-8">
      <div className="text-xs uppercase tracking-widest text-[#9CA3AF] font-bold mb-4">
        Top Splits
      </div>
      
      {!hasEntries ? (
        <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg bg-[#2A2A2A]">
          <h3 className="text-lg font-bold mb-1 text-[#FFF8E7]">
            🏝️ Virgin territory
          </h3>
          <p className="text-sm mb-4 text-[#9CA3AF]">
            No one's split here yet
          </p>
          {onSplitClick && (
            <button
              onClick={onSplitClick}
              className="px-4 py-2 text-sm font-semibold rounded-lg border transition-opacity hover:opacity-80 bg-[#1A1A1A] text-[#FFF8E7] border-[#F7D447]"
            >
              Split the G
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {displayedEntries.map((entry) => (
            <div key={entry.rank} className="flex items-center justify-between py-2 border-b border-[#2a2a2a] last:border-0">
              <div className="flex items-center space-x-4">
                <span className={`text-sm font-mono w-6 ${entry.rank === 1 ? 'text-[#f8d548]' : 'text-[#9CA3AF]'}`}>
                  {entry.rank}.
                </span>
                <span className="text-[#F5F5F0] font-medium">
                  {entry.username}
                </span>
              </div>
              <span className="text-[#10B981] font-bold">
                {entry.score}%
              </span>
            </div>
          ))}
          
          {(entries?.length || 0) > 5 && (
            <div className="pt-2 text-right">
              <button className="text-[#f8d548] text-sm hover:underline">
                See all →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PubLeaderboard;