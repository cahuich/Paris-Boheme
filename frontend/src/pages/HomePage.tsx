import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://paris-boheme-api.onrender.com";
const API = `${API_BASE}/api`;

interface Article {
  id: number;
  title: string;
  summary: string;
}

export default function HomePage() {
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const [featuredRes, articlesRes] = await Promise.all([
          axios.get(`${API}/featured-articles`),
          axios.get(`${API}/articles`)
        ]);
        setFeaturedArticles(featuredRes.data);
        setArticles(articlesRes.data);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError("No se pudo cargar la información.");
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen p-6 bg-[#FDFBF7]">
      <h1 className="text-3xl font-bold mb-6">Artículos Destacados</h1>
      <ul className="mb-8">
        {featuredArticles.map((a) => (
          <li key={a.id} className="mb-4 border-b pb-2">
            <strong>{a.title}</strong>
            <p>{a.summary}</p>
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold mb-4">Todos los Artículos</h2>
      <ul>
        {articles.map((a) => (
          <li key={a.id} className="mb-3">
            <strong>{a.title}</strong>: {a.summary}
          </li>
        ))}
      </ul>
    </div>
  );
}
