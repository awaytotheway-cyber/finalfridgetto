export type Recipe = {
  title: string;
  description: string;
  cuisine: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  ingredients: string[];
  essentialIngredients?: string[];
  replaceableIngredients?: string[];
  substitutions?: { original: string; substitute: string }[];
  steps: string[];
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    calories: number;
  };
  imageUrl?: string;
};

export type DietaryFilter = {
  id: string;
  label: string;
  active: boolean;
};

export const DIETARY_FILTERS: DietaryFilter[] = [
  { id: 'vegetarian', label: 'Vegetarian', active: false },
  { id: 'vegan', label: 'Vegan', active: false },
  { id: 'gluten-free', label: 'Gluten-Free', active: false },
  { id: 'keto', label: 'Keto', active: false },
  { id: 'dairy-free', label: 'Dairy-Free', active: false },
  { id: 'nut-free', label: 'Nut-Free', active: false },
  { id: 'low-carb', label: 'Low-Carb', active: false },
  { id: 'high-protein', label: 'High-Protein', active: false },
];

export const QUICK_PANTRY = [
  'Eggs', 'Chicken', 'Rice', 'Pasta', 'Tomatoes', 'Onions', 'Garlic',
  'Olive Oil', 'Cheese', 'Milk', 'Butter', 'Flour', 'Potatoes', 'Carrots',
  'Bell Peppers', 'Spinach', 'Mushrooms', 'Beef', 'Fish', 'Lemons',
  'Basil', 'Soy Sauce', 'Honey', 'Bread', 'Beans', 'Broccoli',
];
