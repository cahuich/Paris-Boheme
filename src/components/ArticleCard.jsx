import React from "react";
import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";

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

export const ArticleCard = ({ article, index = 0 }) => {
  const category = categoryColors[article.category] || categoryColors.monumentos;

  return (
    <Link
      to={`/article/${article.slug}`}
      data-testid={`article-card-${article.slug}`}
      className={`article-card group block animate-fade-in-up`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image */}
      <div className="image-hover-zoom aspect-[4/3]">
        <img
          src={article.image_url}
          alt={article.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category & Reading Time */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={`category-badge ${category.bg} ${category.text}`}
          >
            {category.label}
          </span>
          <span className="flex items-center gap-1 text-sm text-[#666]">
            <Clock className="w-4 h-4" />
            {article.reading_time} min
          </span>
        </div>

        {/* Title */}
        <h3 className="font-['Playfair_Display'] text-xl font-semibold text-[#1A1A1A] mb-2 group-hover:text-[#C5A059] transition-colors line-clamp-2">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-[#666] text-sm leading-relaxed line-clamp-2 mb-4">
          {article.excerpt}
        </p>

        {/* Read More */}
        <div className="flex items-center gap-2 text-[#1A2B4C] font-medium text-sm group-hover:text-[#C5A059] transition-colors">
          <span>Leer artículo</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};
