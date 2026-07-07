import { motion, AnimatePresence } from 'framer-motion';
import { X, KeyRound, Check, AlertCircle, ExternalLink } from 'lucide-react';
import { isGeminiConfigured } from '../lib/gemini';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SettingsModal({ open, onClose }: Props) {
  const configured = isGeminiConfigured();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center px-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg glass-strong rounded-3xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold tracking-tight text-white">Settings</h2>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl glass glass-hover flex items-center justify-center"
              >
                <X className="w-4.5 h-4.5 text-muted-light" />
              </button>
            </div>

            {/* Groq API Key Status */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <KeyRound className="w-5 h-5 text-bolt-400" strokeWidth={1.5} />
                <h3 className="text-base font-medium text-white">Groq API Key</h3>
              </div>

              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${
                  configured
                    ? 'bg-success/10 border-success/20'
                    : 'bg-error-soft/10 border-error/20'
                }`}
              >
                {configured ? (
                  <Check className="w-5 h-5 text-success flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-error flex-shrink-0" />
                )}
                <div>
                  <p className={`text-sm font-medium ${configured ? 'text-success' : 'text-error'}`}>
                    {configured ? 'API Key Active' : 'API Key Missing'}
                  </p>
                  <p className="text-muted text-xs mt-0.5">
                    {configured
                      ? 'Recipe generation and vision lookup are ready to use.'
                      : 'Add VITE_GROQ_API_KEY to your .env file to enable AI features.'}
                  </p>
                </div>
              </div>

              {!configured && (
                <div className="px-4 py-3 rounded-2xl glass text-sm text-muted-light space-y-2">
                  <p className="font-medium text-white">How to set up:</p>
                  <ol className="list-decimal list-inside space-y-1 text-muted">
                    <li>
                      Get a free API key from{' '}
                      <a
                        href="https://console.groq.com/keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-bolt-400 hover:text-bolt-300 inline-flex items-center gap-1"
                      >
                        Groq Console
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                    <li>Add it to your <code className="text-bolt-300">.env</code> file:</li>
                  </ol>
                  <div className="mt-2 px-3 py-2 rounded-lg bg-black/40 border border-white/[0.06] font-mono text-xs text-bolt-300">
                    VITE_GROQ_API_KEY=your_key_here
                  </div>
                  <p className="text-muted text-xs">Restart the dev server after updating .env.</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
