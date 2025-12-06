import React from 'react';
import { LeaderboardEntry } from '../type/locals';

interface PubLeaderboardProps {
  entries: LeaderboardEntry[];
}

const PubLeaderboard: React.FC<PubLeaderboardProps> = ({ entries }) => {
  const displayedEntries = entries?.slice(0, 5) || [];
  const hasEntries = displayedEntries.length > 0;

  return (
    <div className="mb-8">
      <div className="text-xs uppercase tracking-widest text-[#9CA3AF] font-bold mb-4">
        Top Splits
      </div>
      
      {!hasEntries ? (
        <div className="p-4 rounded-lg border border-dashed border-[#2a2a2a] text-center">
          <p className="text-[#F5F5F0] font-medium">Uncharted</p>
          <p className="text-[#9CA3AF] text-sm mt-1">Be the first to claim it.</p>
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