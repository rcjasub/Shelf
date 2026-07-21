interface BookCoverProps {
  title: string;
  bg: string;
  spine: string;
  titleSize?: string;
}

export default function BookCover({ title, bg, spine, titleSize = "text-[13px]" }: BookCoverProps) {
  return (
    <div className="relative aspect-[2/3] overflow-hidden rounded-[3px] border border-shelf-cream/10">
      <div className="absolute inset-0" style={{ background: bg }} />
      <div className="absolute left-0 top-0 bottom-0 w-[6px]" style={{ background: spine }} />
      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
        <div className={`font-serif ${titleSize} leading-tight text-shelf-cream`}>{title}</div>
      </div>
    </div>
  );
}
