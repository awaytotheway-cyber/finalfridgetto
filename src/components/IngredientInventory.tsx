import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Search, Package, Camera, Loader2, AlertCircle, Check } from 'lucide-react';
import { QUICK_PANTRY, type DietaryFilter } from '../lib/types';
import { detectIngredients } from '../lib/gemini';

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
  const [cameraOpen, setCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [detectedCount, setDetectedCount] = useState<number | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      setStream(mediaStream);
      setCameraOpen(true);
    } catch {
      setCameraError('Unable to access camera. Please grant camera permission or upload a photo instead.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
    setCameraOpen(false);
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

  const processImage = async (dataUrl: string, mime: string) => {
    setDetecting(true);
    setCameraError(null);
    setDetectedCount(null);
    try {
      const base64 = dataUrl.split(',')[1];
      const detected = await detectIngredients(base64, mime);
      let added = 0;
      for (const ing of detected) {
        const trimmed = ing.trim();
        if (trimmed && !ingredients.some((i) => i.toLowerCase() === trimmed.toLowerCase())) {
          onAddIngredient(trimmed);
          added++;
        }
      }
      setDetectedCount(added);
      setTimeout(() => setDetectedCount(null), 3000);
    } catch (err) {
      setCameraError(err instanceof Error ? err.message : 'Failed to detect ingredients from image.');
    } finally {
      setDetecting(false);
    }
  };

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
    stopCamera();
    processImage(dataUrl, 'image/jpeg');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      processImage(result, file.type);
    };
    reader.readAsDataURL(file);
  };

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

          {/* Camera button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={cameraOpen ? stopCamera : startCamera}
            className={`flex items-center gap-2 px-5 py-4 rounded-2xl font-medium transition-all ${
              cameraOpen
                ? 'bg-error/20 text-error border border-error/30'
                : 'glass glass-hover text-bolt-400 border border-bolt-500/20'
            }`}
            aria-label="Scan ingredients with camera"
          >
            {detecting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : detectedCount !== null ? (
              <Check className="w-5 h-5 text-success" />
            ) : (
              <Camera className="w-5 h-5" strokeWidth={1.5} />
            )}
            <span className="hidden sm:inline">
              {detecting ? 'Scanning...' : detectedCount !== null ? `${detectedCount} added` : 'Scan'}
            </span>
          </motion.button>

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

        {/* Hidden file input for upload fallback */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Camera live view */}
        <AnimatePresence>
          {cameraOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mt-4"
            >
              <div className="glass rounded-3xl p-4">
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
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2.5 rounded-xl glass-strong text-white text-sm font-medium"
                    >
                      Upload
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={capturePhoto}
                      className="w-16 h-16 rounded-full bg-white/90 border-4 border-white/30 flex items-center justify-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-bolt-500" />
                    </motion.button>
                    <button
                      onClick={stopCamera}
                      className="px-4 py-2.5 rounded-xl glass-strong text-white text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                <p className="text-center text-muted text-sm mt-3">
                  Point your camera at your fridge or ingredients and tap the capture button
                </p>
              </div>
              <canvas ref={canvasRef} className="hidden" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Detecting overlay */}
        <AnimatePresence>
          {detecting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 flex items-center gap-3 px-5 py-4 rounded-2xl glass"
            >
              <Loader2 className="w-5 h-5 text-bolt-400 animate-spin" />
              <span className="text-muted-light text-sm">Detecting ingredients from photo...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {cameraError && (
          <div className="flex items-center gap-2 mt-4 px-5 py-3 rounded-xl bg-error-soft/10 border border-error/20 text-error text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {cameraError}
          </div>
        )}

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
              No ingredients added yet. Add some above, pick from the pantry below, or scan with your camera.
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
