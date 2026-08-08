import CoverImageLayer from "./CoverImageLayer";

interface BookCoverProps {
  title: string;
  author: string;
  bg: string;
  titleSize?: string;
  // Overrides the search query title when `title` is suppressed for display (e.g. empty string).
  coverTitle?: string;
}

export default function BookCover({ title, author, bg, titleSize = "text-[13px]", coverTitle }: BookCoverProps) {
  return (
    <div className="relative aspect-[2/3] overflow-hidden rounded-[3px] border border-shelf-cream/10">
      <div className="absolute inset-0" style={{ background: bg }} />
      <CoverImageLayer title={coverTitle ?? title} author={author} />
      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
        <div className={`font-serif ${titleSize} leading-tight text-shelf-cream`}>{title}</div>
      </div>
    </div>
  );
}
