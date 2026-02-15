import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Search, Filter } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleCard } from "@/components/ArticleCard";
import { ArticleCardSkeleton } from "@/components/LoadingSkeleton";
import { Input } from "@/components/ui/input";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "https://paris-boheme-api.onrender.com";
const API = `${API_BASE}/api`;

const CATEGORIES = [
  { slug: "all", name: "Todos los artículos" },
  { slug: "monumentos", name: "Monumentos" },
  { slug: "museos", name: "Museos" },
  { slug: "barrios", name: "Barrios" },
  { slug: "paseos", name: "Paseos" },
];

export default function ArticlesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const activeCategory = searchParams.get("category") || "all";

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/articles`, {
          params: activeCategory !== "all" ? { category: activeCategory } : {},
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
    if (searchQuery.trim() === "") {
      setFilteredArticles(articles);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = articles.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.excerpt.toLowerCase().includes(query)
      );
      setFilteredArticles(filtered);
    }
  }, [searchQuery, articles]);

  const handleCategoryChange = (slug) => {
    setSearchParams(slug === "all" ? {} : { category: slug });
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header />

      {/* Hero Section */}
      <section
        data-testid="articles-hero"
        className="pt-32 pb-16 bg-gradient-to-b from-[#F2EFE9] to-[#FDFBF7]"
      >
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-[#C5A059] font-medium tracking-widest uppercase mb-2">
              Descubre París
            </p>
            <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">
              Nuestros Artículos
            </h1>
            <p className="text-[#666] text-lg">
              Explora nuestra colección de artículos sobre los lugares más
              hermosos de París.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section data-testid="filters-section" className="py-8 border-b border-[#E5E5E5]">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Category Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              <Filter className="w-5 h-5 text-[#666] flex-shrink-0" />
              {CATEGORIES.map((category) => (
                <button
                  key={category.slug}
                  data-testid={`filter-${category.slug}`}
                  onClick={() => handleCategoryChange(category.slug)}
                  className={`filter-tab whitespace-nowrap ${
                    activeCategory === category.slug ? "active" : ""
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
              <Input
                type="text"
                placeholder="Buscar..."
                data-testid="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-[#E5E5E5] focus:border-[#C5A059] focus:ring-[#C5A059]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section data-testid="articles-grid" className="py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <ArticleCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredArticles.length === 0 ? (
            <div
              data-testid="no-articles-message"
              className="text-center py-16"
            >
              <p className="text-[#666] text-lg mb-4">
                No se encontraron artículos para esta búsqueda.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  handleCategoryChange("all");
                }}
                className="btn-secondary"
              >
                Ver todos los artículos
              </button>
            </div>
          ) : (
            <>
              <p className="text-[#666] mb-8">
                {filteredArticles.length} artículo
                {filteredArticles.length > 1 ? "s" : ""} encontrado
                {filteredArticles.length > 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((article, index) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    index={index}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
