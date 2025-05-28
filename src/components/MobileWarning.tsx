'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Monitor, Tablet, X, ArrowLeft, Sparkles } from 'lucide-react';

interface MobileWarningProps {
  onDismiss: () => void;
}

const MobileWarning: React.FC<MobileWarningProps> = ({ onDismiss }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();

    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile) return null;

  return (
    <AnimatePresence>
      {isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/70 to-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute -top-10 -left-20 w-40 h-40 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
              animate={{
                x: [0, 30, 0],
                y: [0, -20, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute -bottom-10 -right-20 w-32 h-32 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-full blur-3xl"
              animate={{
                x: [0, -25, 0],
                y: [0, 15, 0],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-md w-full p-8 border border-gray-200/50 dark:border-gray-700/50"
          >
            <motion.button
              onClick={onDismiss}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100/80 dark:bg-gray-700/80 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-4 h-4" />
            </motion.button>

            <div className="flex flex-col items-center mb-6">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="relative mb-4"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
                <div className="relative w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Smartphone className="w-8 h-8 text-white" />
                  </motion.div>
                </div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent text-center mb-2"
              >
                Better on Desktop
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-300 text-sm font-medium"
              >
                <Sparkles className="w-4 h-4" />
                Enhanced Experience
              </motion.div>
            </div>
            
          
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4 mb-8"
            >
              <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                The README Generator is optimized for larger screens. You&apos;ll have access to all features, better editing experience, and smoother performance.
              </p>
              
              <div className="grid grid-cols-3 gap-3 mt-6">
                {[
                  { icon: Smartphone, label: "Mobile", status: "Limited", color: "text-amber-500" },
                  { icon: Tablet, label: "Tablet", status: "Good", color: "text-blue-500" },
                  { icon: Monitor, label: "Desktop", status: "Best", color: "text-emerald-500" },
                ].map((device, idx) => (
                  <motion.div
                    key={device.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + idx * 0.1 }}
                    className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50"
                  >
                    <device.icon className={`w-5 h-5 mx-auto mb-2 ${device.color}`} />
                    <div className="text-xs font-medium text-gray-800 dark:text-gray-200">{device.label}</div>
                    <div className={`text-xs ${device.color} font-medium`}>{device.status}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col gap-3"
            >
              <motion.button
                onClick={() => window.history.back()}
                className="w-full px-5 py-3 text-sm font-medium rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-200 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)" }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowLeft className="w-4 h-4" />
                Switch to Desktop
              </motion.button>
              
              <motion.button
                onClick={onDismiss}
                className="w-full px-5 py-3 text-sm font-medium rounded-xl bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-600/50 shadow-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Smartphone className="w-4 h-4" />
                Continue on Mobile
              </motion.button>
            </motion.div>

            {/* Additional tip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200/50 dark:border-blue-700/50"
            >
              <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
                💡 <strong>Pro tip:</strong> Use landscape mode or zoom out for a better mobile experience
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileWarning;
