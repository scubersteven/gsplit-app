import InteractiveStarRating from "./InteractiveStarRating";

interface RatingSliderProps {
  label: string;
  lowLabel: string;
  highLabel: string;
  value: number;
  onChange: (value: number) => void;
}

const RatingSlider = ({
  label,
  lowLabel,
  highLabel,
  value,
  onChange,
}: RatingSliderProps) => {
  return (
    <div>
      {/* Section Label */}
      <h3 className="text-lg font-bold text-foreground mb-3">{label}</h3>

      {/* Stars + Score Row */}
      <div className="flex items-center justify-center gap-3">
        <InteractiveStarRating value={value} onChange={onChange} />
        <span className="text-xl font-bold text-foreground min-w-[40px]">
          {value.toFixed(1)}
        </span>
      </div>

      {/* Witty Labels Below */}
      <div className="flex justify-between mt-3">
        <span className="text-xs font-medium italic text-foreground/85">
          {lowLabel}
        </span>
        <span className="text-xs font-medium italic text-foreground/85">
          {highLabel}
        </span>
      </div>
    </div>
  );
};

export default RatingSlider;
