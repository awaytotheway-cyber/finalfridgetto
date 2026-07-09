import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Copy, Mail, MessageCircle, Send } from 'lucide-react';

type Props = {
  open: boolean;
  onClose: () => void;
};

const SHARE_URL = 'https://fridgetto.com';
const SHARE_TEXT = 'Check out Fridgetto — snap a photo of your ingredients and get AI-generated recipes instantly!';

export default function ShareModal({ open, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select text
      const input = document.createElement('input');
      input.value = SHARE_URL;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareOptions = [
    {
      label: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-[#25D366]/15 border-[#25D366]/30 text-[#25D366]',
      onClick: () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(SHARE_TEXT + ' ' + SHARE_URL)}`, '_blank', 'noopener,noreferrer');
      },
    },
    {
      label: 'Telegram',
      icon: Send,
      color: 'bg-[#0088cc]/15 border-[#0088cc]/30 text-[#0088cc]',
      onClick: () => {
        window.open(`https://t.me/share/url?url=${encodeURIComponent(SHARE_URL)}&text=${encodeURIComponent(SHARE_TEXT)}`, '_blank', 'noopener,noreferrer');
      },
    },
    {
      label: 'Gmail',
      icon: Mail,
      color: 'bg-[#EA4335]/15 border-[#EA4335]/30 text-[#EA4335]',
      onClick: () => {
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent('Check out Fridgetto!')}&body=${encodeURIComponent(SHARE_TEXT + '\n\n' + SHARE_URL)}`, '_blank', 'noopener,noreferrer');
      },
    },
    {
      label: copied ? 'Copied!' : 'Copy Link',
      icon: copied ? Check : Copy,
      color: copied
        ? 'bg-success/15 border-success/30 text-success'
        : 'bg-white/[0.04] border-white/[0.08] text-muted-light',
      onClick: handleCopy,
    },
  ];

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
            className="w-full max-w-md glass-strong rounded-3xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold tracking-tight text-white">Share Fridgetto</h2>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl glass glass-hover flex items-center justify-center"
              >
                <X className="w-4.5 h-4.5 text-muted-light" />
              </button>
            </div>

            <p className="text-muted text-sm mb-6">
              Love Fridgetto? Share it with your friends and family!
            </p>

            {/* Share options grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {shareOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <motion.button
                    key={option.label}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={option.onClick}
                    className={`flex flex-col items-center gap-3 px-4 py-6 rounded-2xl border transition-all ${option.color}`}
                  >
                    <Icon className="w-7 h-7" strokeWidth={1.5} />
                    <span className="text-sm font-medium">{option.label}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Link preview */}
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-black/40 border border-white/[0.06]">
              <span className="flex-1 font-mono text-sm text-bolt-300 truncate">
                {SHARE_URL}
              </span>
              <button
                onClick={handleCopy}
                className="text-muted hover:text-white transition-colors"
                aria-label="Copy link"
              >
                {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
