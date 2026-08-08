import { useCoverImage } from "../hooks/useCoverImage";

// Drop-in overlay for existing gradient-placeholder covers: renders nothing
// until a real cover image is found, so the gradient underneath stays as a
// permanent fallback for books with no match.
export default function CoverImageLayer({
  title,
  author,
  className = "absolute inset-0 h-full w-full object-cover",
}: {
  title: string;
  author: string;
  className?: string;
}) {
  const cover = useCoverImage(title, author);
  if (!cover) return null;
  return <img src={cover} alt="" className={className} />;
}
