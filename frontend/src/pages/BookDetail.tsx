import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useLibrary } from "../context/LibraryContext";
import StarRating from "../components/StarRating";

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBook, setBookRating, setBookStatus, openRec } = useLibrary();
  const book = getBook(Number(id));

  if (!book) return <Navigate to="/shelf" replace />;

  return (
    <div className="animate-fade-in mx-auto max-w-3xl px-13 py-8.5">
      <div className="flex w-full items-start gap-8">
        <div className="w-55 flex-shrink-0">
          <div className="relative aspect-[2/3] overflow-hidden rounded-md border border-shelf-cream/9">
            <div className="absolute inset-0" style={{ background: book.coverBg }} />
            <div className="absolute inset-y-0 left-0 w-2" style={{ background: book.coverSpine }} />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/94 to-transparent p-4">
              <div className="font-serif text-[15px] leading-tight text-shelf-cream">{book.title}</div>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-5.5 pt-1">
          <div>
            <div className="mb-2 font-serif text-[44px] leading-[1.02] text-shelf-cream">{book.title}</div>
            <div className="mb-1 text-[17px] text-shelf-cream/70">{book.author}</div>
            <div className="text-xs uppercase tracking-wide text-white/55">
              {book.year} · {book.pages} pages
            </div>
          </div>
          <div className="flex w-55 flex-col gap-2">
            <button
              onClick={() => openRec(book.id)}
              className="rounded-[3px] bg-shelf-cream py-2.5 text-[11px] font-bold uppercase tracking-wide text-shelf-bg"
            >
              Send to a Friend →
            </button>
            {book.status !== "want" ? (
              <button
                onClick={() => setBookStatus(book.id, "want")}
                className="rounded-[3px] border border-shelf-cream/10 py-2.5 text-[11px] font-medium text-shelf-cream/55"
              >
                Mark as Want to Read
              </button>
            ) : (
              <button
                onClick={() => {
                  setBookStatus(book.id, "reading");
                  navigate(`/reading/${book.id}`);
                }}
                className="rounded-[3px] border border-shelf-cream/10 py-2.5 text-[11px] font-medium text-shelf-cream/55"
              >
                Start Reading
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-7 w-full">
        <div className="mb-6.5 flex flex-wrap gap-2">
          {book.genres.map((genre) => (
            <span
              key={genre}
              className="rounded-[2px] border border-shelf-cream/14 bg-shelf-cream/6 px-3.5 py-1 text-xs tracking-wide text-shelf-cream"
            >
              {genre}
            </span>
          ))}
        </div>

        <div className="mb-6.5">
          <StarRating rating={book.rating ?? 0} onRate={(v) => setBookRating(book.id, v)} size="text-xl" />
        </div>

        <p className="mb-7.5 text-[15px] leading-loose text-shelf-cream/70 text-balance">{book.synopsis}</p>

        {book.myNote && (
          <div className="mb-6.5 rounded-md border border-shelf-cream/8 bg-shelf-panel p-5.5">
            <div className="mb-3 text-[9px] uppercase tracking-[2.5px] text-white/55">My Notes</div>
            <div className="font-serif text-sm italic leading-loose text-shelf-cream">{book.myNote}</div>
          </div>
        )}

        {book.friendTakes.length > 0 && (
          <div>
            <div className="mb-3.5 text-[9px] uppercase tracking-[2.5px] text-white/55">Friends' Takes</div>
            {book.friendTakes.map((take) => (
              <div
                key={take.name}
                className="mb-2 flex items-start gap-3 rounded-md border border-shelf-cream/7 bg-shelf-panel p-4"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#242424] text-[10px] font-bold text-shelf-accent">
                  {take.initials}
                </div>
                <div>
                  <div className="mb-1 text-sm font-medium text-shelf-accent">
                    {take.name} <span className="ml-2 tracking-wide text-shelf-cream">{"★".repeat(take.rating)}</span>
                  </div>
                  <div className="text-sm italic leading-relaxed text-shelf-cream/70">{take.note}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
