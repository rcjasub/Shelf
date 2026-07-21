interface StarRatingProps {
  rating: number;
  onRate?: (value: number) => void;
  size?: string;
}

export default function StarRating({ rating, onRate, size = "text-base" }: StarRatingProps) {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          onClick={() => onRate?.(n)}
          className={`${size} transition-transform ${onRate ? "cursor-pointer hover:scale-110" : ""}`}
          style={{ color: n <= rating ? "#f3e1cc" : "rgba(243,225,204,0.2)" }}
        >
          ★
        </span>
      ))}
    </div>
  );
}
