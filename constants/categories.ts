export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "science",
    name: "Science",
    icon: "🔬",
    description: "Physics, chemistry, biology & more",
  },
  {
    id: "history",
    name: "History",
    icon: "📜",
    description: "World events, civilizations & leaders",
  },
  {
    id: "technology",
    name: "Technology",
    icon: "💻",
    description: "Programming, gadgets & innovation",
  },
  {
    id: "sports",
    name: "Sports",
    icon: "⚽",
    description: "Athletes, teams & championships",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    icon: "🎬",
    description: "Movies, music & pop culture",
  },
  {
    id: "geography",
    name: "Geography",
    icon: "🌍",
    description: "Countries, capitals & landmarks",
  },
];

export const getCategoryById = (id: string): Category | undefined =>
  CATEGORIES.find((c) => c.id === id);
