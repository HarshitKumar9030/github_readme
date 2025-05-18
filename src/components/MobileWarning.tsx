'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileWarningProps {
  onDismiss: () => void;
}

const MobileWarning: React.FC<MobileWarningProps> = ({ onDismiss }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if the screen width is <= 768px (mobile)
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Run on mount
    checkMobile();

    // Set up event listener for window resize
    window.addEventListener('resize', checkMobile);

    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Return null if not on mobile
  if (!isMobile) return null;

  return (
    <AnimatePresence>
      {isMobile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4 text-amber-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-lg font-semibold">Mobile Device Detected</h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              The README Generator works best on larger screens like tablets and desktops. Some features may be limited on mobile devices.
            </p>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              For the best experience, please use a device with a larger screen.
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={onDismiss}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Continue Anyway
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileWarning;
