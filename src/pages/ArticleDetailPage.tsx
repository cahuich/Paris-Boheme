import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

import {
  ArrowLeft,
  Clock,
  Calendar,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  ChevronUp,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleCard } from "@/components/ArticleCard";


const categoryColors = {
  monumentos: {
    bg: "bg-[#1A2B4C]/10",
    text: "text-[#1A2B4C]",
    label: "Monumentos",
  },
  museos: {
    bg: "bg-[#C5A059]/15",
    text: "text-[#9A7B3D]",
    label: "Museos",
  },
  barrios: {
    bg: "bg-green-600/10",
    text: "text-green-700",
    label: "Barrios",
  },
  paseos: {
    bg: "bg-purple-600/10",
    text: "text-purple-700",
    label: "Paseos",
  },
};

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/articles/${slug}`);
        setArticle(res.data);

        // Fetch related articles from same category
        const relatedRes = await axios.get(`${API}/articles`, {
          params: { category: res.data.category },
        });
        setRelatedArticles(
          relatedRes.data.filter((a) => a.slug !== slug).slice(0, 3)
        );
      } catch (error) {
        console.error("Error fetching article:", error);
        navigate("/articles");
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
    window.scrollTo(0, 0);
  }, [slug, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(progress, 100));
      setShowBackToTop(scrollTop > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const shareUrl = window.location.href;
  const shareTitle = article?.title || "";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        <Header />
        <div className="pt-32 pb-16">
          <div className="container mx-auto px-4 md:px-8 max-w-4xl">
            <div className="skeleton h-8 w-32 rounded mb-8" />
            <div className="skeleton h-12 w-full rounded mb-4" />
            <div className="skeleton h-12 w-3/4 rounded mb-8" />
            <div className="skeleton aspect-video rounded-2xl mb-8" />
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton h-4 w-full rounded" />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return null;
  }

  const category = categoryColors[article.category] || categoryColors.monumentos;
  const formattedDate = new Date(article.created_at).toLocaleDateString(
    "es-MX",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Reading Progress Bar */}
      <div
        data-testid="reading-progress"
        className="reading-progress"
        style={{ width: `${readingProgress}%` }}
      />

      <Header />

      {/* Article Header */}
      <section data-testid="article-header" className="pt-32 pb-8">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          {/* Back Button */}
          <Link
            to="/articles"
            data-testid="back-to-articles"
            className="inline-flex items-center gap-2 text-[#666] hover:text-[#1A2B4C] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a artículos
          </Link>

          {/* Category & Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className={`category-badge ${category.bg} ${category.text}`}>
              {category.label}
            </span>
            <div className="flex items-center gap-4 text-[#666] text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {article.reading_time} min de lectura
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="font-['Playfair_Display'] text-3xl md:text-5xl font-bold text-[#1A1A1A] mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Excerpt */}
          <p className="text-[#666] text-lg md:text-xl leading-relaxed mb-8">
            {article.excerpt}
          </p>
        </div>
      </section>

      {/* Featured Image */}
      <section data-testid="article-image" className="pb-8">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full aspect-video object-cover"
            />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section data-testid="article-content" className="py-8">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="flex gap-8">
            {/* Share Sidebar - Desktop */}
            <aside className="hidden lg:block w-16 flex-shrink-0">
              <div className="sticky top-32 flex flex-col gap-3">
                <span className="text-xs text-[#666] uppercase tracking-wider mb-2">
                  Compartir
                </span>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    shareUrl
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="share-facebook"
                  className="share-btn"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    shareUrl
                  )}&text=${encodeURIComponent(shareTitle)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="share-twitter"
                  className="share-btn"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                    shareUrl
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="share-linkedin"
                  className="share-btn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </aside>

            {/* Content */}
            <div className="flex-1">
              <article
                className="article-content prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Mobile Share */}
              <div className="lg:hidden mt-12 pt-8 border-t border-[#E5E5E5]">
                <div className="flex items-center gap-4">
                  <Share2 className="w-5 h-5 text-[#666]" />
                  <span className="text-[#666] text-sm">Compartir:</span>
                  <div className="flex gap-2">
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        shareUrl
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="share-btn"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                        shareUrl
                      )}&text=${encodeURIComponent(shareTitle)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="share-btn"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                        shareUrl
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="share-btn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section
          data-testid="related-articles"
          className="py-16 bg-[#F2EFE9]"
        >
          <div className="container mx-auto px-4 md:px-8 max-w-7xl">
            <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-semibold text-[#1A1A1A] mb-8">
              Artículos similares
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map((relatedArticle, index) => (
                <ArticleCard
                  key={relatedArticle.id}
                  article={relatedArticle}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        data-testid="back-to-top"
        className={`back-to-top ${showBackToTop ? "visible" : ""}`}
      >
        <ChevronUp className="w-6 h-6" />
      </button>

      <Footer />
    </div>
  );
}
