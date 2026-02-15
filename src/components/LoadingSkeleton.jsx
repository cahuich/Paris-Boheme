import React from "react";

export const ArticleCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-black/5">
      <div className="skeleton aspect-[4/3]" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="skeleton h-6 w-24 rounded-full" />
          <div className="skeleton h-4 w-16 rounded" />
        </div>
        <div className="skeleton h-6 w-full rounded mb-2" />
        <div className="skeleton h-6 w-3/4 rounded mb-4" />
        <div className="skeleton h-4 w-full rounded mb-2" />
        <div className="skeleton h-4 w-2/3 rounded" />
      </div>
    </div>
  );
};

export const FeaturedSkeleton = ({ isLarge = false }) => {
  return (
    <div
      className={`skeleton rounded-2xl ${
        isLarge ? "h-[500px] md:h-[600px]" : "h-[300px]"
      }`}
    />
  );
};

export const CategorySkeleton = () => {
  return <div className="skeleton aspect-video rounded-xl" />;
};
