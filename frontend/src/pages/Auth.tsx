import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Auth() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    login();
    navigate("/shelf");
  };

  const inputClass =
    "w-full rounded-[3px] border border-shelf-cream/12 bg-shelf-bg px-4 py-3 font-sans text-sm text-shelf-cream outline-none placeholder:text-shelf-cream/35 focus:border-shelf-accent/50";

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
        <div className="mb-6 text-center text-xl font-extrabold tracking-tight text-[#f7f3ea]">SHELF</div>
        <div className="mb-6.5 flex justify-center gap-6 border-b border-shelf-cream/10">
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`pb-3 text-sm font-medium ${
                mode === m ? "border-b-2 border-shelf-accent text-shelf-cream" : "text-shelf-cream/40"
              }`}
            >
              {m === "signin" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {mode === "signup" && (
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className={inputClass} />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className={inputClass}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className={inputClass}
          />
          <button
            type="submit"
            className="mt-1 rounded-[3px] bg-shelf-accent py-3.5 text-xs font-bold uppercase tracking-wide text-shelf-ink transition-transform hover:-translate-y-0.5"
          >
            {mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-shelf-cream/10" />
          <div className="text-[10px] uppercase tracking-wide text-shelf-cream/40">or continue with</div>
          <div className="h-px flex-1 bg-shelf-cream/10" />
        </div>
        <div className="flex flex-col gap-2.5">
          <button className="rounded-[3px] border border-shelf-cream/18 py-2.5 text-xs font-medium text-shelf-cream/85 hover:bg-shelf-cream/6">
            Continue with Google
          </button>
          <button className="rounded-[3px] border border-shelf-cream/18 py-2.5 text-xs font-medium text-shelf-cream/85 hover:bg-shelf-cream/6">
            Continue with Apple
          </button>
        </div>
        <div className="mt-6 text-center text-xs text-shelf-cream/50">
          {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
          <span
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="cursor-pointer font-semibold text-shelf-accent"
          >
            {mode === "signin" ? "Sign Up" : "Sign In"}
          </span>
        </div>
      </div>
    </div>
  );
}
