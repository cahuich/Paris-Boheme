import React from "react";

interface FeaturedSkeletonProps {
  isLarge?: boolean;
}

/* Base Skeleton Block */
const SkeletonBlock: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <div
    className={`bg-gray-200 animate-pulse ${className}`}
    aria-hidden="true"
  />
);

/* Article Card Skeleton */
export const ArticleCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-black/5">
      <SkeletonBlock className="aspect-[4/3] w-full" />

      <div className="p-6 space-y-3">
        <div className="flex items-center justify-between">
          <SkeletonBlock className="h-6 w-24 rounded-full" />
          <SkeletonBlock className="h-4 w-16 rounded" />
        </div>

        <SkeletonBlock className="h-6 w-full rounded" />
        <SkeletonBlock className="h-6 w-3/4 rounded" />

        <SkeletonBlock className="h-4 w-full rounded" />
        <SkeletonBlock className="h-4 w-2/3 rounded" />
      </div>
    </div>
  );
};

/* Featured Article Skeleton */
export const FeaturedSkeleton: React.FC<FeaturedSkeletonProps> = ({
  isLarge = false,
}) => {
  return (
    <SkeletonBlock
      className={`rounded-2xl w-full ${
        isLarge ? "h-[500px] md:h-[600px]" : "h-[300px]"
      }`}
    />
  );
};

/* Category Skeleton */
export const CategorySkeleton: React.FC = () => {
  return (
    <SkeletonBlock className="aspect-video w-full rounded-xl" />
  );
};
