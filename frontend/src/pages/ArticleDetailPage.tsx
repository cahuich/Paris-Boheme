import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/articles/${slug}`);
        setArticle(res.data);
      } catch (err) {
        console.error("Error fetching article:", err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchArticle();
  }, [slug]);

  if (loading) return <p className="text-center py-16">Cargando artículo...</p>;
  if (!article) return <p className="text-center py-16">Artículo no encontrado</p>;

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
        <p className="text-gray-600 mb-8">{article.publishedAt}</p>
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
        <Link to="/articles" className="text-blue-600 mt-8 inline-block">
          ← Volver a artículos
        </Link>
      </main>
      <Footer />
    </div>
  );
}
