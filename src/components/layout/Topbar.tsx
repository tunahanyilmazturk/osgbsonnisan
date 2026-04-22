import React, { useState, useEffect, useRef } from 'react';
import { Menu, Search, Command, Sun, Moon, Bell, X, User, LogOut, Settings, Building2, Users, FlaskConical, ArrowRight, HelpCircle, Info, AlertTriangle, Plus } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getRouteName } from '../../lib/navigation';
import { appConfig, currentUser, initialCompanies, initialStaff } from '../../constants';

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
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const notifications = [
    { id: 1, title: 'Yeni tarama atandı', description: 'ABC Lojistik A.Ş.', time: '5 dk önce', read: false },
    { id: 2, title: 'Rapor hazır', description: 'Haziran 2024 raporu', time: '1 saat önce', read: false },
    { id: 3, title: 'Personel eklendi', description: 'Ahmet Yılmaz - İş Yeri Hekimi', time: '2 saat önce', read: true },
    { id: 4, title: 'Firma güncellendi', description: 'XYZ Teknoloji Ltd.', time: '3 saat önce', read: true },
  ];
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
      if (e.key === 'Escape') {
        setSearchModalOpen(false);
        setSearchQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (searchQuery.length > 0) {
      const results = [
        ...initialCompanies
          .filter(c => 
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.taxNumber.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 3)
          .map(c => ({ ...c, type: 'company', icon: Building2 })),
        ...initialStaff
          .filter(s => 
            s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.lastName.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 3)
          .map(s => ({ ...s, type: 'staff', icon: Users })),
      ].slice(0, 6);
      setSearchResults(results);
      setActiveIndex(0);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  return (
    <header className="h-16 lg:h-20 bg-white/70 dark:bg-[#0B1120]/70 backdrop-blur-xl border-b border-slate-200/60 dark:border-white/5 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 shrink-0 supports-[backdrop-filter]:bg-white/50 dark:supports-[backdrop-filter]:bg-[#0B1120]/50 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2.5 -ml-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hidden sm:block transition-all duration-300"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2.5 text-sm">
          <span className="font-bold text-slate-900 dark:text-white tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {appConfig.name}
          </span>
          <span className="text-slate-300 dark:text-slate-600 font-light">/</span>
          <span className="text-slate-500 dark:text-slate-400 font-medium">{currentPathName}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-5">
        <div className="relative hidden md:flex items-center group">

          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors z-10" size={16} />
          <input 
            type="text" 
            placeholder="Personel veya firma ara..." 
            onFocus={() => setSearchModalOpen(true)}
            className="w-64 lg:w-80 pl-10 pr-14 py-2 bg-white/60 dark:bg-[#05080F]/60 hover:bg-white dark:hover:bg-[#05080F] border border-slate-200/80 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-0 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.2)] relative z-10 cursor-pointer"
            readOnly
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 px-1.5 py-0.5 rounded-md text-[10px] font-bold text-slate-500 dark:text-slate-400 pointer-events-none z-10">
            <Command size={10} /> K
          </div>
        </div>
        
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800/80 hidden md:block mx-1"></div>

        <div className="relative">
          <button
            onClick={() => setQuickActionsOpen(!quickActionsOpen)}
            className="p-2 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all"
          >
            <Plus size={18} />
          </button>

          {quickActionsOpen && (
              <div className="absolute right-0 top-12 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-2 z-50">
                <button
                  onClick={() => { navigate('/tests'); setQuickActionsOpen(false); }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <FlaskConical size={16} className="text-indigo-500" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Yeni Test</span>
                </button>
                <button
                  onClick={() => { navigate('/companies'); setQuickActionsOpen(false); }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <Building2 size={16} className="text-emerald-500" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Yeni Firma</span>
                </button>
                <button
                  onClick={() => { navigate('/personnel'); setQuickActionsOpen(false); }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <Users size={16} className="text-blue-500" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Yeni Personel</span>
                </button>
              </div>
            )}
        </div>

        <button
          onClick={toggleDarkMode}
          className="p-2 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-amber-500 dark:hover:text-amber-400 rounded-xl transition-all"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl transition-all"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-[0_0_8px_rgba(244,63,94,0.8)]">
                {unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
              <div className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 z-50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Bildirimler</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => {
                        notifications.forEach(n => n.read = true);
                      }}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Tümünü okundu yap
                    </button>
                  )}
                </div>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-xl transition-colors ${
                        !notification.read
                          ? 'bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30'
                          : 'bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${!notification.read ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${!notification.read ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{notification.description}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate('/notifications')}
                  className="w-full mt-3 py-2 text-sm text-center text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-colors"
                >
                  Tüm bildirimleri gör
                </button>
              </div>
            )}
        </div>
        
        {/* Desktop Profile Avatar */}
        <div className="relative hidden sm:block">
          <button
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
          </button>

          {profileOpen && (
              <div className="absolute right-0 top-12 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-2 z-50">
                <button 
                  onClick={() => { navigate('/profile'); setProfileOpen(false); }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <User size={16} className="text-slate-500 dark:text-slate-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Profil</span>
                </button>
                <button 
                  onClick={() => { navigate('/settings'); setProfileOpen(false); }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <Settings size={16} className="text-slate-500 dark:text-slate-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Ayarlar</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <HelpCircle size={16} className="text-slate-500 dark:text-slate-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Yardım</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <Info size={16} className="text-slate-500 dark:text-slate-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Hakkında</span>
                </button>
                <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors text-rose-600 dark:text-rose-400">
                  <LogOut size={16} />
                  <span className="text-sm font-medium">Çıkış Yap</span>
                </button>
              </div>
            )}
        </div>
        
        {/* Mobile Profile Avatar */}
        <div className="ml-2 w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 sm:hidden flex items-center justify-center text-white text-xs font-bold shadow-sm">
          {currentUser.initials}
        </div>
      </div>

      {/* Search Modal */}
      {searchModalOpen && (
          <>
            <div
              onClick={() => setSearchModalOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Firma veya personel ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <X size={18} className="text-slate-400" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {searchQuery.length === 0 ? (
                  <div className="p-8 text-center">
                    <FlaskConical size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                    <p className="text-slate-500 dark:text-slate-400 mb-2">Arama yapmaya başlayın</p>
                    <p className="text-sm text-slate-400 dark:text-slate-500">Firma veya personel ismi ile arayın</p>
                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                  <Command size={12} />
                  <span>+</span>
                  <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs">K</kbd>
                  <span>klavye kısayolu</span>
                </div>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="p-8 text-center">
                    <Search size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                    <p className="text-slate-500 dark:text-slate-400">Sonuç bulunamadı</p>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">Başka bir arama terimi deneyin</p>
                  </div>
                ) : (
                  <div className="p-2">
                    {searchResults.map((result, index) => (
                      <button
                        key={result.id}
                        onClick={() => {
                          if (result.type === 'company') {
                            navigate('/companies');
                          } else {
                            navigate('/personnel');
                          }
                          setSearchModalOpen(false);
                          setSearchQuery('');
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                          index === activeIndex
                            ? 'bg-indigo-50 dark:bg-indigo-500/20'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                          {result.icon && <result.icon size={20} className="text-slate-500 dark:text-slate-400" />}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-slate-900 dark:text-white">
                            {result.type === 'company' ? result.name : `${result.firstName} ${result.lastName}`}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {result.type === 'company' ? result.sector : result.position}
                          </p>
                        </div>
                        <ArrowRight size={16} className="text-slate-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
    </header>
  );
}
