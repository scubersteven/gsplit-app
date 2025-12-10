import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://gsplit-production.up.railway.app';

interface SubmissionData {
  id: string;
  twitter_handle: string;
  image_url: string;
  score: number;
  roast: string;
  created_at: string;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "#10B981"
  if (score >= 60) return "#F59E0B"
  return "#EF4444"
}

export default function TwitterResult() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<SubmissionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubmission() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/twitter/${id}`);
        if (!response.ok) {
          throw new Error('Submission not found');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    }
    fetchSubmission();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <p className="text-[#FFF8E7]">Loading...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <p className="text-[#EF4444]">{error || 'Not found'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center p-6">
      <div className="w-full max-w-[400px] flex flex-col items-center gap-6">
        <div className="text-center">
          <span className="font-serif font-bold text-7xl md:text-8xl" style={{ color: getScoreColor(data.score) }}>
            {data.score}%
          </span>
        </div>
        <p className="text-[#FFF8E7] text-lg italic text-center font-sans leading-relaxed">"{data.roast}"</p>
        <p className="text-[#9CA3AF] text-sm font-sans">{data.twitter_handle}'s split</p>
        <div className="w-full aspect-[3/4] rounded-lg border border-[#2A2A2A] overflow-hidden">
          <img src={data.image_url} alt="Pint" className="w-full h-full object-cover" />
        </div>
        <a
          href="/"
          className="mt-2 px-8 py-3 rounded-[8px] border border-[#F7D447] bg-[#1A1A1A] text-[#FFF8E7] font-sans font-semibold transition-colors hover:bg-[#F7D447]/10"
        >
          Score your own
        </a>
        <p className="text-[#6B7280] text-xs font-sans mt-2">gsplit.app</p>
      </div>
    </div>
  );
}
