import { useRef, useState, useCallback } from "react";
import { Star } from "lucide-react";

interface InteractiveStarRatingProps {
  value: number;
  onChange: (value: number) => void;
  maxStars?: number;
}

const InteractiveStarRating = ({
  value,
  onChange,
  maxStars = 5,
}: InteractiveStarRatingProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const calculateRating = useCallback(
    (clientX: number, snap: boolean = false) => {
      if (!containerRef.current) return value;

      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const starWidth = rect.width / maxStars;
      let newRating = Math.max(0, Math.min(maxStars, x / starWidth));

      if (snap) {
        // Snap to 0.5 increments for taps
        newRating = Math.round(newRating * 2) / 2;
      } else {
        // Round to 0.1 for drags
        newRating = Math.round(newRating * 10) / 10;
      }

      return Math.max(0, Math.min(maxStars, newRating));
    },
    [maxStars, value]
  );

  const triggerHaptic = () => {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const newRating = calculateRating(e.clientX, true);
    triggerHaptic();
    onChange(newRating);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const newRating = calculateRating(e.clientX, false);
    onChange(newRating);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  return (
    <div
      ref={containerRef}
      className="flex gap-2 touch-none select-none cursor-pointer py-1"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{ minHeight: "44px" }}
    >
      {Array.from({ length: maxStars }, (_, index) => {
        const fillPercentage = Math.min(
          Math.max((value - index) * 100, 0),
          100
        );

        return (
          <div key={index} className="relative w-8 h-8">
            {/* Empty star (outline) */}
            <Star
              className="absolute inset-0 w-8 h-8 text-muted stroke-gold transition-all duration-100"
              strokeWidth={1.5}
              fill="transparent"
            />
            {/* Filled star with clip */}
            <div
              className="absolute inset-0 overflow-hidden transition-all duration-100"
              style={{ width: `${fillPercentage}%` }}
            >
              <Star
                className="w-8 h-8 text-gold fill-gold"
                strokeWidth={1.5}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InteractiveStarRating;
