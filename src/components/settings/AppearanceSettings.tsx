import React, { useState, useEffect } from 'react';
import { Palette, Monitor, Moon, Sun, Zap, Type, Sparkles, Eye } from 'lucide-react';
import { Toggle } from '../ui/Toggle';
import { useDarkMode } from '../../hooks/useDarkMode';

const STORAGE_KEY = 'appearance_settings';

export function AppearanceSettings() {
  const { isDark, toggleDarkMode } = useDarkMode();
  const [appearance, setAppearance] = useState(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {
          theme: 'system',
          fontSize: 'medium',
          animations: true,
          reducedMotion: false
        };
      }
    }
    return {
      theme: 'system',
      fontSize: 'medium',
      animations: true,
      reducedMotion: false
    };
  });

  // Save to localStorage when appearance changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appearance));
  }, [appearance]);

  // Apply appearance settings to CSS variables
  useEffect(() => {
    const root = document.documentElement;

    // Font size
    const fontSizes = { small: '14px', medium: '16px', large: '18px' };
    root.style.setProperty('--font-size-base', fontSizes[appearance.fontSize as keyof typeof fontSizes]);

    // Reduced motion
    if (appearance.reducedMotion) {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }
  }, [appearance.fontSize, appearance.reducedMotion]);

  const fontSizes = [
    { id: 'small', label: 'Küçük', size: 'text-sm' },
    { id: 'medium', label: 'Orta', size: 'text-base' },
    { id: 'large', label: 'Büyük', size: 'text-lg' },
  ];

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <div className="space-y-4 pb-6 border-b border-slate-200 dark:border-slate-700">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Palette size={16} />
          Tema
        </h4>
        
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => { setAppearance({ ...appearance, theme: 'light' }); if (isDark) toggleDarkMode(); }}
            className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 group ${
              appearance.theme === 'light' && !isDark
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/20 shadow-lg shadow-indigo-500/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-500/20 dark:to-orange-500/20 flex items-center justify-center transition-transform group-hover:scale-110`}>
              <Sun size={24} className="text-amber-500" />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Aydınlık</span>
          </button>
          
          <button
            onClick={() => { setAppearance({ ...appearance, theme: 'dark' }); if (!isDark) toggleDarkMode(); }}
            className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 group ${
              appearance.theme === 'dark' && isDark
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/20 shadow-lg shadow-indigo-500/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-500/20 dark:to-purple-500/20 flex items-center justify-center transition-transform group-hover:scale-110`}>
              <Moon size={24} className="text-indigo-500" />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Koyu</span>
          </button>
          
          <button
            onClick={() => setAppearance({ ...appearance, theme: 'system' })}
            className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 group ${
              appearance.theme === 'system'
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/20 shadow-lg shadow-indigo-500/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700/20 dark:to-slate-600/20 flex items-center justify-center transition-transform group-hover:scale-110`}>
              <Monitor size={24} className="text-slate-500" />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Sistem</span>
          </button>
        </div>
      </div>

      {/* Font Size & Animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Font Size */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Type size={16} />
            Yazı Boyutu
          </h4>
          
          <div className="grid grid-cols-3 gap-3">
            {fontSizes.map((size) => (
              <button
                key={size.id}
                onClick={() => setAppearance({ ...appearance, fontSize: size.id })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  appearance.fontSize === size.id
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <span className={`font-semibold ${size.size} text-slate-700 dark:text-slate-300`}>Aa</span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{size.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Animations */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Zap size={16} />
            Animasyonlar
          </h4>
          
          <div className="space-y-4">
            <Toggle
              checked={appearance.animations}
              onChange={(checked) => setAppearance({ ...appearance, animations: checked })}
              label="Animasyonları Etkinleştir"
              description="Arayüz animasyonlarını göster"
              icon={<Sparkles size={18} />}
            />
            
            <Toggle
              checked={appearance.reducedMotion}
              onChange={(checked) => setAppearance({ ...appearance, reducedMotion: checked })}
              label="Hareketi Azalt"
              description="Erişilebilirlik için animasyonları azalt"
              icon={<Eye size={18} />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
