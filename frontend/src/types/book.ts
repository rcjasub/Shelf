export type BookStatus = "read" | "reading" | "want";

export interface FriendTake {
  name: string;
  initials: string;
  rating: number;
  note: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  pages: number;
  genres: string[];
  coverBg: string;
  coverSpine: string;
  status: BookStatus;
  rating: number | null;
  dateRead: string | null;
  synopsis: string;
  myNote: string | null;
  friendTakes: FriendTake[];
}
