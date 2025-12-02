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
          <div className="font-inter text-xs md:text-sm font-semibold text-foreground mb-2">
            Avg
          </div>
          <div className="font-inter text-2xl md:text-3xl font-bold text-white leading-none">
            {averageScore.toFixed(1)}%
          </div>
        </div>

        {/* Best Score */}
        <div className="text-center">
          <div className="font-inter text-xs md:text-sm font-semibold text-foreground mb-2">
            Best
          </div>
          <div className="font-inter text-2xl md:text-3xl font-bold text-white leading-none">
            {bestScore.toFixed(1)}%
          </div>
        </div>

        {/* Total Pints Logged */}
        <div className="text-center">
          <div className="font-inter text-xs md:text-sm font-semibold text-foreground mb-2">
            Pints
          </div>
          <div className="font-inter text-2xl md:text-3xl font-bold text-white leading-none">
            {totalPints}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;

