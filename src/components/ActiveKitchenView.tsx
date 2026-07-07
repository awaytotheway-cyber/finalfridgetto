import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check, Play, Pause, RotateCcw, Clock, Users, Flame,
  ArrowLeft, Sparkles,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { Recipe } from '../lib/types';

type Props = {
  recipe: Recipe;
  onBack: () => void;
};

export default function ActiveKitchenView({ recipe, onBack }: Props) {
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const toggleIngredient = (item: string) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-10"
    >
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-light hover:text-white transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to recipes
      </button>

      {/* Recipe header */}
      <div className="glass rounded-3xl p-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-2">
              {recipe.title}
            </h1>
            <p className="text-muted text-base">{recipe.description}</p>
          </div>
          <span className="flex-shrink-0 px-4 py-1.5 rounded-full bg-bolt-500/10 border border-bolt-500/20 text-bolt-300 text-sm font-medium">
            {recipe.cuisine}
          </span>
        </div>
        <div className="flex gap-6 mt-6">
          <div className="flex items-center gap-2 text-muted-light">
            <Clock className="w-4 h-4" strokeWidth={1.5} />
            <span className="text-sm tabular-nums">{recipe.prepTimeMinutes}m prep</span>
          </div>
          <div className="flex items-center gap-2 text-muted-light">
            <Flame className="w-4 h-4" strokeWidth={1.5} />
            <span className="text-sm tabular-nums">{recipe.cookTimeMinutes}m cook</span>
          </div>
          <div className="flex items-center gap-2 text-muted-light">
            <Users className="w-4 h-4" strokeWidth={1.5} />
            <span className="text-sm tabular-nums">{recipe.servings} servings</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prep Checklist */}
        <div className="glass rounded-3xl p-8">
          <h2 className="text-xl font-semibold tracking-tight text-white mb-6">Prep Checklist</h2>
          <div className="space-y-2">
            {recipe.ingredients.map((item, idx) => {
              const checked = checkedIngredients.has(item);
              return (
                <motion.button
                  key={item + idx}
                  onClick={() => toggleIngredient(item)}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 w-full text-left py-3 px-4 rounded-xl glass glass-hover transition-all"
                >
                  <div
                    className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all flex-shrink-0 ${
                      checked
                        ? 'bg-success/20 border-success/50'
                        : 'border-white/[0.12]'
                    }`}
                  >
                    {checked && <Check className="w-4 h-4 text-success" />}
                  </div>
                  <span
                    className={`text-sm transition-all ${
                      checked ? 'text-muted line-through' : 'text-white'
                    }`}
                  >
                    {item}
                  </span>
                </motion.button>
              );
            })}
          </div>
          <div className="mt-4 text-xs text-muted">
            {checkedIngredients.size} / {recipe.ingredients.length} ready
          </div>
        </div>

        {/* Substitution Panel */}
        <SubstitutionPanel recipe={recipe} />
      </div>

      {/* Cooking Steps with Timers */}
      <div className="glass rounded-3xl p-8">
        <h2 className="text-xl font-semibold tracking-tight text-white mb-6">Cooking Steps</h2>
        <div className="space-y-4">
          {recipe.steps.map((step, idx) => (
            <CookingStep
              key={idx}
              step={step}
              index={idx}
              isActive={activeStep === idx}
              onActivate={() => setActiveStep(activeStep === idx ? null : idx)}
            />
          ))}
        </div>
      </div>

      {/* Macro Analytics */}
      {recipe.macros && <MacroAnalytics macros={recipe.macros} />}
    </motion.div>
  );
}

function SubstitutionPanel({ recipe }: { recipe: Recipe }) {
  const hasEssential = recipe.essentialIngredients && recipe.essentialIngredients.length > 0;
  const hasReplaceable = recipe.replaceableIngredients && recipe.replaceableIngredients.length > 0;
  const hasSubs = recipe.substitutions && recipe.substitutions.length > 0;

  if (!hasEssential && !hasReplaceable && !hasSubs) {
    return (
      <div className="glass rounded-3xl p-8">
        <h2 className="text-xl font-semibold tracking-tight text-white mb-6">Substitutions</h2>
        <p className="text-muted text-sm">No substitution data available for this recipe.</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-8">
      <h2 className="text-xl font-semibold tracking-tight text-white mb-6">Smart Substitutes</h2>

      {hasEssential && (
        <div className="mb-6">
          <h3 className="text-xs font-medium text-success uppercase tracking-wide mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success" />
            Essential — Do Not Skip
          </h3>
          <div className="flex flex-wrap gap-2">
            {recipe.essentialIngredients!.map((ing, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-lg bg-success/10 border border-success/20 text-success text-sm"
              >
                {ing}
              </span>
            ))}
          </div>
        </div>
      )}

      {hasReplaceable && (
        <div className="mb-6">
          <h3 className="text-xs font-medium text-warning uppercase tracking-wide mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-warning" />
            Replaceable — Can Skip or Swap
          </h3>
          <div className="flex flex-wrap gap-2">
            {recipe.replaceableIngredients!.map((ing, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-lg bg-warning/10 border border-warning/20 text-warning text-sm"
              >
                {ing}
              </span>
            ))}
          </div>
        </div>
      )}

      {hasSubs && (
        <div>
          <h3 className="text-xs font-medium text-bolt-400 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Sparkles className="w-3 h-3" />
            Suggested Swaps
          </h3>
          <div className="space-y-2">
            {recipe.substitutions!.map((sub, i) => (
              <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-xl glass text-sm">
                <span className="text-muted-light">{sub.original}</span>
                <ArrowLeft className="w-3.5 h-3.5 text-bolt-400 rotate-180" />
                <span className="text-white">{sub.substitute}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CookingStep({
  step,
  index,
  isActive,
  onActivate,
}: {
  step: string;
  index: number;
  isActive: boolean;
  onActivate: () => void;
}) {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            setRunning(false);
            playCompletionTone();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const playCompletionTone = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch {
      // Audio not available
    }
  };

  const setTimer = (mins: number) => {
    setSeconds(mins * 60);
    setRunning(false);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div
      className={`rounded-2xl border transition-all ${
        isActive ? 'glass-strong border-bolt-500/30' : 'glass border-white/[0.08]'
      }`}
    >
      <button
        onClick={onActivate}
        className="flex items-start gap-4 w-full text-left p-5"
      >
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
            isActive ? 'bg-bolt-500 text-white' : 'glass text-muted-light'
          }`}
        >
          {index + 1}
        </div>
        <p className="text-white text-sm leading-relaxed pt-1">{step}</p>
      </button>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-white/[0.06]">
              {/* Timer display */}
              <div className="flex items-center justify-between mb-4 mt-4">
                <div className="text-4xl font-semibold tabular-nums text-white tracking-tight">
                  {formatTime(seconds)}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setRunning(!running)}
                    className="w-10 h-10 rounded-xl bg-bolt-500 hover:bg-bolt-600 flex items-center justify-center text-white transition-all"
                  >
                    {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => { setSeconds(0); setRunning(false); }}
                    className="w-10 h-10 rounded-xl glass glass-hover flex items-center justify-center text-muted-light transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick set */}
              <div className="flex gap-2">
                {[1, 3, 5, 10, 15].map((m) => (
                  <button
                    key={m}
                    onClick={() => setTimer(m)}
                    className="flex-1 py-2 rounded-lg glass glass-hover text-xs text-muted-light hover:text-white transition-all tabular-nums"
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MacroAnalytics({ macros }: { macros: NonNullable<Recipe['macros']> }) {
  const data = [
    { name: 'Protein', value: macros.protein, color: '#3377ff' },
    { name: 'Carbs', value: macros.carbs, color: '#599fff' },
    { name: 'Fat', value: macros.fat, color: '#8ec1ff' },
  ].filter((d) => d.value > 0);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="glass rounded-3xl p-8">
      <h2 className="text-xl font-semibold tracking-tight text-white mb-6">Nutritional Breakdown</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Donut chart */}
        <div className="relative h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-semibold tabular-nums text-white">{macros.calories}</span>
            <span className="text-muted text-xs uppercase tracking-wide">kcal</span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-4">
          {data.map((d) => (
            <div key={d.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: d.color }}
                />
                <span className="text-white text-sm">{d.name}</span>
              </div>
              <div className="text-right">
                <span className="text-white font-semibold tabular-nums">{d.value}g</span>
                <span className="text-muted text-sm ml-2 tabular-nums">
                  ({total > 0 ? Math.round((d.value / total) * 100) : 0}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
