import React, { useState } from 'react';
import { Search } from 'lucide-react';
import PubCard from '../components/PubCard';
import { MOCK_PUBS } from '../constants';

const Locals: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPubs = MOCK_PUBS.filter(pub => {
    return pub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           pub.address.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="pb-32 px-4 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="mb-8 pt-8">
        <h1 className="text-4xl font-serif font-bold text-white mb-2">
          The Local Hunt
        </h1>
        <p className="text-[#E8E8DD] text-sm mb-8 font-light tracking-wide">Find where the black stuff flows best.</p>
        
        {/* Search Bar - Cleaner, less boxy */}
        <div className="relative mb-8 group">
          <div className="absolute inset-y-0 left-0 pl-0 flex items-center pointer-events-none">
            <Search 
              className="text-[#525252] group-focus-within:text-[#DDC9B4] transition-colors duration-300" 
              size={20} 
            />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pubs"
            className="w-full bg-transparent border-b border-[#2a2a2a] text-[#DDC9B4] text-base py-3 pl-8 pr-4 placeholder-[#525252] focus:outline-none focus:border-[#DDC9B4] transition-all duration-300 rounded-none"
          />
        </div>

        {/* Section Label */}
        <div className="flex items-center justify-between mb-6 px-1 mt-6">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#525252] font-bold">
            ROUND THE CORNER
          </div>
          <span className="text-[10px] text-[#525252] font-mono opacity-50">{filteredPubs.length} Nearby</span>
        </div>

        {/* List - Increased vertical gap */}
        <div className="space-y-6">
          {filteredPubs.length > 0 ? (
            filteredPubs.map(pub => (
              <PubCard key={pub.id} pub={pub} />
            ))
          ) : (
             <div className="text-center py-20 px-4">
               <p className="text-[#9CA3AF] font-serif italic text-xl mb-2">Dry as a bone.</p>
               <p className="text-[#525252] text-xs uppercase tracking-wide">No pubs match your criteria.</p>
               <button 
                 onClick={() => setSearchQuery('')}
                 className="mt-6 text-[#DDC9B4] text-sm hover:underline"
               >
                 Clear search
               </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Locals;