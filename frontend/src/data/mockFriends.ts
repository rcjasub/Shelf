import type { Friend } from "../types/friend";

export const FRIENDS: Friend[] = [
  {
    id: 1,
    name: "Theo Vance",
    handle: "@theovance",
    avatar: "TV",
    avatarBg: "#2a2a2a",
    bio: "Reading nothing but cyberpunk and doorstopper classics. Will recommend Le Guin unprompted. Currently: everything Jeff VanderMeer ever wrote.",
    booksRead: 94,
    sharedBooks: 3,
    recentReads: [1, 3, 5],
  },
  {
    id: 2,
    name: "Isha Mehta",
    handle: "@ishamehta",
    avatar: "IM",
    avatarBg: "#242424",
    bio: "Literary fiction and horror. Prefers ambiguous endings. Sometimes takes a year to finish one book, which is fine.",
    booksRead: 61,
    sharedBooks: 2,
    recentReads: [2, 4],
  },
  {
    id: 3,
    name: "Cas Laurent",
    handle: "@caslaurent",
    avatar: "CL",
    avatarBg: "#1e1e1e",
    bio: "Translator. Reading in four languages simultaneously, which seems fine until it isn't.",
    booksRead: 148,
    sharedBooks: 1,
    recentReads: [6, 7],
  },
];
