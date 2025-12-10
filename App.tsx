
import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Milk, Baby, ClipboardList, Layers, Home as HomeIcon, Moon } from 'lucide-react';

import Home from './pages/Home';
import Nursing from './pages/Nursing';
import Bottle from './pages/Bottle';
import Pumping from './pages/Pumping';
import Diaper from './pages/Diaper';
import Sleep from './pages/Sleep';
import History from './pages/History';
import Assistant from './pages/Assistant';
import { getDir, t } from './services/localization';

const Navigation = () => {
    const location = useLocation();
    
    // We call t() here, so this component needs to re-render when language changes
    const navItems = [
        { path: '/', icon: HomeIcon, label: t('nav_home') },
        { path: '/nursing', icon: Baby, label: t('nav_nursing') },
        { path: '/bottle', icon: Milk, label: t('nav_bottle') },
        { path: '/diaper', icon: Layers, label: t('nav_diaper') },
        { path: '/sleep', icon: Moon, label: t('sleep_title') },
        { path: '/history', icon: ClipboardList, label: t('nav_history') },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-[88px] z-50 pointer-events-none">
            {/* Blur Background Layer */}
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl border-t border-white/5 mask-image-gradient pointer-events-auto"></div>
            
            <div className="relative flex justify-around items-start pt-4 h-full px-1 pointer-events-auto">
                {navItems.map(({ path, icon: Icon, label }) => {
                    const isActive = location.pathname === path;
                    return (
                        <NavLink 
                            key={path}
                            to={path}
                            className={`flex flex-col items-center justify-center flex-1 min-w-0 space-y-1 group transition-all duration-300 ${isActive ? '-translate-y-1' : ''}`}
                        >
                            <div className={`p-1.5 rounded-2xl transition-all duration-300 ${isActive ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-500 group-active:text-slate-300'}`}>
                                <Icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className={`text-[10px] font-medium transition-colors w-full text-center truncate px-0.5 ${isActive ? 'text-indigo-200' : 'text-slate-600'}`}>{label}</span>
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
};

const App: React.FC = () => {
  // Use state to force re-render when language changes
  const [langKey, setLangKey] = useState(0);

  useEffect(() => {
    const updateDirection = () => {
        document.documentElement.dir = getDir();
        document.documentElement.lang = getDir() === 'rtl' ? 'he' : 'en';
    };

    // Initial setup
    updateDirection();

    // Listen for language changes
    const handleLangChange = () => {
        updateDirection();
        setLangKey(prev => prev + 1); // Trigger re-render
    };

    window.addEventListener('language-change', handleLangChange);
    return () => window.removeEventListener('language-change', handleLangChange);
  }, []);

  return (
    <HashRouter>
      <div key={langKey} className="flex flex-col h-[100dvh] w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-[100px] scroll-smooth no-scrollbar">
          <div className="max-w-md mx-auto w-full min-h-full">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/nursing" element={<Nursing />} />
                <Route path="/bottle" element={<Bottle />} />
                <Route path="/pump" element={<Pumping />} />
                <Route path="/diaper" element={<Diaper />} />
                <Route path="/sleep" element={<Sleep />} />
                <Route path="/history" element={<History />} />
                <Route path="/ai" element={<Assistant />} />
            </Routes>
          </div>
        </main>
        
        <Navigation />
      </div>
    </HashRouter>
  );
};

export default App;
