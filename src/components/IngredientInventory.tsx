import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Search, Package } from 'lucide-react';
import { QUICK_PANTRY, type DietaryFilter } from '../lib/types';

type Props = {
  ingredients: string[];
  onAddIngredient: (item: string) => void;
  onRemoveIngredient: (item: string) => void;
  dietaryFilters: DietaryFilter[];
  onToggleDietaryFilter: (id: string) => void;
};

export default function IngredientInventory({
  ingredients,
  onAddIngredient,
  onRemoveIngredient,
  dietaryFilters,
  onToggleDietaryFilter,
}: Props) {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    const trimmed = input.trim();
    if (trimmed && !ingredients.some((i) => i.toLowerCase() === trimmed.toLowerCase())) {
      onAddIngredient(trimmed);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const togglePantry = (item: string) => {
    if (ingredients.some((i) => i.toLowerCase() === item.toLowerCase())) {
      onRemoveIngredient(item);
    } else {
      onAddIngredient(item);
    }
  };

  return (
    <div className="space-y-10">
      {/* Ingredient Input */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Package className="w-5 h-5 text-bolt-400" strokeWidth={1.5} />
          <h2 className="text-xl font-semibold tracking-tight text-white">Your Ingredients</h2>
        </div>

        {/* Input field */}
        <div className="relative flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" strokeWidth={1.5} />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type an ingredient and press Enter..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-white placeholder:text-muted-dark focus:outline-none focus:border-bolt-500/50 focus:bg-white/[0.05] transition-all"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            className="flex items-center gap-2 px-5 py-4 rounded-2xl bg-bolt-500 hover:bg-bolt-600 text-white font-medium transition-all"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Add</span>
          </motion.button>
        </div>

        {/* Active ingredient pills */}
        <div className="flex flex-wrap gap-2 mt-4 min-h-[2rem]">
          <AnimatePresence>
            {ingredients.map((item) => (
              <motion.div
                key={item}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="flex items-center gap-2 pl-4 pr-2 py-2 rounded-full glass-strong text-sm text-white"
              >
                {item}
                <button
                  onClick={() => onRemoveIngredient(item)}
                  className="w-5 h-5 rounded-full bg-white/[0.08] hover:bg-error/20 flex items-center justify-center transition-colors"
                >
                  <X className="w-3 h-3 text-muted-light" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {ingredients.length === 0 && (
            <p className="text-muted text-sm py-2">
              No ingredients added yet. Add some above or pick from the pantry below.
            </p>
          )}
        </div>
      </div>

      {/* Quick Pantry */}
      <div>
        <h3 className="text-sm font-medium text-muted-light mb-4 tracking-wide uppercase">
          Quick Pantry
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {QUICK_PANTRY.map((item) => {
            const active = ingredients.some((i) => i.toLowerCase() === item.toLowerCase());
            return (
              <motion.button
                key={item}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => togglePantry(item)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                  active
                    ? 'bg-bolt-500/15 border-bolt-500/40 text-white'
                    : 'glass glass-hover text-muted-light border-white/[0.08]'
                }`}
              >
                {item}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Dietary Filters */}
      <div>
        <h3 className="text-sm font-medium text-muted-light mb-4 tracking-wide uppercase">
          Dietary Filters
        </h3>
        <div className="flex flex-wrap gap-2">
          {dietaryFilters.map((filter) => (
            <motion.button
              key={filter.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onToggleDietaryFilter(filter.id)}
              className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all border ${
                filter.active
                  ? 'bg-bolt-500/15 border-bolt-500/40 text-white'
                  : 'glass glass-hover text-muted-light border-white/[0.08]'
              }`}
            >
              {filter.label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
