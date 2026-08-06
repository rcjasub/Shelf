import { useLayoutEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import gsap from "gsap";
import Header from "./Header";
import SendRecModal from "../SendRecModal";

export default function Layout() {
  const location = useLocation();
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!contentRef.current) return;
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen font-sans text-shelf-cream">
      <Header />
      <main className="min-h-screen pt-14">
        <div key={location.pathname} ref={contentRef}>
          <Outlet />
        </div>
      </main>
      <SendRecModal />
    </div>
  );
}
