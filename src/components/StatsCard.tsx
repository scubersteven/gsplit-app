interface StatsCardProps {
  averageScore: number;
  bestScore: number;
  totalPints: number;
}

const StatsCard = ({ averageScore, bestScore, totalPints }: StatsCardProps) => {
  return (
    <div className="bg-deep-black border border-harp-gold/20 rounded-xl p-6 shadow-[0_4px_6px_rgba(0,0,0,0.3)] mb-8">
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        {/* Average Score */}
        <div className="text-center">
          <div className="text-2xl mb-2">📊</div>
          <div className="font-inter text-3xl md:text-5xl font-bold text-score-good leading-none">
            {averageScore}%
          </div>
          <div className="font-inter text-sm font-semibold text-foam-cream/60 mt-2 uppercase tracking-wide">
            AVERAGE
          </div>
        </div>

        {/* Best Score */}
        <div className="text-center">
          <div className="text-2xl mb-2">🏆</div>
          <div className="font-inter text-3xl md:text-5xl font-bold text-score-excellent leading-none">
            {bestScore}%
          </div>
          <div className="font-inter text-sm font-semibold text-foam-cream/60 mt-2 uppercase tracking-wide">
            BEST
          </div>
        </div>

        {/* Total Pints Logged */}
        <div className="text-center">
          <div className="text-2xl mb-2">🍺</div>
          <div className="font-inter text-3xl md:text-5xl font-bold text-harp-gold leading-none">
            {totalPints}
          </div>
          <div className="font-inter text-sm font-semibold text-foam-cream/60 mt-2 uppercase tracking-wide">
            LOGGED
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;

