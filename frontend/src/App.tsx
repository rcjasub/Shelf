import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LibraryProvider } from "./context/LibraryContext";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Shelf from "./pages/Shelf";
import BookDetail from "./pages/BookDetail";
import Inbox from "./pages/Inbox";
import Friends from "./pages/Friends";
import AddBook from "./pages/AddBook";
import CurrentlyReading from "./pages/CurrentlyReading";

export default function App() {
  return (
    <AuthProvider>
      <LibraryProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/shelf" element={<Shelf />} />
              <Route path="/books/:id" element={<BookDetail />} />
              <Route path="/inbox" element={<Inbox />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/friends/:friendId" element={<Friends />} />
              <Route path="/add-book" element={<AddBook />} />
              <Route path="/reading/:id" element={<CurrentlyReading />} />
            </Route>
          </Route>
        </Routes>
      </LibraryProvider>
    </AuthProvider>
  );
}
