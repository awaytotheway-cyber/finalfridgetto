import { motion } from 'framer-motion';
import { Clock, Users, Flame, ChefHat, Save, Check } from 'lucide-react';
import type { Recipe } from '../lib/types';

type Props = {
  recipe: Recipe;
  onSave?: () => void;
  saved?: boolean;
  onOpen?: () => void;
};

export default function RecipeCard({ recipe, onSave, saved, onOpen }: Props) {
  return (
    <div className="glass rounded-3xl p-6 glass-hover h-full flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-xl font-semibold tracking-tight text-white leading-tight">
            {recipe.title}
          </h3>
          {onSave && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onSave}
              disabled={saved}
              className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                saved
                  ? 'bg-success/15 text-success'
                  : 'glass glass-hover text-muted-light'
              }`}
            >
              {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            </motion.button>
          )}
        </div>
        <p className="text-muted text-sm leading-relaxed">{recipe.description}</p>
        <span className="inline-block mt-2 px-3 py-1 rounded-full bg-bolt-500/10 border border-bolt-500/20 text-bolt-300 text-xs font-medium">
          {recipe.cuisine}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="flex flex-col items-center py-3 rounded-xl glass">
          <Clock className="w-4 h-4 text-muted mb-1" strokeWidth={1.5} />
          <span className="text-white text-sm font-medium tabular-nums">{recipe.prepTimeMinutes}m</span>
          <span className="text-muted text-[10px] uppercase tracking-wide">Prep</span>
        </div>
        <div className="flex flex-col items-center py-3 rounded-xl glass">
          <Flame className="w-4 h-4 text-muted mb-1" strokeWidth={1.5} />
          <span className="text-white text-sm font-medium tabular-nums">{recipe.cookTimeMinutes}m</span>
          <span className="text-muted text-[10px] uppercase tracking-wide">Cook</span>
        </div>
        <div className="flex flex-col items-center py-3 rounded-xl glass">
          <Users className="w-4 h-4 text-muted mb-1" strokeWidth={1.5} />
          <span className="text-white text-sm font-medium tabular-nums">{recipe.servings}</span>
          <span className="text-muted text-[10px] uppercase tracking-wide">Serves</span>
        </div>
      </div>

      {/* Ingredients preview */}
      <div className="flex-1 mb-5">
        <h4 className="text-xs font-medium text-muted-light mb-2 uppercase tracking-wide">Ingredients</h4>
        <div className="flex flex-wrap gap-1.5">
          {recipe.ingredients.slice(0, 6).map((ing, i) => (
            <span key={i} className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-muted-light">
              {ing}
            </span>
          ))}
          {recipe.ingredients.length > 6 && (
            <span className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-muted">
              +{recipe.ingredients.length - 6} more
            </span>
          )}
        </div>
      </div>

      {/* Macros */}
      {recipe.macros && (
        <div className="grid grid-cols-4 gap-2 mb-5">
          {[
            { label: 'Cal', value: recipe.macros.calories },
            { label: 'Protein', value: `${recipe.macros.protein}g` },
            { label: 'Carbs', value: `${recipe.macros.carbs}g` },
            { label: 'Fat', value: `${recipe.macros.fat}g` },
          ].map((m) => (
            <div key={m.label} className="text-center py-2 rounded-lg glass">
              <div className="text-white text-sm font-semibold tabular-nums">{m.value}</div>
              <div className="text-muted text-[10px] uppercase tracking-wide">{m.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Open button */}
      {onOpen && (
        <button
          onClick={onOpen}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl glass glass-hover text-white text-sm font-medium transition-all"
        >
          <ChefHat className="w-4 h-4 text-bolt-400" />
          Start Cooking
        </button>
      )}
    </div>
  );
}
