import { CategoryCard } from "@/components/molecules/CategoryCard";
import type { Category } from "@/constants/categories";

interface CategoryGridProps {
  categories: Category[];
  quizCounts: Record<string, number>;
  onCategoryClick?: (categoryId: string) => void;
}

export function CategoryGrid({
  categories,
  quizCounts,
  onCategoryClick,
}: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          icon={category.icon}
          name={category.name}
          description={category.description}
          quizCount={quizCounts[category.id] ?? 0}
          onClick={() => onCategoryClick?.(category.id)}
        />
      ))}
    </div>
  );
}
