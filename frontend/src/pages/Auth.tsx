import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GoogleSignInButton from "../components/GoogleSignInButton";

export default function Auth() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) navigate("/shelf", { replace: true });
  }, [isLoading, isAuthenticated, navigate]);

  const inputClass =
    "w-full rounded-[3px] border border-shelf-cream/10 bg-shelf-bg/50 px-4 py-3 font-sans text-sm text-shelf-cream/40 outline-none placeholder:text-shelf-cream/25 cursor-not-allowed";

  return (
    <div className="relative flex min-h-[calc(100vh-56px)] items-center justify-center overflow-hidden px-5 py-10">
      <div
        className="animate-bg-drift absolute inset-0"
        style={{
          backgroundImage: "url(/assets/landing-hero-3.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(16px)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 to-black/82" />
      <div className="animate-fade-up relative z-10 w-[400px] max-w-full rounded-lg border border-shelf-cream/10 bg-[#0d0f0c]/95 p-9">
        <div className="mb-1.5 text-center text-xl font-extrabold tracking-tight text-[#f7f3ea]">SHELF</div>
        <div className="mb-7 text-center text-xs text-shelf-cream/45">Sign in to your shelf</div>

        <div className="flex justify-center">
          <GoogleSignInButton />
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-shelf-cream/10" />
          <div className="text-[10px] uppercase tracking-wide text-shelf-cream/40">email &amp; password</div>
          <div className="h-px flex-1 bg-shelf-cream/10" />
        </div>

        <div className="flex flex-col gap-3">
          <input placeholder="Email" disabled className={inputClass} />
          <input type="password" placeholder="Password" disabled className={inputClass} />
          <button
            disabled
            className="rounded-[3px] border border-shelf-cream/10 py-3 text-xs font-bold uppercase tracking-wide text-shelf-cream/25"
          >
            Coming soon
          </button>
        </div>
      </div>
    </div>
  );
}
