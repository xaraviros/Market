
import React from 'react';
import { Home, PlusCircle, History, Landmark, Settings as SettingsIcon } from 'lucide-react';
import { ViewType } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerHaptic } from '../utils/haptics';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewType | 'settings';
  setView: (view: any) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setView }) => {
  const handleNavClick = (v: any) => {
    triggerHaptic('light');
    setView(v);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-40 safe-top">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-blue-200 shadow-lg">
              <PlusCircle size={18} />
            </div>
            <h1 className="text-xl font-bold text-gray-800">Sales Master</h1>
          </div>
          <button 
            onClick={() => handleNavClick('settings')}
            className={`p-2 transition-colors ${activeView === 'settings' ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <SettingsIcon size={22} />
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-4 mb-24 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-6 left-6 right-6 z-50">
        <div className="bg-white/90 backdrop-blur-xl border border-white/20 shadow-[0_8px_32_rgba(0,0,0,0.12)] rounded-[2rem] px-4 py-3 flex justify-around items-center max-w-md mx-auto">
          <NavItem 
            icon={<Home size={22} />} 
            label="سەرەتا" 
            active={activeView === 'dashboard'} 
            onClick={() => handleNavClick('dashboard')} 
          />
          <NavItem 
            icon={<PlusCircle size={22} />} 
            label="فرۆشتن" 
            active={activeView === 'add-sale'} 
            onClick={() => handleNavClick('add-sale')} 
          />
          <NavItem 
            icon={<History size={22} />} 
            label="مێژوو" 
            active={activeView === 'history'} 
            onClick={() => handleNavClick('history')} 
          />
          <NavItem 
            icon={<Landmark size={22} />} 
            label="قەرز" 
            active={activeView === 'debts'} 
            onClick={() => handleNavClick('debts')} 
          />
        </div>
      </nav>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className="relative flex flex-col items-center p-2 group">
    <motion.div animate={{ scale: active ? 1.1 : 1, color: active ? '#2563eb' : '#9ca3af' }} className="z-10">
      {icon}
    </motion.div>
    {active && (
      <motion.div layoutId="nav-bg" className="absolute inset-0 bg-blue-50 rounded-2xl -z-0" />
    )}
    <span className={`text-[10px] mt-1 font-bold z-10 ${active ? 'text-blue-600' : 'text-gray-400'}`}>
      {label}
    </span>
  </button>
);

export default Layout;
