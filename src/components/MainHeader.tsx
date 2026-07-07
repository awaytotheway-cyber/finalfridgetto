import { motion } from 'framer-motion';
import { ChefHat, Settings, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type Props = {
  onOpenSettings: () => void;
};

export default function MainHeader({ onOpenSettings }: Props) {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl glass-strong flex items-center justify-center">
            <ChefHat className="w-5 h-5 text-bolt-400" strokeWidth={1.5} />
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">
            Fridgetto
          </span>
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
            onClick={onOpenSettings}
            className="w-9 h-9 rounded-xl glass glass-hover flex items-center justify-center"
            aria-label="Settings"
          >
            <Settings className="w-4.5 h-4.5 text-muted-light" strokeWidth={1.5} />
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
  );
}
