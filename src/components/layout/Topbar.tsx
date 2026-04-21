import React, { useState } from 'react';
import { Menu, Search, Command, Sun, Moon, Bell, X, User, LogOut, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getRouteName } from '../../lib/navigation';
import { appConfig, currentUser } from '../../constants';

export default function Topbar({ 
  sidebarOpen, 
  setSidebarOpen, 
  isDark, 
  toggleDarkMode 
}: { 
  sidebarOpen: boolean; 
  setSidebarOpen: (v: boolean) => void;
  isDark: boolean;
  toggleDarkMode: () => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPathName = getRouteName(location.pathname);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="h-16 lg:h-20 bg-white/60 dark:bg-[#0B1120]/60 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 shrink-0 supports-[backdrop-filter]:bg-white/40 dark:supports-[backdrop-filter]:bg-[#0B1120]/40 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 -ml-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hidden sm:block transition-colors"
        >
          <Menu size={20} />
        </motion.button>
        <div className="flex items-center gap-2 text-sm">
          <motion.span 
            className="font-semibold text-slate-900 dark:text-white tracking-wide"
            whileHover={{ scale: 1.05 }}
          >
            {appConfig.name}
          </motion.span>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="text-slate-500 dark:text-slate-400 font-medium">{currentPathName}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-5">
        <div className="relative hidden md:flex items-center group">
          <AnimatePresence>
            {searchOpen && (
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-20 transition duration-500"></div>
            )}
          </AnimatePresence>

          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors z-10" size={16} />
          <input 
            type="text" 
            placeholder="Personel veya firma ara..." 
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setSearchOpen(false)}
            className={`w-64 lg:w-80 pl-10 pr-14 py-2 bg-white/60 dark:bg-[#05080F]/60 hover:bg-white dark:hover:bg-[#05080F] border ${searchOpen ? 'border-indigo-400 dark:border-indigo-500 shadow-[0_0_0_3px_rgba(99,102,241,0.1)]' : 'border-slate-200/80 dark:border-white/10'} rounded-xl text-sm focus:outline-none focus:ring-0 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.2)] relative z-10`}
          />
          {searchOpen && (
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <X size={14} className="text-slate-400" />
            </button>
          )}
          {!searchOpen && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 px-1.5 py-0.5 rounded-md text-[10px] font-bold text-slate-500 dark:text-slate-400 pointer-events-none z-10">
              <Command size={10} /> K
            </div>
          )}
        </div>
        
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800/80 hidden md:block mx-1"></div>

        <motion.button
          whileHover={{ rotate: 15 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleDarkMode}
          className="p-2 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-amber-500 dark:hover:text-amber-400 rounded-xl transition-all"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </motion.button>

        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl transition-all"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)]"></span>
          </motion.button>

          <AnimatePresence>
            {notificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 z-50"
              >
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Bildirimler</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Yeni tarama atandı</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">ABC Lojistik A.Ş.</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Rapor hazır</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Haziran 2024 raporu</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Desktop Profile Avatar */}
        <div className="relative hidden sm:block">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-100 dark:from-indigo-500/20 to-indigo-50 dark:to-slate-800 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center">
              <span className="text-indigo-600 dark:text-indigo-100 font-bold text-sm">{currentUser.initials}</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{currentUser.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{currentUser.role}</p>
            </div>
          </motion.button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-12 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-2 z-50"
              >
                <button 
                  onClick={() => { navigate('/profile'); setProfileOpen(false); }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <User size={16} className="text-slate-500 dark:text-slate-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Profil</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <Settings size={16} className="text-slate-500 dark:text-slate-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Ayarlar</span>
                </button>
                <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors text-rose-600 dark:text-rose-400">
                  <LogOut size={16} />
                  <span className="text-sm font-medium">Çıkış Yap</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Mobile Profile Avatar */}
        <div className="ml-2 w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 sm:hidden flex items-center justify-center text-white text-xs font-bold shadow-sm">
          {currentUser.initials}
        </div>
      </div>
    </header>
  );
}
