import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLibrary } from "../../context/LibraryContext";
import AnimatedLogo from "../AnimatedLogo";
import NavLabel from "../NavLabel";

const NAV_ITEMS = [
  { to: "/shelf", label: "Shelf" },
  { to: "/reading", label: "Reading" },
  { to: "/friends", label: "Friends" },
  { to: "/inbox", label: "Inbox" },
];

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

export default function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { inbox } = useLibrary();
  const unreadCount = inbox.filter((i) => i.status === "unread").length;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="fixed inset-x-0 top-0 z-100 flex h-14 items-stretch border-b border-shelf-cream/8 bg-[#0d0f0c] px-12">
      <div className="mr-12 flex flex-shrink-0 items-center">
        <AnimatedLogo onClick={() => navigate("/")} className="cursor-pointer" />
      </div>

      {isAuthenticated && (
        <nav className="flex flex-1 items-stretch gap-0.5">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex items-center gap-1.5 px-4 text-[13px] font-medium uppercase tracking-wide text-shelf-cream/55 hover:text-shelf-cream"
            >
              {({ isActive }) => (
                <>
                  <NavLabel label={item.label} active={isActive} />
                  {item.to === "/inbox" && unreadCount > 0 && (
                    <span className="rounded-full bg-shelf-accent px-1.5 py-px text-[9px] font-bold leading-tight text-shelf-bg">
                      {unreadCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      )}

      <div className="ml-auto flex flex-shrink-0 items-center gap-4">
        {isAuthenticated && user ? (
          <>
            <NavLink
              to="/add-book"
              className="rounded-[3px] border border-shelf-accent/45 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-shelf-accent transition-colors hover:bg-shelf-accent/10"
            >
              + Add Book
            </NavLink>
            <div className="text-right">
              <div className="text-xs font-semibold leading-tight text-[#f7f3ea]">{user.name}</div>
              <div className="text-[10px] text-shelf-cream/45">{user.email}</div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="flex h-8.5 w-8.5 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#2b2b2b] to-[#0c0c0c] text-[11px] font-bold text-[#f7f3ea]"
            >
              {user.pictureUrl ? (
                <img src={user.pictureUrl} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                initialsOf(user.name)
              )}
            </button>
          </>
        ) : (
          <NavLink
            to="/auth"
            className="rounded-[3px] bg-shelf-accent px-4 py-1.5 text-[12px] font-bold uppercase tracking-wide text-shelf-ink"
          >
            Sign In
          </NavLink>
        )}
      </div>
    </header>
  );
}
