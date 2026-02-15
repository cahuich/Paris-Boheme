import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { api, getArticles, getCategories } from "@/lib/api";

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
  const [categories, setCategories] = useState(CATEGORIES);

  const activeCategory = searchParams.get("category") || "all";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [articlesData, categoriesData] = await Promise.all([
          getArticles(activeCategory),
          getCategories(),
        ]);

        setArticles(articlesData);
        setFilteredArticles(articlesData);

        if (categoriesData?.length) {
          setCategories([{ slug: "all", name: "Todos los artículos" }, ...categoriesData]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeCategory]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredArticles(articles);
      return;
    }

    const query = searchQuery.toLowerCase();
    setFilteredArticles(
      articles.filter(
        (a: any) =>
          a.title?.toLowerCase().includes(query) ||
          a.excerpt?.toLowerCase().includes(query)
      )
    );
  }, [searchQuery, articles]);

  const handleCategoryChange = (slug: string) => {
    setSearchParams(slug === "all" ? {} : { category: slug });
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-[#F2EFE9] to-[#FDFBF7]">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <p className="text-[#C5A059] uppercase mb-2">Descubre París</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Nuestros Artículos</h1>
          <p className="text-[#666] text-lg">
            Explora nuestra colección de artículos sobre los lugares más hermosos de París.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-[#E5E5E5]">
        <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row justify-between gap-6">
          <div className="flex items-center gap-2 overflow-x-auto">
            <Filter className="w-5 h-5 text-[#666]" />
            {categories.map((category) => (
              <button
                key={category.slug}
                onClick={() => handleCategoryChange(category.slug)}
                className={`filter-tab ${activeCategory === category.slug ? "active" : ""}`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
            <Input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <ArticleCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[#666] text-lg mb-4">No se encontraron artículos.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  handleCategoryChange("all");
                }}
                className="btn-secondary"
              >
                Ver todos
              </button>
            </div>
          ) : (
            <>
              <p className="text-[#666] mb-8">
                {filteredArticles.length} artículo{filteredArticles.length > 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((article, index) => (
                  <ArticleCard key={article.id} article={article} index={index} />
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
