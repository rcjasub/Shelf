export type InboxStatus = "unread" | "read";

export interface InboxItem {
  id: number;
  fromId: number;
  bookTitle: string;
  bookAuthor: string;
  year: number;
  genres: string[];
  coverBg: string;
  coverSpine: string;
  note: string;
  dateSent: string;
  status: InboxStatus;
  isAdded: boolean;
}
