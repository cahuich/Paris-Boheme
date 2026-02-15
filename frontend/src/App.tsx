import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "@/pages/HomePage";
import { ArticlesPage } from "@/pages/ArticlesPage";
import { ArticleDetailPage } from "@/pages/ArticleDetailPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const basename = process.env.REACT_APP_BASENAME || "/";

export function App() {
  return (
    <BrowserRouter basename={basename}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/articles/:id" element={<ArticleDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
