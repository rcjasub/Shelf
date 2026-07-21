import { useState } from "react";

const LETTERS = "SHELF".split("");

interface AnimatedLogoProps {
  onClick?: () => void;
  className?: string;
}

export default function AnimatedLogo({ onClick, className = "" }: AnimatedLogoProps) {
  const [playKey, setPlayKey] = useState(0);

  return (
    <span
      key={playKey}
      onClick={() => {
        setPlayKey((k) => k + 1);
        onClick?.();
      }}
      className={`text-xl font-extrabold tracking-tight text-[#f7f3ea] ${className}`}
    >
      {LETTERS.map((ch, i) => (
        <span key={i} className="animate-logo-char" style={{ animationDelay: `${i * 60}ms` }}>
          {ch}
        </span>
      ))}
    </span>
  );
}
