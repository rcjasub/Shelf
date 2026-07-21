import { useEffect, useRef } from "react";

const smootherstep = (p: number) => p * p * (3 - 2 * p);

export function useHeroParallax() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const heroTarget = useRef(0);
  const heroCurrent = useRef(0);
  const spotTarget = useRef({ x: 400, y: 200 });
  const spotCurrent = useRef({ x: 400, y: 200 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const computeHeroTarget = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      heroTarget.current = total <= 0 ? 0 : Math.max(0, Math.min(1, -rect.top / total));
    };

    const tick = () => {
      computeHeroTarget();
      heroCurrent.current += (heroTarget.current - heroCurrent.current) * 0.085;
      if (Math.abs(heroTarget.current - heroCurrent.current) < 0.0005) {
        heroCurrent.current = heroTarget.current;
      }

      const media = mediaRef.current;
      const content = contentRef.current;
      if (media && content) {
        const ease = smootherstep(heroCurrent.current);
        media.style.transform = `scale(${1 + 0.4 * ease})`;
        content.style.transform = `scale(${1 - 0.15 * ease})`;
        content.style.opacity = `${1 - Math.min(1, ease / 0.6)}`;
      }

      const spotlight = spotlightRef.current;
      if (spotlight) {
        spotCurrent.current.x += (spotTarget.current.x - spotCurrent.current.x) * 0.1;
        spotCurrent.current.y += (spotTarget.current.y - spotCurrent.current.y) * 0.1;
        spotlight.style.transform = `translate(${spotCurrent.current.x}px, ${spotCurrent.current.y}px) translate(-50%, -50%)`;
      }

      rafId.current = requestAnimationFrame(tick);
    };

    computeHeroTarget();
    window.addEventListener("scroll", computeHeroTarget, { passive: true });
    window.addEventListener("resize", computeHeroTarget);
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", computeHeroTarget);
      window.removeEventListener("resize", computeHeroTarget);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const onPointerMove = (ev: React.PointerEvent<HTMLDivElement>) => {
    const rect = ev.currentTarget.getBoundingClientRect();
    spotTarget.current = { x: ev.clientX - rect.left, y: ev.clientY - rect.top };
  };

  return { sectionRef, mediaRef, contentRef, spotlightRef, onPointerMove };
}
