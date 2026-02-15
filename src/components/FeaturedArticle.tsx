import React from "react";
import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";

interface Article {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  image_url?: string;
  category: string;
  reading_time?: number;
}

interface FeaturedArticleProps {
  article: Article;
  size?: "normal" | "large";
}

const categoryColors: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  monumentos: {
    bg: "bg-white/20",
    text: "text-white",
    label: "Monumentos",
  },
  museos: {
    bg: "bg-[#C5A059]/30",
    text: "text-white",
    label: "Museos",
  },
  barrios: {
    bg: "bg-green-500/20",
    text: "text-white",
    label: "Barrios",
  },
  paseos: {
    bg: "bg-purple-500/20",
    text: "text-white",
    label: "Paseos",
  },
};

export const FeaturedArticle: React.FC<FeaturedArticleProps> = ({
  article,
  size = "normal",
}) => {
  if (!article) return null;

  const category =
    categoryColors[article.category] || categoryColors.monumentos;

  const isLarge = size === "large";

  return (
    <Link
      to={`/articles/${article.slug}`}
      data-testid={`featured-article-${article.slug}`}
      className={`featured-card group block relative overflow-hidden rounded-2xl ${
        isLarge ? "h-[500px] md:h-[600px]" : "h-[300px]"
      }`}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={
            article.image_url ||
            "https://via.placeholder.com/1200x800?text=Paris+Boheme"
          }
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 md:p-8">
        {/* Category & Reading Time */}
        <div className="flex items-center gap-3 mb-3">
          <span
            className={`category-badge backdrop-blur-sm ${category.bg} ${category.text}`}
          >
            {category.label}
          </span>

          <span className="flex items-center gap-1 text-sm text-white/80">
            <Clock className="w-4 h-4" />
            {article.reading_time ?? 5} min
          </span>
        </div>

        {/* Title */}
        <h3
          className={`font-['Playfair_Display'] font-semibold text-white mb-3 ${
            isLarge ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"
          }`}
        >
          {article.title}
        </h3>

        {/* Excerpt (solo si es grande y existe) */}
        {isLarge && article.excerpt && (
          <p className="text-white/80 text-base leading-relaxed line-clamp-2 mb-4 max-w-2xl">
            {article.excerpt}
          </p>
        )}

        {/* CTA */}
        <div className="flex items-center gap-2 text-white font-medium text-sm group-hover:text-[#C5A059] transition-colors">
          <span>Descubrir</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};
