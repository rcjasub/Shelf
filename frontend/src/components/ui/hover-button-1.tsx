import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface HoverActionButtonProps {
  label?: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const HoverActionButton = ({
  label = "Button",
  className,
  onClick,
}: HoverActionButtonProps = {}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative w-32 cursor-pointer overflow-hidden rounded-[3px] border border-shelf-cream/30 bg-transparent p-2 text-center text-[11px] font-bold uppercase tracking-wide text-shelf-cream",
        className,
      )}
    >
      <span className="inline-block translate-x-1 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
        {label}
      </span>

      <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100 group-hover:text-shelf-ink">
        <span>{label}</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </div>

      <div className="absolute left-[20%] top-[40%] h-2 w-2 scale-[1] bg-shelf-cream/30 transition-all duration-300 group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8] group-hover:bg-shelf-accent"></div>
    </div>
  );
};
