import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "@/lib/api";

import { Search, Filter } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleCard } from "@/components/ArticleCard";
import { ArticleCardSkeleton } from "@/components/LoadingSkeleton";
import { Input } from "@/components/ui/input";

const CATEGORIES = [
  { slug: "all", name: "Todos los artículos" },
  { slug: "monumentos", name: "Monumentos" },
  { slug: "museos", name: "Museos" },
  { slug: "barrios", name: "Barrios" },
  { slug: "paseos", name: "Paseos" },
];

export default function ArticlesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState<any[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const activeCategory = searchParams.get("category") || "all";

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);

        const res = await api.get("/articles", {
          params:
            activeCategory !== "all"
              ? { category: activeCategory }
              : {},
        });

        setArticles(res.data);
        setFilteredArticles(res.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [activeCategory]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredArticles(articles);
      return;
    }

    const query = searchQuery.toLowerCase();

    const filtered = articles.filter((article: any) =>
      article.title?.toLowerCase().includes(query) ||
      article.excerpt?.toLowerCase().includes(query)
    );

    setFilteredArticles(filtered);
  }, [searchQuery, articles]);

  const handleCategoryChange = (slug: string) => {
    setSearchParams(slug === "all" ? {} : { category: slug });
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header />
      {/* resto del JSX intacto */}
      <Footer />
    </div>
  );
}
