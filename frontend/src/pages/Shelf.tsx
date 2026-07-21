import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLibrary } from "../context/LibraryContext";
import BookCard from "../components/BookCard";
import type { BookStatus } from "../types/book";

const TABS: { key: BookStatus; label: string }[] = [
  { key: "read", label: "Read" },
  { key: "reading", label: "Reading" },
  { key: "want", label: "Want to Read" },
];

const SORT_OPTIONS = [
  { key: "added", label: "Date Added" },
  { key: "title", label: "Title" },
  { key: "rating", label: "Rating" },
];

export default function Shelf() {
  const { user } = useAuth();
  const { books, openRec } = useLibrary();
  const [tab, setTab] = useState<BookStatus>("read");
  const [sortMode, setSortMode] = useState<(typeof SORT_OPTIONS)[number]["key"]>("added");
  const [sortOpen, setSortOpen] = useState(false);

  const readCount = books.filter((b) => b.status === "read").length;
  const wantCount = books.filter((b) => b.status === "want").length;

  const visibleBooks = useMemo(() => {
    const filtered = books.filter((b) => b.status === tab);
    const sorted = [...filtered];
    if (sortMode === "title") sorted.sort((a, b) => a.title.localeCompare(b.title));
    if (sortMode === "rating") sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    return sorted;
  }, [books, tab, sortMode]);

  return (
    <div className="animate-fade-in">
      <div className="relative overflow-hidden px-13 pt-13">
        <div className="relative z-10 flex items-end gap-6.5 pb-8.5">
          <div className="flex h-18 w-18 flex-shrink-0 items-center justify-center rounded-full border-2 border-shelf-cream/22 bg-gradient-to-br from-[#2b2b2b] to-[#0c0c0c] text-2xl font-bold text-[#f7f3ea]">
            {user.initials}
          </div>
          <div className="flex-1">
            <div className="mb-1 font-serif text-4xl leading-none text-shelf-cream">{user.name}</div>
            <div className="mb-3.5 text-[13px] text-shelf-accent">{user.handle}</div>
            <div className="flex gap-7">
              <div className="text-[13px]">
                <span className="font-bold text-shelf-cream">{readCount}</span>{" "}
                <span className="text-white/55">read</span>
              </div>
              <div className="text-[13px]">
                <span className="font-bold text-shelf-cream">3</span> <span className="text-white/55">friends</span>
              </div>
              <div className="text-[13px]">
                <span className="font-bold text-shelf-cream">{wantCount}</span>{" "}
                <span className="text-white/55">want to read</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => openRec()}
            className="flex-shrink-0 rounded-[3px] bg-shelf-cream px-5.5 py-2.5 text-xs font-bold uppercase tracking-wide text-shelf-bg transition-transform hover:-translate-y-0.5"
          >
            Send a Rec →
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-8 border-b border-shelf-cream/7 px-13">
        <div className="flex gap-8">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`border-b-2 py-3.5 text-sm font-medium ${
                tab === t.key ? "border-shelf-accent text-shelf-cream" : "border-transparent text-white/50"
              }`}
            >
              {t.label} <span className="ml-1 text-[10px] text-white/55">{books.filter((b) => b.status === t.key).length}</span>
            </button>
          ))}
        </div>
        <div className="relative">
          <button
            onClick={() => setSortOpen((v) => !v)}
            className="flex items-center gap-2 px-1 py-2.5 text-[11px] font-semibold tracking-wide text-white/75"
          >
            <span>Sort: {SORT_OPTIONS.find((s) => s.key === sortMode)?.label}</span>
            <span className="text-[9px] text-white/50">{sortOpen ? "▲" : "▼"}</span>
          </button>
          {sortOpen && (
            <div className="animate-fade-in absolute right-0 top-full z-10 mt-1 min-w-[170px] overflow-hidden rounded-md border border-shelf-cream/12 bg-[#141414]">
              {SORT_OPTIONS.map((opt) => (
                <div
                  key={opt.key}
                  onClick={() => {
                    setSortMode(opt.key);
                    setSortOpen(false);
                  }}
                  className={`cursor-pointer px-4 py-2.5 text-xs ${
                    sortMode === opt.key ? "text-shelf-accent" : "text-shelf-cream/75"
                  } hover:bg-shelf-cream/5`}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6.5 p-9 sm:grid-cols-3 lg:grid-cols-4">
        {visibleBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
        {visibleBooks.length === 0 && (
          <div className="col-span-full py-16 text-center text-sm text-white/40">Nothing here yet.</div>
        )}
      </div>
    </div>
  );
}
