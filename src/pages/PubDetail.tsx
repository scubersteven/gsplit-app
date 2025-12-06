import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import PubLeaderboard from '../components/PubLeaderboard';
import PubQuality from '../components/PubQuality';
import { MOCK_PUBS } from '../constants';

const PubDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { pub: dynamicPub } = location.state || {};

  const [pub, setPub] = React.useState<typeof dynamicPub | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Fetch pub data from API
  React.useEffect(() => {
    const fetchPub = async () => {
      try {
        const response = await fetch(`https://g-split-judge-production.up.railway.app/api/pubs/${id}`);

        if (response.ok) {
          const data = await response.json();
          setPub(data);
        } else {
          // Pub not in database, try MOCK_PUBS or dynamicPub
          const mockPub = MOCK_PUBS.find(p => p.id === id);
          setPub(mockPub || dynamicPub || null);
        }
      } catch (error) {
        console.error('Failed to fetch pub:', error);
        // Fallback to MOCK_PUBS or dynamicPub
        const mockPub = MOCK_PUBS.find(p => p.id === id);
        setPub(mockPub || dynamicPub || null);
      } finally {
        setLoading(false);
      }
    };

    fetchPub();
  }, [id, dynamicPub]);

  if (!pub) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-[#9CA3AF] px-4">
        <p className="text-xl font-serif mb-2 text-[#DDC9B4]">New territory.</p>
        <p className="mb-6 text-sm text-[#525252]">Be the first to log a pint here!</p>
        <button
          onClick={() => navigate('/locals')}
          className="text-[#f8d548] hover:underline"
        >
          Return to list
        </button>
      </div>
    );
  }

  return (
    <div className="pb-32 pt-2 px-4 animate-in slide-in-from-right-4 duration-300">
      {/* Navigation */}
      <button 
        onClick={() => navigate('/locals')}
        className="flex items-center text-[#9CA3AF] hover:text-[#DDC9B4] transition-colors mb-6 group"
      >
        <ChevronLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back</span>
      </button>

      {/* Pub Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#DDC9B4] mb-2 leading-tight">
          {pub.name}
        </h1>
        <p className="text-[#9CA3AF] text-sm">
          {pub.address}
        </p>
      </div>

      {/* Main Content Sections */}
      <PubLeaderboard entries={pub.leaderboard} />
      
      <div className="w-full h-px bg-[#2a2a2a] my-8" />
      
      <PubQuality 
        rating={pub.qualityRating} 
        count={pub.pintsLogged}
        stats={pub.stats}
      />
      
    </div>
  );
};

export default PubDetail;