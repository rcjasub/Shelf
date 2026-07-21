import { Outlet } from "react-router-dom";
import Header from "./Header";
import SendRecModal from "../SendRecModal";

export default function Layout() {
  return (
    <div className="min-h-screen bg-shelf-bg font-sans text-shelf-cream">
      <Header />
      <main className="min-h-screen pt-14">
        <Outlet />
      </main>
      <SendRecModal />
    </div>
  );
}
