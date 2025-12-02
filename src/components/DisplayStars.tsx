import { Star } from "lucide-react";

interface DisplayStarsProps {
  value: number;
  size?: number;
  maxStars?: number;
}

const DisplayStars = ({
  value,
  size = 24,
  maxStars = 5,
}: DisplayStarsProps) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: maxStars }, (_, index) => {
        const fillPercentage = Math.min(
          Math.max((value - index) * 100, 0),
          100
        );

        return (
          <div key={index} className="relative" style={{ width: size, height: size }}>
            {/* Empty star (outline) */}
            <Star
              className="absolute inset-0 text-harp-gold stroke-harp-gold"
              style={{ width: size, height: size }}
              strokeWidth={1.5}
              fill="transparent"
            />
            {/* Filled star with clip */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fillPercentage}%` }}
            >
              <Star
                className="text-harp-gold fill-harp-gold"
                style={{ width: size, height: size }}
                strokeWidth={1.5}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DisplayStars;
