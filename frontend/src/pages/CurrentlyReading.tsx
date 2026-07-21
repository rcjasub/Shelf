import { useRef, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useLibrary } from "../context/LibraryContext";

export default function CurrentlyReading() {
  const { id } = useParams();
  const { getBook, setReadingNote } = useLibrary();
  const book = getBook(Number(id));
  const [progress, setProgress] = useState(60);
  const trackRef = useRef<HTMLDivElement>(null);

  if (!book) return <Navigate to="/shelf" replace />;

  const updateFromEvent = (clientX: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, Math.round(((clientX - rect.left) / rect.width) * 100)));
    setProgress(pct);
  };

  const currentPage = Math.round((progress / 100) * book.pages);

  return (
    <div className="animate-fade-in px-13 py-13">
      <div className="mb-2.5 text-[9px] uppercase tracking-[3px] text-white/55">Currently Reading</div>
      <div className="grid max-w-4xl grid-cols-1 items-start gap-14 md:grid-cols-[260px_1fr]">
        <div className="relative aspect-[2/3] overflow-hidden rounded-md border border-shelf-cream/9">
          <div className="absolute inset-0" style={{ background: book.coverBg }} />
          <div className="absolute inset-y-0 left-0 w-2" style={{ background: book.coverSpine }} />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/93 to-transparent p-5">
            <div className="font-serif text-lg leading-tight text-shelf-cream">{book.title}</div>
          </div>
        </div>

        <div>
          <div className="mb-1.5 font-serif text-5xl leading-[1.02] text-shelf-cream">{book.title}</div>
          <div className="mb-1 text-[17px] text-shelf-cream/65">{book.author}</div>
          <div className="my-4 flex gap-1.5">
            {book.genres.map((genre) => (
              <span
                key={genre}
                className="rounded-[2px] bg-shelf-cream/6 px-2.5 py-1 text-[11px] tracking-wide text-shelf-cream"
              >
                {genre}
              </span>
            ))}
          </div>

          <div className="mb-8">
            <div className="mb-3 flex items-baseline justify-between">
              <div className="text-[11px] uppercase tracking-wide text-white/55">Progress</div>
              <div className="text-[32px] font-bold leading-none text-shelf-cream">{progress}%</div>
            </div>
            <div
              ref={trackRef}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                updateFromEvent(e.clientX);
              }}
              onPointerMove={(e) => {
                if (e.buttons === 1) updateFromEvent(e.clientX);
              }}
              className="relative mb-3.5 h-4 cursor-pointer touch-none"
            >
              <div className="pointer-events-none absolute inset-x-0 top-1/2 h-1.25 -translate-y-1/2 overflow-hidden rounded-full bg-shelf-cream/8">
                <div className="h-full bg-shelf-accent" style={{ width: `${progress}%` }} />
              </div>
              <div
                className="pointer-events-none absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-shelf-cream"
                style={{ left: `${progress}%` }}
              />
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setProgress((p) => Math.max(0, p - 5))}
                className="flex h-8.5 w-8.5 items-center justify-center rounded-[3px] border border-shelf-cream/14 text-base text-shelf-cream/60"
              >
                −
              </button>
              <div className="flex-1 text-center text-xs text-white/55">
                Page {currentPage} of {book.pages}
              </div>
              <button
                onClick={() => setProgress((p) => Math.min(100, p + 5))}
                className="flex h-8.5 w-8.5 items-center justify-center rounded-[3px] border border-shelf-cream/14 text-base text-shelf-cream"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <div className="mb-3 text-[9px] uppercase tracking-[2.5px] text-white/55">Reading Notes</div>
            <textarea
              value={book.myNote ?? ""}
              onChange={(e) => setReadingNote(book.id, e.target.value)}
              placeholder="What are you thinking about as you read…"
              className="block min-h-[130px] w-full resize-y rounded-md border border-shelf-cream/9 bg-shelf-panel p-4 font-sans text-sm leading-relaxed text-shelf-cream outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
