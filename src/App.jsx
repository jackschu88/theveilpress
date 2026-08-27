import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Books from "./pages/Books";
import SquareMile from "./pages/SquareMile";
import Companion from "./pages/Companion";
import HybridCheckout from "./pages/HybridCheckout";
import About from "./pages/About";
import Presale from "./pages/Presale";
import ExecutiveFounder from "./pages/ExecutiveFounder";
import ThankYou from "./pages/ThankYou";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* SPA leftover — Astro `/` is the live storefront */}
        <Route index element={<Presale />} />
        <Route path="presale" element={<Navigate to="/" replace />} />
        <Route path="presale/executive" element={<ExecutiveFounder />} />
        <Route path="presale/executive/thank-you" element={<ThankYou />} />
        {/* Cinematic trailer / marketing page kept under /home */}
        <Route path="home" element={<Home />} />
        <Route path="books" element={<Books />} />
        <Route path="books/square-mile" element={<SquareMile />} />
        <Route path="books/square-mile/companion" element={<Companion />} />
        <Route path="books/square-mile/companion/print" element={<Companion />} />
        <Route path="books/square-mile/companion/ebook" element={<Companion />} />
        <Route
          path="books/square-mile/checkout/:planId"
          element={<HybridCheckout />}
        />
        <Route path="about" element={<About />} />
      </Route>
    </Routes>
  );
}
