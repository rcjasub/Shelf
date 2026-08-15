import { useEffect, useState } from "react";

const GOOGLE_BOOKS_API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY as string | undefined;

export interface BookSearchResult {
  key: string;
  title: string;
  author: string;
  year: number;
  synopsis?: string;
}

interface OpenLibraryDoc {
  key?: string;
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
}

interface GoogleBooksItem {
  id: string;
  volumeInfo?: {
    title?: string;
    authors?: string[];
    publishedDate?: string;
    description?: string;
  };
}

// Shared across every hook instance for the life of the tab: once a query has been
// searched, revisiting it (retyping, backspacing back to a prior prefix) is instant.
const resultCache = new Map<string, BookSearchResult[]>();

function normalize(query: string): string {
  return query.trim().toLowerCase();
}

function yearFromPublishedDate(publishedDate: string | undefined): number {
  const year = publishedDate ? Number(publishedDate.slice(0, 4)) : NaN;
  return Number.isFinite(year) ? year : new Date().getFullYear();
}

// Preferred source when a key is configured: better metadata coverage for recent releases.
async function searchGoogleBooks(trimmed: string, signal: AbortSignal): Promise<BookSearchResult[] | null> {
  if (!GOOGLE_BOOKS_API_KEY) return null;
  const params = new URLSearchParams({ q: trimmed, maxResults: "12", key: GOOGLE_BOOKS_API_KEY });
  const res = await fetch(`https://www.googleapis.com/books/v1/volumes?${params.toString()}`, { signal });
  if (!res.ok) return null;
  const data = await res.json();
  const items: GoogleBooksItem[] = Array.isArray(data?.items) ? data.items : [];
  const mapped = items
    .filter((it) => it.volumeInfo?.title && it.volumeInfo?.authors?.[0])
    .map((it) => ({
      key: it.id,
      title: it.volumeInfo!.title!,
      author: it.volumeInfo!.authors![0],
      year: yearFromPublishedDate(it.volumeInfo!.publishedDate),
      synopsis: it.volumeInfo!.description,
    }));
  return mapped.length > 0 ? mapped : null;
}

// Fallback: free, no key required.
async function searchOpenLibrary(trimmed: string, signal: AbortSignal): Promise<BookSearchResult[]> {
  const params = new URLSearchParams({
    q: trimmed,
    limit: "12",
    fields: "key,title,author_name,first_publish_year",
  });
  const res = await fetch(`https://openlibrary.org/search.json?${params.toString()}`, { signal });
  if (!res.ok) throw new Error("search failed");
  const data = await res.json();
  const docs: OpenLibraryDoc[] = Array.isArray(data?.docs) ? data.docs : [];
  return docs
    .filter((d) => d.title && d.author_name?.[0])
    .map((d) => ({
      key: d.key ?? `${d.title}-${d.author_name![0]}`,
      title: d.title!,
      author: d.author_name![0],
      year: d.first_publish_year ?? new Date().getFullYear(),
    }));
}

async function searchBooks(trimmed: string, signal: AbortSignal): Promise<BookSearchResult[]> {
  try {
    const google = await searchGoogleBooks(trimmed, signal);
    if (google) return google;
  } catch (err) {
    if ((err as Error).name === "AbortError") throw err;
    // any other Google Books failure (quota, network, missing key) falls through to Open Library
  }
  return searchOpenLibrary(trimmed, signal);
}

// Debounced free-text book search: Google Books first (if VITE_GOOGLE_BOOKS_API_KEY is set),
// falling back to Open Library. Cached per query (instant on repeat) and cancels the
// in-flight request via AbortController whenever the query changes again before it resolves.
export function useBookSearch(query: string, delay = 200) {
  const [results, setResults] = useState<BookSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const trimmed = normalize(query);
    if (!trimmed) {
      setResults([]);
      setLoading(false);
      return;
    }

    const cached = resultCache.get(trimmed);
    if (cached) {
      setResults(cached);
      setLoading(false);
      return;
    }

    setLoading(true);
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const mapped = await searchBooks(trimmed, controller.signal);
        resultCache.set(trimmed, mapped);
        setResults(mapped);
        setLoading(false);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setResults([]);
        setLoading(false);
      }
    }, delay);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, delay]);

  return { results, loading };
}
