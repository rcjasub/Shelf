import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { BOOKS, CATALOG } from "../data/mockBooks";
import { INBOX } from "../data/mockInbox";
import { FRIENDS } from "../data/mockFriends";
import type { Book, BookStatus } from "../types/book";
import type { InboxItem } from "../types/inbox";
import type { Friend } from "../types/friend";

export interface RecModalState {
  open: boolean;
  step: 1 | 2 | 3 | 4;
  bookId: number | null;
  friendId: number | null;
  note: string;
}

interface LibraryContextValue {
  books: Book[];
  catalog: Book[];
  inbox: InboxItem[];
  friends: Friend[];
  getBook: (id: number) => Book | undefined;
  getFriend: (id: number) => Friend | undefined;
  setBookStatus: (id: number, status: BookStatus) => void;
  setBookRating: (id: number, rating: number) => void;
  addFromCatalog: (catalogId: number) => void;
  addManualBook: (book: Omit<Book, "id" | "friendTakes">) => number;
  setReadingNote: (id: number, note: string) => void;
  addToShelfFromInbox: (inboxId: number) => void;
  dismissFromInbox: (inboxId: number) => void;
  markInboxRead: (inboxId: number) => void;
  rec: RecModalState;
  openRec: (bookId?: number) => void;
  closeRec: () => void;
  setRecStep: (step: RecModalState["step"]) => void;
  selectRecBook: (bookId: number) => void;
  selectRecFriend: (friendId: number) => void;
  setRecNote: (note: string) => void;
  submitRec: () => void;
}

const LibraryContext = createContext<LibraryContextValue | null>(null);

const REC_MODAL_DEFAULT: RecModalState = {
  open: false,
  step: 1,
  bookId: null,
  friendId: null,
  note: "",
};

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>(BOOKS);
  const [catalog, setCatalog] = useState<Book[]>(CATALOG);
  const [inbox, setInbox] = useState<InboxItem[]>(INBOX);
  const [rec, setRec] = useState<RecModalState>(REC_MODAL_DEFAULT);

  const getBook = (id: number) => books.find((b) => b.id === id);
  const getFriend = (id: number) => FRIENDS.find((f) => f.id === id);

  const setBookStatus = (id: number, status: BookStatus) => {
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  const setBookRating = (id: number, rating: number) => {
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, rating } : b)));
  };

  const addFromCatalog = (catalogId: number) => {
    const found = catalog.find((b) => b.id === catalogId);
    if (!found) return;
    setBooks((prev) => [...prev, { ...found, status: "want" }]);
    setCatalog((prev) => prev.filter((b) => b.id !== catalogId));
  };

  const addManualBook = (book: Omit<Book, "id" | "friendTakes">) => {
    const id = Math.max(0, ...books.map((b) => b.id)) + 1;
    setBooks((prev) => [...prev, { ...book, id, friendTakes: [] }]);
    return id;
  };

  const setReadingNote = (id: number, note: string) => {
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, myNote: note } : b)));
  };

  const addToShelfFromInbox = (inboxId: number) => {
    const item = inbox.find((i) => i.id === inboxId);
    if (!item) return;
    setInbox((prev) => prev.map((i) => (i.id === inboxId ? { ...i, isAdded: true } : i)));
    setBooks((prev) => [
      ...prev,
      {
        id: Math.max(0, ...prev.map((b) => b.id)) + 1,
        title: item.bookTitle,
        author: item.bookAuthor,
        year: item.year,
        pages: 0,
        genres: item.genres,
        coverBg: item.coverBg,
        coverSpine: item.coverSpine,
        status: "want",
        rating: null,
        dateRead: null,
        synopsis: "",
        myNote: null,
        friendTakes: [],
      },
    ]);
  };

  const dismissFromInbox = (inboxId: number) => {
    setInbox((prev) => prev.filter((i) => i.id !== inboxId));
  };

  const markInboxRead = (inboxId: number) => {
    setInbox((prev) => prev.map((i) => (i.id === inboxId ? { ...i, status: "read" } : i)));
  };

  const openRec = (bookId?: number) =>
    setRec({ ...REC_MODAL_DEFAULT, open: true, step: bookId ? 2 : 1, bookId: bookId ?? null });
  const closeRec = () => setRec(REC_MODAL_DEFAULT);
  const setRecStep = (step: RecModalState["step"]) => setRec((prev) => ({ ...prev, step }));
  const selectRecBook = (bookId: number) => setRec((prev) => ({ ...prev, bookId, step: 2 }));
  const selectRecFriend = (friendId: number) => setRec((prev) => ({ ...prev, friendId, step: 3 }));
  const setRecNote = (note: string) => setRec((prev) => ({ ...prev, note }));
  const submitRec = () => setRec((prev) => ({ ...prev, step: 4 }));

  const value = useMemo<LibraryContextValue>(
    () => ({
      books,
      catalog,
      inbox,
      friends: FRIENDS,
      getBook,
      getFriend,
      setBookStatus,
      setBookRating,
      addFromCatalog,
      addManualBook,
      setReadingNote,
      addToShelfFromInbox,
      dismissFromInbox,
      markInboxRead,
      rec,
      openRec,
      closeRec,
      setRecStep,
      selectRecBook,
      selectRecFriend,
      setRecNote,
      submitRec,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [books, catalog, inbox, rec],
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary(): LibraryContextValue {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used within a LibraryProvider");
  return ctx;
}
