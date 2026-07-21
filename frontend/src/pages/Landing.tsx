import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BOOKS } from "../data/mockBooks";
import { useHeroParallax } from "../hooks/useHeroParallax";
import AnimatedHeadline from "../components/AnimatedHeadline";
import LoopingText from "../components/LoopingText";

const BLOBS = [
  { bg: "#5BD98B", top: "5%", left: "0%" },
  { bg: "#7C7FE0", top: "15%", left: "32%" },
  { bg: "#E67BC7", top: "8%", left: "62%" },
  { bg: "#FF5A3F", top: "12%", left: "85%" },
];

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { sectionRef, mediaRef, contentRef, spotlightRef, onPointerMove } = useHeroParallax();

  const enterShelf = () => navigate(isAuthenticated ? "/shelf" : "/auth");

  return (
    <div>
      <div ref={sectionRef} className="relative" style={{ height: "220vh" }}>
        <div
          className="sticky top-0 flex h-[calc(100vh-56px)] items-center overflow-hidden bg-shelf-accent"
          onPointerMove={onPointerMove}
        >
          <div
            ref={mediaRef}
            className="absolute inset-0 top-0 overflow-hidden will-change-transform"
            style={{
              maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
            }}
          >
            <div className="absolute" style={{ inset: "-15%" }}>
              {BLOBS.map((blob, i) => (
                <div
                  key={i}
                  className="absolute h-[440px] w-[520px] rounded-full opacity-90"
                  style={{ background: blob.bg, top: blob.top, left: blob.left, filter: "blur(70px)" }}
                />
              ))}
            </div>
          </div>

          <div
            ref={spotlightRef}
            className="pointer-events-none absolute left-0 top-0 z-3 h-[420px] w-[420px] rounded-full will-change-transform"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 45%, transparent 70%)",
              mixBlendMode: "overlay",
            }}
          />

          <div ref={contentRef} className="relative z-5 max-w-xl px-16 will-change-transform">
            <div className="mb-4.5 font-mono text-[11px] uppercase tracking-widest text-shelf-ink/60">
              A reading log, not a feed
            </div>
            <h1 className="mb-5 font-serif text-5xl leading-[1.05] text-shelf-ink text-balance">
              <AnimatedHeadline text="Every book worth reading came from someone." />
            </h1>
            <p className="mb-8 max-w-[460px] text-[15px] leading-relaxed text-shelf-ink/68 text-balance">
              Track what you read. Send a book to a friend with a note attached. When they finish it, you get their
              honest take back — no algorithm in between.
            </p>
            <button
              onClick={enterShelf}
              className="inline-flex items-center gap-2 rounded-[3px] bg-shelf-ink px-7.5 py-3.5 text-[13px] font-bold uppercase tracking-wide text-shelf-accent transition-transform hover:-translate-y-0.5"
            >
              <LoopingText text="Enter Your Shelf →" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-3 bg-shelf-bg px-13 pb-24 pt-20">
        <div className="mb-3.5 text-[11px] uppercase tracking-[0.25em] text-white/50">Trending this week</div>
        <div className="mb-9 max-w-[520px] font-serif text-[34px] text-shelf-cream text-balance">
          What everyone's adding to their shelf
        </div>
        <div className="grid grid-cols-2 gap-5.5 sm:grid-cols-3 lg:grid-cols-6">
          {BOOKS.slice(0, 6).map((book) => (
            <div key={book.id} onClick={enterShelf} className="cursor-pointer">
              <div className="relative aspect-[2/3] overflow-hidden rounded-[3px] border border-shelf-cream/10">
                <div className="absolute inset-0" style={{ background: book.coverBg }} />
                <div className="absolute inset-y-0 left-0 w-[5px]" style={{ background: book.coverSpine }} />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2.5">
                  <div className="font-serif text-xs leading-tight text-shelf-cream">{book.title}</div>
                </div>
              </div>
              <div className="mt-2 text-[11px] text-white/55">{book.author}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
