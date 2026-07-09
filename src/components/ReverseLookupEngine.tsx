import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, Upload, X, Loader2, ScanLine, ImageIcon, AlertCircle,
  UtensilsCrossed, Sparkles,
} from 'lucide-react';
import type { Recipe } from '../lib/types';
import { analyzeDishImage, analyzeIngredientImage } from '../lib/gemini';
import { supabase } from '../lib/supabase';
import RecipeCard from './RecipeCard';

type LookupMode = 'dish' | 'ingredients';

export default function ReverseLookupEngine() {
  const [lookupMode, setLookupMode] = useState<LookupMode>('ingredients');
  const [mode, setMode] = useState<'idle' | 'camera' | 'upload'>('idle');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string>('image/jpeg');
  const [analyzing, setAnalyzing] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [dragOver, setDragOver] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = useCallback(async () => {
    setError(null);
    setRecipes([]);
    setCapturedImage(null);
    setSavedIds(new Set());
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      setStream(mediaStream);
      setMode('camera');
    } catch {
      setError('Unable to access camera. Please grant camera permission or use file upload instead.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
    setMode('idle');
  }, [stream]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [stream]);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedImage(dataUrl);
    setImageMime('image/jpeg');
    stopCamera();
  };

  const handleFile = (file: File) => {
    setError(null);
    setRecipes([]);
    setSavedIds(new Set());
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setCapturedImage(result);
      setImageMime(file.type);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleAnalyze = async () => {
    if (!capturedImage) return;
    const base64Data = capturedImage.split(',')[1];
    if (!base64Data) return;

    setAnalyzing(true);
    setError(null);
    setRecipes([]);

    try {
      if (lookupMode === 'ingredients') {
        const result = await analyzeIngredientImage(base64Data, imageMime);
        setRecipes(result);
      } else {
        const result = await analyzeDishImage(base64Data, imageMime);
        setRecipes([result]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze image. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setCapturedImage(null);
    setRecipes([]);
    setError(null);
    setSavedIds(new Set());
    setMode('idle');
  };

  const handleSave = async (recipe: Recipe, index: number) => {
    if (savedIds.has(index)) return;
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
        source: 'reverse_lookup',
      });
      if (dbError) throw dbError;
      setSavedIds((prev) => new Set(prev).add(index));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save recipe.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-white mb-2">
          Reverse Kitchen Lookup
        </h2>
        <p className="text-muted">
          Snap a photo or upload an image. Our AI will identify ingredients and generate alternate recipe variants.
        </p>
      </div>

      {/* Mode toggle */}
      {!capturedImage && !analyzing && (
        <div className="flex gap-2 p-1 rounded-2xl glass w-fit">
          <button
            onClick={() => setLookupMode('ingredients')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              lookupMode === 'ingredients'
                ? 'bg-bolt-500/15 border border-bolt-500/30 text-white'
                : 'text-muted hover:text-muted-light'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" strokeWidth={1.5} />
            Find by Ingredients
          </button>
          <button
            onClick={() => setLookupMode('dish')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              lookupMode === 'dish'
                ? 'bg-bolt-500/15 border border-bolt-500/30 text-white'
                : 'text-muted hover:text-muted-light'
            }`}
          >
            <Sparkles className="w-4 h-4" strokeWidth={1.5} />
            Reverse-Engineer Dish
          </button>
        </div>
      )}

      {/* Mode selector */}
      {!capturedImage && !analyzing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={mode === 'camera' ? stopCamera : startCamera}
            className={`glass rounded-3xl p-8 glass-hover text-left transition-all ${
              mode === 'camera' ? 'border-bolt-500/40 bg-bolt-500/5' : ''
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-bolt-500/15 flex items-center justify-center mb-4">
              <Camera className="w-6 h-6 text-bolt-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">
              {mode === 'camera' ? 'Stop Camera' : 'Live Camera Capture'}
            </h3>
            <p className="text-muted text-sm">
              {mode === 'camera'
                ? 'Turn off the camera feed'
                : lookupMode === 'ingredients'
                  ? 'Photograph your ingredients/fridge'
                  : 'Use your device camera to capture a dish'}
            </p>
          </motion.button>

          <motion.div
            whileHover={{ scale: 1.02 }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`glass rounded-3xl p-8 glass-hover cursor-pointer text-left transition-all ${
              dragOver ? 'border-bolt-500/50 bg-bolt-500/10' : ''
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-bolt-500/15 flex items-center justify-center mb-4">
              <Upload className="w-6 h-6 text-bolt-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Upload Image</h3>
            <p className="text-muted text-sm">
              Drag & drop or click to browse. JPG, PNG supported.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
          </motion.div>
        </div>
      )}

      {/* Camera live view */}
      <AnimatePresence>
        {mode === 'camera' && !capturedImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass rounded-3xl p-4 overflow-hidden"
          >
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video max-w-2xl mx-auto">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute left-0 right-0 h-0.5 bg-bolt-400/60 animate-scan-line" />
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={capturePhoto}
                  className="w-16 h-16 rounded-full bg-white/90 border-4 border-white/30 flex items-center justify-center"
                >
                  <div className="w-12 h-12 rounded-full bg-bolt-500" />
                </motion.button>
              </div>
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Captured/uploaded image preview */}
      <AnimatePresence>
        {capturedImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="relative rounded-3xl overflow-hidden glass p-4 max-w-2xl mx-auto">
              <div className="relative rounded-2xl overflow-hidden">
                <img src={capturedImage} alt="Captured" className="w-full h-auto" />
                {analyzing && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute left-0 right-0 h-1 bg-bolt-400/80 animate-scan-line" />
                    </div>
                    <Loader2 className="w-10 h-10 text-bolt-400 animate-spin mb-4" />
                    <p className="text-white font-medium">
                      {lookupMode === 'ingredients' ? 'Identifying ingredients...' : 'Analyzing dish...'}
                    </p>
                    <p className="text-muted text-sm mt-1">
                      {lookupMode === 'ingredients'
                        ? 'Generating alternate recipe variants'
                        : 'Extracting recipe via AI vision'}
                    </p>
                  </div>
                )}
              </div>
              {!analyzing && recipes.length === 0 && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleAnalyze}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-bolt-500 hover:bg-bolt-600 text-white font-medium transition-all"
                  >
                    <ScanLine className="w-5 h-5" />
                    {lookupMode === 'ingredients' ? 'Find Recipes' : 'Analyze Dish'}
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-5 py-3 rounded-2xl glass glass-hover text-muted-light transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-error-soft/10 border border-error/20 text-error text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {recipes.length > 0 && !analyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold tracking-tight text-white">
                {lookupMode === 'ingredients'
                  ? `${recipes.length} Alternate Recipe Variants`
                  : 'Reverse-Engineered Recipe'}
              </h3>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 rounded-xl glass glass-hover text-muted-light text-sm transition-all"
              >
                <ImageIcon className="w-4 h-4" />
                New Image
              </button>
            </div>

            {lookupMode === 'ingredients' && recipes.length > 1 && (
              <p className="text-muted text-sm">
                Each variant uses a different cooking method or key ingredient swap — try them all and pick your favorite.
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {recipes.map((recipe, i) => (
                <RecipeCard
                  key={i}
                  recipe={recipe}
                  onSave={() => handleSave(recipe, i)}
                  saved={savedIds.has(i)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
