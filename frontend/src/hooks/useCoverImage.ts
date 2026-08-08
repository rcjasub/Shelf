import { useEffect, useState } from "react";

const GOOGLE_BOOKS_API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY as string | undefined;

const cache = new Map<string, string | null>();
const inflight = new Map<string, Promise<string | null>>();

async function fetchFromGoogleBooks(title: string, author: string): Promise<string | null> {
  if (!GOOGLE_BOOKS_API_KEY) return null;
  try {
    const q = encodeURIComponent(`intitle:${title} inauthor:${author}`);
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=1&key=${GOOGLE_BOOKS_API_KEY}`,
    );
    if (!res.ok) return null;
    const data = await res.json();
    const links = data?.items?.[0]?.volumeInfo?.imageLinks;
    const raw: string | undefined = links?.large ?? links?.medium ?? links?.thumbnail ?? links?.smallThumbnail;
    if (!raw) return null;
    // Google's default thumbnail is small and has a curled-corner overlay; bump the zoom level and strip it.
    return raw.replace("http://", "https://").replace("zoom=1", "zoom=3").replace("&edge=curl", "");
  } catch {
    return null;
  }
}

async function fetchFromOpenLibrary(title: string, author: string): Promise<string | null> {
  try {
    const params = new URLSearchParams({ title, author, limit: "1", fields: "cover_i" });
    const res = await fetch(`https://openlibrary.org/search.json?${params.toString()}`);
    if (!res.ok) return null;
    const data = await res.json();
    const coverId = data?.docs?.[0]?.cover_i;
    return coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : null;
  } catch {
    return null;
  }
}

async function fetchCover(title: string, author: string): Promise<string | null> {
  const key = `${title}|${author}`;
  if (cache.has(key)) return cache.get(key) ?? null;
  if (inflight.has(key)) return inflight.get(key)!;

  const promise = (async () => {
    const url = (await fetchFromGoogleBooks(title, author)) ?? (await fetchFromOpenLibrary(title, author));
    cache.set(key, url);
    inflight.delete(key);
    return url;
  })();

  inflight.set(key, promise);
  return promise;
}

// Looks up a real cover image, preferring Google Books (higher-quality official art,
// requires VITE_GOOGLE_BOOKS_API_KEY) and falling back to Open Library (free, no key).
// Returns null while loading or when no cover is found — callers should keep
// their existing gradient placeholder visible underneath as a fallback.
export function useCoverImage(title: string, author: string): string | null {
  const [url, setUrl] = useState<string | null>(() => cache.get(`${title}|${author}`) ?? null);

  useEffect(() => {
    if (!title) return;
    let cancelled = false;
    fetchCover(title, author).then((result) => {
      if (!cancelled) setUrl(result);
    });
    return () => {
      cancelled = true;
    };
  }, [title, author]);

  return url;
}
