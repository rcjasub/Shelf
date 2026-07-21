import { useState } from "react";
import { useLibrary } from "../context/LibraryContext";
import BookCover from "./BookCover";
import ShinyText from "./ShinyText";
import Stepper, { Step } from "./Stepper";

function indicatorClass(status: "active" | "inactive" | "complete") {
  return status === "inactive" ? "bg-shelf-cream/10 text-shelf-cream/40" : "bg-shelf-accent text-shelf-ink";
}

export default function SendRecModal() {
  const { rec, books, friends, closeRec, selectRecBook, selectRecFriend, setRecNote, submitRec, getBook, getFriend } =
    useLibrary();
  const [visibleStep, setVisibleStep] = useState(rec.bookId ? 2 : 1);

  if (!rec.open) return null;

  const selectedBook = rec.bookId ? getBook(rec.bookId) : undefined;
  const selectedFriend = rec.friendId ? getFriend(rec.friendId) : undefined;

  const nextDisabled = (visibleStep === 1 && !rec.bookId) || (visibleStep === 2 && !rec.friendId);

  return (
    <div
      onClick={closeRec}
      className="animate-fade-in fixed inset-0 z-200 flex items-center justify-center bg-black/82"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-up relative max-h-[88vh] w-[580px] max-w-[92vw] overflow-y-auto rounded-lg border border-shelf-cream/10 bg-shelf-panel"
      >
        <div className="flex items-start justify-between border-b border-shelf-cream/7 px-7 py-6">
          <div className="font-serif text-2xl">
            <ShinyText
              text="Send a Rec"
              speed={2}
              delay={0}
              color="#f3e1cc"
              shineColor="#ffffff"
              spread={120}
              direction="left"
              yoyo={false}
              pauseOnHover={false}
              disabled={false}
            />
          </div>
          <div onClick={closeRec} className="-mt-0.5 cursor-pointer px-1.5 text-2xl leading-none text-white/55">
            ×
          </div>
        </div>

        {rec.sent ? (
          <div className="animate-fade-up px-7 py-13 text-center">
            <div className="mb-4 text-4xl text-shelf-cream">✦</div>
            <div className="mb-2.5 font-serif text-3xl text-shelf-cream">Rec sent</div>
            <div className="mx-auto mb-7 max-w-[300px] text-sm leading-relaxed text-white/55">
              It'll land in their inbox — with your note, not an algorithm.
            </div>
            <button
              onClick={closeRec}
              className="rounded-[3px] bg-shelf-cream px-7 py-2.5 text-xs font-bold uppercase tracking-wide text-shelf-bg"
            >
              Done
            </button>
          </div>
        ) : (
          <Stepper
            className="w-full"
            initialStep={rec.bookId ? 2 : 1}
            onStepChange={setVisibleStep}
            onFinalStepCompleted={submitRec}
            backButtonText="Back"
            nextButtonText="Next"
            stepCircleContainerClassName="!max-w-none !rounded-none !shadow-none"
            stepContainerClassName="!p-6 !pb-0"
            contentClassName="!px-0"
            nextButtonProps={{
              disabled: nextDisabled,
              className: `rounded-[3px] px-6 py-2.5 text-xs font-bold uppercase tracking-wide transition ${
                nextDisabled
                  ? "cursor-not-allowed bg-shelf-cream/20 text-shelf-cream/40"
                  : "bg-shelf-cream text-shelf-bg hover:-translate-y-0.5"
              }`,
            }}
            backButtonProps={{
              className:
                "rounded-[3px] border border-shelf-cream/12 px-4.5 py-2.5 text-xs font-medium text-shelf-cream/50",
            }}
            renderStepIndicator={({ step, currentStep }) => {
              const status = currentStep === step ? "active" : currentStep < step ? "inactive" : "complete";
              return (
                <div
                  className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${indicatorClass(status)}`}
                >
                  {step}
                </div>
              );
            }}
          >
            <Step>
              <div className="mb-4 text-[11px] uppercase tracking-widest text-white/55">1 — Choose a book</div>
              <div className="mb-2 grid grid-cols-2 gap-2">
                {books.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => selectRecBook(book.id)}
                    className={`flex cursor-pointer items-center gap-3 rounded-md border p-2.5 ${
                      rec.bookId === book.id
                        ? "border-shelf-accent/60 bg-shelf-accent/5"
                        : "border-shelf-cream/8 hover:border-shelf-cream/20"
                    }`}
                  >
                    <div className="h-12 w-9 flex-shrink-0 rounded-sm" style={{ background: book.coverBg }} />
                    <div className="min-w-0">
                      <div className="truncate font-serif text-sm text-shelf-cream">{book.title}</div>
                      <div className="mt-0.5 text-[11px] text-white/55">{book.author}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Step>

            <Step>
              <div className="mb-4 text-[11px] uppercase tracking-widest text-white/55">2 — Choose a friend</div>
              <div className="mb-2 flex flex-col gap-2">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    onClick={() => selectRecFriend(friend.id)}
                    className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 ${
                      rec.friendId === friend.id
                        ? "border-shelf-accent/60 bg-shelf-accent/5"
                        : "border-shelf-cream/8 hover:border-shelf-cream/20"
                    }`}
                  >
                    <div
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-shelf-accent"
                      style={{ background: friend.avatarBg }}
                    >
                      {friend.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-shelf-cream">{friend.name}</div>
                      <div className="mt-0.5 text-xs text-white/55">
                        {friend.booksRead} books read · {friend.sharedBooks} in common
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Step>

            <Step>
              <div className="mb-4 text-[11px] uppercase tracking-widest text-white/55">3 — Write your note</div>
              {selectedBook && (
                <div className="mb-5 flex items-center gap-3.5 rounded-md bg-[#f0ebe0] p-3.5">
                  <BookCover title="" bg={selectedBook.coverBg} spine={selectedBook.coverSpine} />
                  <div>
                    <div className="font-serif text-[17px] leading-tight text-shelf-ink">{selectedBook.title}</div>
                    {selectedFriend && (
                      <div className="mt-1 text-xs text-shelf-ink/70">→ {selectedFriend.name}</div>
                    )}
                  </div>
                </div>
              )}
              <textarea
                value={rec.note}
                onChange={(e) => setRecNote(e.target.value)}
                placeholder="Tell them why you thought of them…"
                className="mb-2 block h-32 w-full resize-none rounded-md border border-shelf-cream/9 bg-[#f0ebe0] p-4 font-sans text-sm leading-relaxed text-shelf-ink outline-none"
              />
            </Step>
          </Stepper>
        )}
      </div>
    </div>
  );
}
