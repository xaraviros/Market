
import React from 'react';
import { motion } from 'framer-motion';
import { Store } from 'lucide-react';

const SplashScreen: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] bg-blue-600 flex flex-col items-center justify-center text-white"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/10 p-6 rounded-[3rem] backdrop-blur-md mb-6"
      >
        <Store size={80} strokeWidth={1.5} />
      </motion.div>
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-3xl font-bold tracking-tight"
      >
        Sales Master
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="mt-2 text-sm"
      >
        سیستەمی بەڕێوەبردنی فرۆشتن
      </motion.p>
      <div className="absolute bottom-12 flex space-x-2 space-x-reverse">
        <div className="w-2 h-2 bg-white/30 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-white/30 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
