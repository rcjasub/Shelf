import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

export default function GoogleSignInButton() {
  const buttonRef = useRef<HTMLDivElement>(null);
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!CLIENT_ID) return;

    let cancelled = false;
    const tryInit = () => {
      if (cancelled || !window.google || !buttonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: async (response) => {
          try {
            await loginWithGoogle(response.credential);
            navigate("/shelf");
          } catch {
            setError("Sign-in failed. Please try again.");
          }
        },
      });
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        width: 320,
      });
    };

    // The GIS script is loaded async in index.html, so it may not be ready yet.
    if (window.google) {
      tryInit();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          clearInterval(interval);
          tryInit();
        }
      }, 100);
      return () => {
        cancelled = true;
        clearInterval(interval);
      };
    }
  }, [loginWithGoogle, navigate]);

  if (!CLIENT_ID) {
    return (
      <div className="rounded-[3px] border border-dashed border-shelf-cream/25 px-4 py-3 text-center text-[11px] leading-relaxed text-shelf-cream/45">
        Google sign-in isn't configured yet. Set VITE_GOOGLE_CLIENT_ID in frontend/.env.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div ref={buttonRef} />
      {error && <div className="text-xs text-red-400">{error}</div>}
    </div>
  );
}
