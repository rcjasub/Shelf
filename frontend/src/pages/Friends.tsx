import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useLibrary } from "../context/LibraryContext";

export default function Friends() {
  const { friendId } = useParams();
  const { friends, books, openRec } = useLibrary();
  const [activeId, setActiveId] = useState(friendId ? Number(friendId) : friends[0]?.id);

  const curFriend = friends.find((f) => f.id === activeId) ?? friends[0];
  const friendBooks = books.filter((b) => curFriend?.recentReads.includes(b.id));

  return (
    <div className="animate-fade-in grid min-h-[calc(100vh-56px)] grid-cols-[210px_1fr]">
      <div className="border-r border-shelf-cream/7 p-7 px-3.5">
        <div className="mb-3.5 px-3 text-[9px] uppercase tracking-[2.5px] text-white/55">Your Friends</div>
        {friends.map((friend) => (
          <div
            key={friend.id}
            onClick={() => setActiveId(friend.id)}
            className={`flex cursor-pointer items-center gap-2.5 rounded-md p-3 ${
              activeId === friend.id ? "bg-shelf-cream/6" : "hover:bg-shelf-cream/4"
            }`}
          >
            <div
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-shelf-accent"
              style={{ background: friend.avatarBg }}
            >
              {friend.avatar}
            </div>
            <div>
              <div className="text-[13px] font-medium leading-tight text-shelf-cream">{friend.name}</div>
              <div className="mt-0.5 text-[11px] text-white/55">{friend.booksRead} read</div>
            </div>
          </div>
        ))}
      </div>

      {curFriend && (
        <div className="px-13 py-11">
          <div className="mb-11 flex items-start gap-5.5">
            <div
              className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full text-xl font-bold text-shelf-accent"
              style={{ background: curFriend.avatarBg }}
            >
              {curFriend.avatar}
            </div>
            <div className="flex-1">
              <div className="mb-1 font-serif text-4xl leading-none text-shelf-cream">{curFriend.name}</div>
              <div className="mb-2.5 text-[13px] text-shelf-accent">{curFriend.handle}</div>
              <div className="mb-3.5 max-w-[460px] text-sm leading-relaxed text-shelf-cream/60 text-balance">
                {curFriend.bio}
              </div>
              <div className="flex gap-6">
                <div className="text-[13px]">
                  <span className="font-bold text-shelf-cream">{curFriend.booksRead}</span>{" "}
                  <span className="text-white/55">read</span>
                </div>
                <div className="text-[13px]">
                  <span className="font-bold text-shelf-cream">{curFriend.sharedBooks}</span>{" "}
                  <span className="text-white/55">in common</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => openRec()}
              className="flex-shrink-0 rounded-[3px] bg-shelf-cream px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-shelf-bg"
            >
              Send a Rec →
            </button>
          </div>

          <div className="mb-4.5 text-[9px] uppercase tracking-[2.5px] text-white/55">Recent Reads</div>
          <div className="grid max-w-[560px] grid-cols-3 gap-5.5">
            {friendBooks.map((book) => (
              <Link key={book.id} to={`/books/${book.id}`}>
                <div className="relative aspect-[2/3] overflow-hidden rounded-[3px] border border-shelf-cream/6">
                  <div className="absolute inset-0" style={{ background: book.coverBg }} />
                  <div className="absolute inset-y-0 left-0 w-[5px]" style={{ background: book.coverSpine }} />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/92 to-transparent p-2.5">
                    <div className="font-serif text-xs leading-tight text-shelf-cream">{book.title}</div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-[11px] text-white/55">{book.author}</div>
                  {book.rating && (
                    <div className="mt-0.5 text-[11px] tracking-[1.5px] text-shelf-cream">
                      {"★".repeat(book.rating)}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
