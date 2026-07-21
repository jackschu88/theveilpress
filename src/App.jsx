import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Books from "./pages/Books";
import SquareMile from "./pages/SquareMile";
import Companion from "./pages/Companion";
import About from "./pages/About";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="books" element={<Books />} />
        <Route path="books/square-mile" element={<SquareMile />} />
        <Route path="books/square-mile/companion" element={<Companion />} />
        <Route path="books/square-mile/companion/print" element={<Companion />} />
        <Route path="books/square-mile/companion/ebook" element={<Companion />} />
        <Route path="about" element={<About />} />
      </Route>
    </Routes>
  );
}
