import React from "react";
import "@/App.css";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import HomePage from "@/pages/HomePage";
import ArticlesPage from "@/pages/ArticlesPage";
import ArticleDetailPage from "@/pages/ArticleDetailPage";

function App() {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/articles/:slug" element={<ArticleDetailPage />} />
      </Routes>

      <Toaster position="top-right" />
    </div>
  );
}

export default App;
