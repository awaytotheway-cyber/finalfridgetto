import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';
import type { Recipe } from '../lib/types';
import { generateRecipes } from '../lib/gemini';
import { supabase } from '../lib/supabase';
import RecipeCard from './RecipeCard';

type Props = {
  ingredients: string[];
  dietaryFilters: string[];
};

export default function RouletteWheel({ ingredients, dietaryFilters }: Props) {
  const [spinning, setSpinning] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const rotationRef = useRef(0);

  const canSpin = ingredients.length > 0 && !spinning;

  // Idle wheel animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 280;
    canvas.width = size * 2;
    canvas.height = size * 2;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(2, 2);

    const segments = 12;
    const colors = [
      'rgba(51, 119, 255, 0.15)',
      'rgba(89, 159, 255, 0.08)',
      'rgba(142, 193, 255, 0.12)',
      'rgba(26, 85, 245, 0.1)',
    ];

    let lastTime = performance.now();

    const draw = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (spinning) {
        rotationRef.current += dt * 8;
      } else {
        rotationRef.current += dt * 0.3;
      }

      ctx.clearRect(0, 0, size, size);
      const center = size / 2;
      const radius = size / 2 - 10;

      for (let i = 0; i < segments; i++) {
        const startAngle = (i / segments) * Math.PI * 2 + rotationRef.current;
        const endAngle = ((i + 1) / segments) * Math.PI * 2 + rotationRef.current;
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Center hub
      ctx.beginPath();
      ctx.arc(center, center, 40, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(10, 10, 12, 0.9)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(51, 119, 255, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Pointer
      ctx.beginPath();
      ctx.moveTo(center, center - radius - 2);
      ctx.lineTo(center - 10, center - radius - 18);
      ctx.lineTo(center + 10, center - radius - 18);
      ctx.closePath();
      ctx.fillStyle = '#3377ff';
      ctx.fill();

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationRef.current);
  }, [spinning]);

  const handleSpin = async () => {
    if (!canSpin) return;
    setError(null);
    setRecipes([]);
    setSpinning(true);

    try {
      const result = await generateRecipes(ingredients, dietaryFilters);
      // Hold the spin animation for at least 1.5s for cinematic effect
      const minSpinTime = 1500;
      const startTime = Date.now();
      const elapsed = Date.now() - startTime;
      if (elapsed < minSpinTime) {
        await new Promise((r) => setTimeout(r, minSpinTime - elapsed));
      }
      setSpinning(false);
      setRecipes(result);
    } catch (err) {
      setSpinning(false);
      setError(err instanceof Error ? err.message : 'Failed to generate recipes. Please try again.');
    }
  };

  const handleSave = async (recipe: Recipe) => {
    const key = recipe.title;
    if (savedIds.has(key)) return;
    try {
      const { error: dbError } = await supabase.from('saved_recipes').insert({
        title: recipe.title,
        description: recipe.description,
        cuisine: recipe.cuisine,
        prep_time_minutes: recipe.prepTimeMinutes,
        cook_time_minutes: recipe.cookTimeMinutes,
        servings: recipe.servings,
        ingredients: recipe.ingredients,
        essential_ingredients: recipe.essentialIngredients ?? [],
        replaceable_ingredients: recipe.replaceableIngredients ?? [],
        substitutions: recipe.substitutions ?? [],
        steps: recipe.steps,
        macros: recipe.macros,
        source: 'roulette',
      });
      if (dbError) throw dbError;
      setSavedIds((prev) => new Set(prev).add(key));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save recipe.');
    }
  };

  return (
    <div className="space-y-12">
      {/* Wheel Section */}
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          className="relative mb-8"
        >
          <canvas
            ref={canvasRef}
            className={`rounded-full transition-shadow duration-500 ${
              spinning ? 'glow-bolt-strong' : 'glow-bolt'
            }`}
          />
          {spinning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-bolt-400 animate-spin" />
            </div>
          )}
        </motion.div>

        <motion.button
          whileHover={canSpin ? { scale: 1.05 } : {}}
          whileTap={canSpin ? { scale: 0.95 } : {}}
          onClick={handleSpin}
          disabled={!canSpin}
          className="flex items-center gap-3 px-10 py-5 rounded-2xl bg-bolt-500 hover:bg-bolt-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-lg font-semibold transition-all glow-bolt"
        >
          {spinning ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Spinning...
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6" />
              Spin the Wheel
            </>
          )}
        </motion.button>

        {ingredients.length === 0 && (
          <p className="text-muted text-sm mt-4">
            Add at least one ingredient to spin.
          </p>
        )}

        {error && (
          <div className="mt-6 px-5 py-3 rounded-xl bg-error-soft/10 border border-error/20 text-error text-sm max-w-md text-center">
            {error}
          </div>
        )}
      </div>

      {/* Recipe Results */}
      <AnimatePresence mode="wait">
        {recipes.length > 0 && !spinning && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-white">
                Your Recipes
              </h2>
              <p className="text-muted mt-2">Three tailored dishes, ready to cook.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe, idx) => (
                <motion.div
                  key={recipe.title + idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15, type: 'spring', stiffness: 100, damping: 15 }}
                >
                  <RecipeCard
                    recipe={recipe}
                    onSave={() => handleSave(recipe)}
                    saved={savedIds.has(recipe.title)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
