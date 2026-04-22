import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, LogOut, ChevronRight, User, Settings, ChevronDown } from 'lucide-react';
import { menuGroups } from '../../lib/navigation';
import { appConfig, currentUser } from '../../constants';

export default function Sidebar({ sidebarOpen }: { sidebarOpen: boolean; }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<number, boolean>>({});

  return (
    <aside className={`bg-slate-50/80 dark:bg-[#0B1120] border-r border-slate-200 dark:border-white/5 flex flex-col z-20 shrink-0 hidden sm:flex text-slate-600 dark:text-slate-300 relative shadow-2xl shadow-indigo-900/5 dark:shadow-indigo-900/20 transition-colors duration-300 h-full rounded-r-3xl ${sidebarOpen ? 'w-[280px]' : 'w-[80px]'}`}>
      {/* Decorative Top Glow */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-indigo-500/5 dark:from-indigo-500/10 to-transparent pointer-events-none opacity-50" />

      {/* Logo Area */}
      <div className="h-16 lg:h-20 flex items-center px-6 border-b border-slate-200 dark:border-white/5 justify-between relative overflow-hidden shrink-0 transition-colors duration-300">
        <div className="flex items-center gap-3 overflow-hidden z-10 w-full">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/20 flex items-center justify-center shrink-0 relative overflow-hidden group ${!sidebarOpen && 'mx-auto'}`}>
            <div className="absolute inset-0 w-full h-full bg-indigo-400 mix-blend-overlay rotate-45 transform translate-x-full transition-transform group-hover:translate-x-0 duration-500"/>
            <Activity size={20} className="text-white relative z-10" />
          </div>
          {sidebarOpen && (
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white whitespace-nowrap transition-colors duration-300">
                {appConfig.name.split(' ')[0]}<span className="text-indigo-600 dark:text-indigo-400">{appConfig.name.split(' ')[1]}</span>
              </span>
            )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar py-6">
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-8 last:mb-0">
            {sidebarOpen && (
              <button
                onClick={() => setCollapsedGroups(prev => ({ ...prev, [groupIndex]: !prev[groupIndex] }))}
                className="px-6 mb-3 flex items-center gap-2 w-full group"
              >
                <span className="text-indigo-500 dark:text-indigo-400">
                  {group.icon}
                </span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider transition-colors duration-300 flex-1 text-left">
                  {group.title}
                </span>
                <ChevronDown 
                  size={12} 
                  className={`text-slate-400 dark:text-slate-500 transition-transform duration-200 ${collapsedGroups[groupIndex] ? '-rotate-90' : ''}`}
                />
              </button>
            )}
              {!collapsedGroups[groupIndex] && (
                <div className="space-y-1.5 px-3 overflow-hidden">
                  {group.items.map((item, index) => (
                    <NavLink 
                      key={index}
                      to={item.path}
                      title={!sidebarOpen ? item.name : ''}
                      className={({ isActive }) => `w-full flex items-center justify-between px-3 py-2.5 rounded-2xl transition-all group relative overflow-hidden ${isActive ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-semibold shadow-inner dark:shadow-white/5' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'}`}
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-600 dark:bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.4)] dark:shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                          )}
                          
                          <div className="flex items-center gap-3 w-full relative z-10">
                            <span className={`${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 dark:group-hover:text-slate-300'} transition-all shrink-0 ${!sidebarOpen && 'mx-auto'}`}>
                              {item.icon}
                            </span>
                            {sidebarOpen && (
                                <span className="text-sm whitespace-nowrap flex-1 text-left">
                                  {item.name}
                                </span>
                              )}
                          </div>
                          {sidebarOpen && item.badge && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm ${(item as any).badgeColor}`}>
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
        ))}
      </nav>

      {/* User Card */}
      <div className="p-4 mt-auto border-t border-slate-200 dark:border-white/5 shrink-0 relative bg-slate-100/50 dark:bg-[#0B1120]/50 transition-colors duration-300">
        <div className={`relative rounded-3xl bg-white/60 dark:bg-white/[0.05] border border-slate-200 dark:border-white/5 hover:border-indigo-200 dark:hover:border-white/10 hover:shadow-md dark:hover:shadow-none transition-all cursor-pointer overflow-hidden flex items-center justify-between ${sidebarOpen ? 'p-3' : 'p-2 justify-center'}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
          
          <div className="flex items-center gap-3 relative z-10 w-full overflow-hidden justify-center sm:justify-start">
            <div className="relative">
              <div className={`rounded-2xl bg-gradient-to-br from-indigo-100 dark:from-indigo-500/20 to-indigo-50 dark:to-slate-800 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center shrink-0 transition-transform ${sidebarOpen ? 'w-10 h-10' : 'w-10 h-10'}`}>
                <span className="text-indigo-600 dark:text-indigo-100 font-bold text-sm tracking-widest leading-none">{currentUser.initials}</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800 shadow-sm">
                <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
              </div>
            </div>
            
            {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate hover:text-indigo-600 dark:hover:text-indigo-200 transition-colors">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">{currentUser.role}</p>
                </div>
              )}

            {sidebarOpen && (
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="p-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors ml-auto relative z-20 shrink-0"
              >
                <ChevronRight size={16} className={`transition-transform ${userMenuOpen ? 'rotate-90' : ''}`} />
              </button>
            )}
          </div>

          {userMenuOpen && sidebarOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-30">
                <button className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors rounded-t-2xl">
                  <User size={16} className="text-slate-500 dark:text-slate-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Profil</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <Settings size={16} className="text-slate-500 dark:text-slate-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Ayarlar</span>
                </button>
                <div className="border-t border-slate-200 dark:border-slate-700"></div>
                <button className="w-full flex items-center gap-3 p-3 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors text-rose-600 dark:text-rose-400 rounded-b-2xl">
                  <LogOut size={16} />
                  <span className="text-sm font-medium">Çıkış Yap</span>
                </button>
              </div>
            )}
        </div>
      </div>
    </aside>
  );
}
