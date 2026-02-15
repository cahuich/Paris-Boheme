import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const CategoryCard = ({ category }) => {
  return (
    <Link
      to={`/articles?category=${category.slug}`}
      data-testid={`category-card-${category.slug}`}
      className="category-card group block relative"
    >
      {/* Background Image */}
      <img
        src={category.image_url}
        alt={category.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* Content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end p-6">
        <h3 className="font-['Playfair_Display'] text-2xl font-semibold text-white mb-2">
          {category.name}
        </h3>
        <p className="text-white/80 text-sm mb-3 line-clamp-2">
          {category.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[#C5A059] text-sm font-medium">
            {category.article_count} artículo{category.article_count > 1 ? "s" : ""}
          </span>
          <ArrowRight className="w-5 h-5 text-white transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};
