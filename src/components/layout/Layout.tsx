import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useDarkMode } from '../../hooks';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <div className="antialiased">
      <div className="h-screen flex bg-slate-50 dark:bg-[#0B1120] font-sans text-slate-900 dark:text-slate-100 selection:bg-indigo-100 dark:selection:bg-indigo-500/30 selection:text-indigo-900 dark:selection:text-indigo-200 transition-colors duration-500 relative overflow-hidden">
        
        {/* Background Atmospheric Glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-400/20 dark:bg-indigo-600/20 rounded-full blur-[120px] -z-10 mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-emerald-400/10 dark:bg-emerald-600/10 rounded-full blur-[120px] -z-10 mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
        <div className="absolute inset-0 bg-dot-pattern -z-10 pointer-events-none opacity-50 dark:opacity-100" />

        <Sidebar sidebarOpen={sidebarOpen} />

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 relative h-full">
          <Topbar 
            sidebarOpen={sidebarOpen} 
            setSidebarOpen={setSidebarOpen} 
            isDark={isDark} 
            toggleDarkMode={toggleDarkMode} 
          />
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 lg:p-3 z-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
