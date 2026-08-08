import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLibrary } from "../context/LibraryContext";
import { GENRE_OPTIONS, PALETTES } from "../data/mockBooks";
import type { BookStatus } from "../types/book";
import { PointerHighlight } from "../components/ui/pointer-highlight";
import CoverImageLayer from "../components/CoverImageLayer";

const STATUS_OPTIONS: { key: BookStatus; label: string }[] = [
  { key: "want", label: "Want to Read" },
  { key: "reading", label: "Reading" },
  { key: "read", label: "Read" },
];

export default function AddBook() {
  const navigate = useNavigate();
  const { catalog, addFromCatalog, addManualBook } = useLibrary();
  const [mode, setMode] = useState<"search" | "manual">("search");
  const [query, setQuery] = useState("");

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [status, setStatus] = useState<BookStatus>("want");
  const [paletteIdx, setPaletteIdx] = useState(0);

  const results = useMemo(
    () =>
      catalog.filter(
        (b) =>
          b.title.toLowerCase().includes(query.toLowerCase()) ||
          b.author.toLowerCase().includes(query.toLowerCase()),
      ),
    [catalog, query],
  );

  const toggleGenre = (genre: string) => {
    setGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : prev.length < 2 ? [...prev, genre] : prev,
    );
  };

  const inputClass =
    "w-full rounded-md border border-shelf-cream/10 bg-shelf-panel px-3.5 py-2.75 font-sans text-sm text-shelf-cream outline-none placeholder:text-shelf-cream/35";

  const saveManual = () => {
    if (!title.trim()) return;
    const palette = PALETTES[paletteIdx];
    const id = addManualBook({
      title,
      author: author || "Unknown",
      year: Number(year) || new Date().getFullYear(),
      pages: 0,
      genres,
      coverBg: palette.bg,
      coverSpine: palette.spine,
      status,
      rating: null,
      dateRead: null,
      synopsis,
      myNote: null,
    });
    navigate(`/books/${id}`);
  };

  return (
    <div className="min-h-[calc(100vh-56px)] px-13 py-11">
      <div className="max-w-3xl">
        <div className="mb-9 flex flex-wrap items-center gap-2 font-serif text-4xl text-shelf-cream">
          <span>Add a</span>
          <PointerHighlight
            containerClassName="inline-flex items-center"
            rectangleClassName="border-shelf-accent/60"
            pointerClassName="text-shelf-accent"
          >
            <span>Book</span>
          </PointerHighlight>
        </div>
        <div className="mb-7 text-sm text-white/55">
          Search the catalog, or enter one yourself and design its cover.
        </div>

        <div className="mb-7 flex gap-7 border-b border-shelf-cream/7">
          {(["search", "manual"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`border-b-2 pb-3 text-sm font-medium ${
                mode === m ? "border-shelf-accent text-shelf-cream" : "border-transparent text-white/50"
              }`}
            >
              {m === "search" ? "Search Catalog" : "Manual Entry"}
            </button>
          ))}
        </div>

        {mode === "search" && (
          <div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or author…"
              className={`${inputClass} mb-5.5`}
            />
            <div className="flex flex-col gap-2">
              {results.map((book) => (
                <div
                  key={book.id}
                  className="flex items-center gap-4 rounded-md border border-shelf-cream/8 bg-shelf-panel px-4.5 py-3.5"
                >
                  <div className="relative h-14 w-10 flex-shrink-0 overflow-hidden rounded-sm">
                    <div className="absolute inset-0" style={{ background: book.coverBg }} />
                    <CoverImageLayer title={book.title} author={book.author} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-serif text-base leading-tight text-shelf-cream">{book.title}</div>
                    <div className="mt-0.5 text-xs text-white/55">
                      {book.author} · {book.year}
                    </div>
                  </div>
                  <button
                    onClick={() => addFromCatalog(book.id)}
                    className="flex-shrink-0 rounded-[3px] border border-shelf-cream/30 px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-shelf-cream"
                  >
                    + Add to Shelf
                  </button>
                </div>
              ))}
              {results.length === 0 && <div className="py-10 text-center text-sm text-white/40">No matches.</div>}
            </div>
          </div>
        )}

        {mode === "manual" && (
          <div className="grid grid-cols-1 items-start gap-11 md:grid-cols-[220px_1fr]">
            <div>
              <div className="relative aspect-[2/3] overflow-hidden rounded-md border border-shelf-cream/9">
                <div className="absolute inset-0" style={{ background: PALETTES[paletteIdx].bg }} />
                <div className="absolute inset-y-0 left-0 w-2" style={{ background: PALETTES[paletteIdx].spine }} />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/94 to-transparent p-4">
                  <div className="font-serif text-[15px] leading-tight text-shelf-cream">{title || "Untitled"}</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="mb-2.5 text-[9px] uppercase tracking-[2.5px] text-white/55">Cover Palette</div>
                <div className="grid grid-cols-4 gap-2">
                  {PALETTES.map((pal, i) => (
                    <div
                      key={i}
                      onClick={() => setPaletteIdx(i)}
                      className={`aspect-square cursor-pointer rounded ${
                        paletteIdx === i ? "ring-2 ring-shelf-accent" : ""
                      }`}
                      style={{ background: pal.bg }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <div className="mb-2 text-[9px] uppercase tracking-[2.5px] text-white/55">Title</div>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Book title" className={inputClass} />
              </div>
              <div className="grid grid-cols-[2fr_1fr] gap-3.5">
                <div>
                  <div className="mb-2 text-[9px] uppercase tracking-[2.5px] text-white/55">Author</div>
                  <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author name" className={inputClass} />
                </div>
                <div>
                  <div className="mb-2 text-[9px] uppercase tracking-[2.5px] text-white/55">Year</div>
                  <input value={year} onChange={(e) => setYear(e.target.value)} placeholder="2024" className={inputClass} />
                </div>
              </div>
              <div>
                <div className="mb-2 text-[9px] uppercase tracking-[2.5px] text-white/55">
                  Genres <span className="normal-case tracking-normal text-shelf-cream/30">(pick up to 2)</span>
                </div>
                <div className="flex flex-wrap gap-1.75">
                  {GENRE_OPTIONS.map((genre) => (
                    <span
                      key={genre}
                      onClick={() => toggleGenre(genre)}
                      className={`cursor-pointer rounded-[2px] border px-3 py-1 text-xs ${
                        genres.includes(genre)
                          ? "border-shelf-accent/60 bg-shelf-accent/10 text-shelf-accent"
                          : "border-shelf-cream/12 text-shelf-cream/60"
                      }`}
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-2 text-[9px] uppercase tracking-[2.5px] text-white/55">Shelf Status</div>
                <div className="flex gap-2">
                  {STATUS_OPTIONS.map((opt) => (
                    <span
                      key={opt.key}
                      onClick={() => setStatus(opt.key)}
                      className={`cursor-pointer rounded-[2px] border px-3 py-1 text-xs ${
                        status === opt.key
                          ? "border-shelf-accent/60 bg-shelf-accent/10 text-shelf-accent"
                          : "border-shelf-cream/12 text-shelf-cream/60"
                      }`}
                    >
                      {opt.label}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-2 text-[9px] uppercase tracking-[2.5px] text-white/55">
                  Synopsis <span className="normal-case tracking-normal text-shelf-cream/30">(optional)</span>
                </div>
                <textarea
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                  placeholder="What's it about?"
                  className={`${inputClass} min-h-[80px] resize-y leading-relaxed`}
                />
              </div>
              <div className="mt-1.5 flex justify-end">
                <button
                  onClick={saveManual}
                  className="rounded-[3px] bg-shelf-accent px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-shelf-ink"
                >
                  Save to Shelf ✦
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
