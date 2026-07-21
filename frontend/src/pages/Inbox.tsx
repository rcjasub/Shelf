import { useState } from "react";
import { useLibrary } from "../context/LibraryContext";
import DarkVeil from "../components/DarkVeil";

export default function Inbox() {
  const { inbox, friends, addToShelfFromInbox, dismissFromInbox, markInboxRead } = useLibrary();
  const [expandedId, setExpandedId] = useState<number | null>(inbox[0]?.id ?? null);

  const unreadCount = inbox.filter((i) => i.status === "unread").length;

  const toggle = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
    markInboxRead(id);
  };

  return (
    <>
      <div className="fixed inset-0 -z-10">
        <DarkVeil hueShift={0} noiseIntensity={0} scanlineIntensity={0} speed={0.4} warpAmount={0.15} />
      </div>
      <div className="animate-fade-in max-w-4xl px-13 py-13">
        <div className="mb-2 flex items-baseline gap-3.5">
          <div className="font-serif text-4xl text-shelf-cream">Inbox</div>
          {unreadCount > 0 && (
            <div className="rounded-full bg-shelf-accent px-3 py-0.5 text-[11px] font-bold text-shelf-bg">
              {unreadCount} new
            </div>
          )}
        </div>
        <div className="mb-10 text-sm text-white/55">
          Books your friends thought you'd love — with a personal note, not an algorithm.
        </div>

        <div className="flex flex-col gap-2.5">
          {inbox.map((item) => {
            const sender = friends.find((f) => f.id === item.fromId);
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className="overflow-hidden rounded-md border border-shelf-cream/8 bg-shelf-panel transition-colors hover:border-shelf-cream/16"
              >
                <div
                  onClick={() => toggle(item.id)}
                  className="flex cursor-pointer items-center gap-4 px-5.5 py-4.5"
                >
                  <div
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-shelf-accent"
                    style={{ background: sender?.avatarBg ?? "#242424" }}
                  >
                    {sender?.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-shelf-accent">{sender?.name}</span>
                      <span className="text-xs text-white/55">recommended</span>
                      {item.status === "unread" && (
                        <span className="inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-shelf-accent" />
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-9.5 w-7 flex-shrink-0 rounded-sm" style={{ background: item.coverBg }} />
                      <div>
                        <div className="font-serif text-[17px] leading-tight text-shelf-cream">{item.bookTitle}</div>
                        <div className="mt-0.5 text-[11px] text-white/55">
                          {item.bookAuthor} · {item.year}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-3.5">
                    {item.isAdded && (
                      <span className="text-[11px] font-semibold tracking-wide text-shelf-cream">ADDED ✓</span>
                    )}
                    <span className="text-[11px] text-white/55">{item.dateSent}</span>
                    <span className="text-sm text-white/55">{isExpanded ? "▲" : "▼"}</span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="animate-fade-in border-t border-shelf-cream/7 px-5.5 pb-6 pt-5">
                    <div className="mb-4.5 flex gap-1.5">
                      {item.genres.map((genre) => (
                        <span
                          key={genre}
                          className="rounded-[2px] bg-shelf-cream/6 px-2.5 py-0.5 text-[10px] tracking-wide text-shelf-cream"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                    <div className="mb-6 border-l-2 border-shelf-cream/35 pl-4.5 text-[15px] italic leading-loose text-shelf-cream/88 text-balance">
                      "{item.note}"
                    </div>
                    <div className="flex gap-2.5">
                      {item.isAdded ? (
                        <div className="rounded-[3px] border border-shelf-cream/30 px-4.5 py-2.5 text-xs font-semibold text-shelf-cream">
                          Added to shelf ✓
                        </div>
                      ) : (
                        <button
                          onClick={() => addToShelfFromInbox(item.id)}
                          className="rounded-[3px] bg-shelf-cream px-4.5 py-2.5 text-xs font-bold uppercase tracking-wide text-shelf-bg"
                        >
                          + Add to Shelf
                        </button>
                      )}
                      <button
                        onClick={() => dismissFromInbox(item.id)}
                        className="rounded-[3px] border border-shelf-cream/10 px-4.5 py-2.5 text-xs font-medium text-shelf-cream/40"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {inbox.length === 0 && <div className="py-16 text-center text-sm text-white/40">Inbox zero.</div>}
        </div>
      </div>
    </>
  );
}
