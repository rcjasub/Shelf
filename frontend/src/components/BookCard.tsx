import { Link } from "react-router-dom";
import type { Book } from "../types/book";
import BookCover from "./BookCover";

export default function BookCard({ book }: { book: Book }) {
  return (
    <Link to={`/books/${book.id}`} className="group block transition-transform duration-200 hover:-translate-y-1">
      <BookCover title={book.title} bg={book.coverBg} spine={book.coverSpine} />
      <div className="mt-2.5">
        <div className="text-xs text-white/55">{book.author}</div>
        {book.rating && (
          <div className="mt-1 text-[11px] tracking-[1.5px] text-shelf-cream">{"★".repeat(book.rating)}</div>
        )}
        <div className="mt-1.5 flex flex-wrap gap-1">
          {book.genres.map((genre) => (
            <span
              key={genre}
              className="rounded-[2px] bg-shelf-cream/6 px-1.5 py-0.5 text-[10px] tracking-wide text-shelf-cream"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
