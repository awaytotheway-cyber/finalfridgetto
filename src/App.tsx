import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, Camera, Loader2 } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthGateway from './components/AuthGateway';
import MainHeader from './components/MainHeader';
import IngredientInventory from './components/IngredientInventory';
import RouletteWheel from './components/RouletteWheel';
import ReverseLookupEngine from './components/ReverseLookupEngine';
import ActiveKitchenView from './components/ActiveKitchenView';
import { DIETARY_FILTERS, type DietaryFilter, type Recipe } from './lib/types';

type View = 'roulette' | 'reverse' | 'kitchen';

function Dashboard() {
  const [view, setView] = useState<View>('roulette');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [dietaryFilters, setDietaryFilters] = useState<DietaryFilter[]>(DIETARY_FILTERS);
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);

  const addIngredient = (item: string) => {
    setIngredients((prev) => [...prev, item]);
  };

  const removeIngredient = (item: string) => {
    setIngredients((prev) => prev.filter((i) => i !== item));
  };

  const toggleDietaryFilter = (id: string) => {
    setDietaryFilters((prev) =>
      prev.map((f) => (f.id === id ? { ...f, active: !f.active } : f))
    );
  };

  const activeFilters = dietaryFilters.filter((f) => f.active).map((f) => f.label);

  const navItems: { id: View; label: string; icon: typeof Sparkles }[] = [
    { id: 'roulette', label: 'Roulette', icon: Sparkles },
    { id: 'reverse', label: 'Reverse Lookup', icon: Camera },
  ];

  return (
    <div className="min-h-screen ambient-radial">
      <MainHeader />

      {/* View tabs */}
      <div className="sticky top-16 z-40 bg-black/40 backdrop-blur-md border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex gap-1 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
              >
                {active && (
                  <motion.div
                    layoutId="navPill"
                    className="absolute inset-0 rounded-xl bg-bolt-500/15 border border-bolt-500/30"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
                <Icon
                  className={`w-4 h-4 relative z-10 ${active ? 'text-bolt-400' : 'text-muted'}`}
                  strokeWidth={1.5}
                />
                <span className={`relative z-10 ${active ? 'text-white' : 'text-muted'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
        <AnimatePresence mode="wait">
          {view === 'roulette' && (
            <motion.div
              key="roulette"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
              className="space-y-16"
            >
              {/* Hero */}
              <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-white mb-4">
                  Spin. Discover. <span className="text-gradient-bolt">Cook.</span>
                </h1>
                <p className="text-muted text-lg">
                  Add your ingredients, set your dietary preferences, and let AI craft three perfect recipes.
                </p>
              </div>

              <IngredientInventory
                ingredients={ingredients}
                onAddIngredient={addIngredient}
                onRemoveIngredient={removeIngredient}
                dietaryFilters={dietaryFilters}
                onToggleDietaryFilter={toggleDietaryFilter}
              />

              <RouletteWheel ingredients={ingredients} dietaryFilters={activeFilters} />
            </motion.div>
          )}

          {view === 'reverse' && (
            <motion.div
              key="reverse"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            >
              <ReverseLookupEngine />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Kitchen view overlay */}
        <AnimatePresence>
          {activeRecipe && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ActiveKitchenView
                recipe={activeRecipe}
                onBack={() => setActiveRecipe(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

    </div>
  );
}

function AppInner() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-bolt-400 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <AuthGateway />;
  }

  return <Dashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
