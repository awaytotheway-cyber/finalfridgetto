import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Sparkles, Share2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ShareModal from './ShareModal';

export default function MainHeader() {
  const { user, signOut } = useAuth();
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="/ChatGPT_Image_Jul_8,_2026,_02_13_42_PM.png"
              alt="Fridgetto"
              className="h-24 w-auto object-contain"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {user && (
              <span className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-muted-light">
                <Sparkles className="w-3.5 h-3.5 text-bolt-400" />
                {user.email}
              </span>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShareOpen(true)}
              className="w-9 h-9 rounded-xl glass glass-hover flex items-center justify-center"
              aria-label="Share website"
            >
              <Share2 className="w-4.5 h-4.5 text-muted-light" strokeWidth={1.5} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={signOut}
              className="w-9 h-9 rounded-xl glass glass-hover flex items-center justify-center"
              aria-label="Sign out"
            >
              <LogOut className="w-4.5 h-4.5 text-muted-light" strokeWidth={1.5} />
            </motion.button>
          </div>
        </div>
      </header>

      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} />
    </>
  );
}
