import React, { useState } from 'react';
import { 
  Users, Calendar, AlertTriangle, CheckCircle2, 
  Activity, ChevronRight, FileText, Plus, TrendingUp,
  Clock, Sun, Award, Target, Zap, Bell, X
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StatCard, TimelineItem, ScreeningList, NotificationPanel } from '../components/dashboard';
import { chartData, recentScreenings, timelineItems } from '../constants';
import { Button } from '../components/ui';

export default function Dashboard() {
  const isDark = document.documentElement.classList.contains('dark');
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <div className="w-full space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col gap-6 pb-4">
        {/* Top Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-500/10 dark:to-emerald-500/20 border border-emerald-200/50 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold tracking-wide shadow-lg shadow-emerald-500/20 dark:shadow-emerald-500/10 backdrop-blur-sm shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Sistem Aktif ve Senkronize
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 border border-indigo-200 dark:border-indigo-500/30 shrink-0">
              <Clock size={14} className="text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">09:15 AM</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 border border-amber-200 dark:border-amber-500/30 shrink-0">
              <Sun size={14} className="text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">24°C</span>
            </div>
          </div>
          <div className="flex gap-2 lg:gap-3 items-center">
            {/* Notification Toggle */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2.5 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:shadow-lg transition-all"
              >
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.8)] animate-pulse"></span>
              </button>

              {notificationsOpen && (
                  <div className="absolute right-0 top-14 z-50">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4">
                      <NotificationPanel />
                    </div>
                  </div>
                )}
            </div>

            <div>
              <Button variant="secondary" icon={<FileText size={16} />} className="shrink-0">
                <span className="hidden sm:inline">Toplu Rapor</span>
                <span className="sm:hidden">Rapor</span>
              </Button>
            </div>
            <div>
              <Button variant="primary" icon={<Activity size={16} />} className="shrink-0">
                <span className="hidden sm:inline">Yeni Tarama</span>
                <span className="sm:hidden">Tarama</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 dark:from-white dark:via-indigo-200 dark:to-purple-200 pb-1">
              Günaydın, Tunahan
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-3 flex flex-wrap items-center gap-2 font-medium">
              <Calendar size={14} className="text-indigo-500 dark:text-indigo-400" />
              Bugün planlanan <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 font-bold shadow-sm">3 firma ziyareti</span> ve <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 font-bold shadow-sm">45 sağlık taraması</span> bulunuyor.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 xl:pb-0 scrollbar-hide">
            <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-2xl border border-indigo-200 dark:border-indigo-500/30 shadow-sm shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
                <Target size={14} className="sm:size={18}" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Hedef</p>
                <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">98%</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 rounded-2xl border border-amber-200 dark:border-amber-500/30 shadow-sm shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg">
                <Award size={14} className="sm:size={18}" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Başarı</p>
                <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">A+</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/10 rounded-2xl border border-emerald-200 dark:border-emerald-500/30 shadow-sm shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg">
                <Zap size={14} className="sm:size={18}" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Hız</p>
                <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">⚡</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        <StatCard
          title="Taranan Personel"
          value="1,248"
          trend="+12%"
          icon={<Users className="text-indigo-600 dark:text-indigo-400" size={24} />}
          color="bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20"
          chartColor="text-indigo-500"
        />
        <StatCard
          title="Bekleyen Taramalar"
          value="156"
          trend="-5%"
          trendDown
          icon={<Calendar className="text-amber-600 dark:text-amber-400" size={24} />}
          color="bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20"
          chartColor="text-amber-500"
        />
        <StatCard
          title="Riskli Durumlar"
          value="24"
          trend="+2"
          trendLabel="düne göre"
          icon={<AlertTriangle className="text-rose-600 dark:text-rose-400" size={24} />}
          color="bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20"
          chartColor="text-rose-500"
        />
        <StatCard
          title="Sağlam Bildirimi"
          value="98.2%"
          trend="+0.4%"
          icon={<CheckCircle2 className="text-emerald-600 dark:text-emerald-400" size={24} />}
          color="bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20"
          chartColor="text-emerald-500"
        />
      </div>

      {/* Analytics Chart */}
      <div className="bg-gradient-to-br from-white/95 to-white/90 dark:from-slate-800/95 dark:to-slate-800/90 backdrop-blur-xl rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)] border border-slate-200/60 dark:border-slate-700/60 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-indigo-500/0 pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 relative z-10 gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-indigo-900 dark:from-white dark:to-indigo-200 flex items-center gap-2">
                <TrendingUp className="text-indigo-500 w-5 h-5"/>
                Tarama Yoğunluk Analizi
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Aylık bazda genel personel muayene yükü trendi</p>
          </div>
        </div>
        <div className="h-64 sm:h-72 w-full mt-4 relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTarama" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gradientStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#e2e8f0'} opacity={0.5} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12}} />
              <Tooltip
                contentStyle={{backgroundColor: isDark ? '#1e293b' : '#ffffff', borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px'}}
                itemStyle={{color: '#6366f1', fontWeight: 'bold'}}
                labelStyle={{color: isDark ? '#94a3b8' : '#64748b', fontWeight: '500'}}
                formatter={(value) => [`${value} tarama`, '']}
              />
              <Area
                type="monotone"
                dataKey="tarama"
                stroke="url(#gradientStroke)"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorTarama)"
                activeDot={{ r: 8, stroke: '#6366f1', strokeWidth: 3, fill: '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Main Content Split - Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pb-10">

        {/* Recent Screenings List */}
        <div className="bg-gradient-to-br from-white/95 to-white/90 dark:from-slate-800/95 dark:to-slate-800/90 backdrop-blur-xl rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)] border border-slate-200/60 dark:border-slate-700/60 p-4 sm:p-6 lg:p-8 lg:col-span-8 flex flex-col relative overflow-hidden">
          {/* Decorative Background Blob */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl -z-10" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 relative z-10 gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-indigo-900 dark:from-white dark:to-indigo-200 flex items-center gap-2">
                  <Activity className="text-indigo-500 w-5 h-5"/>
                  Son Taramalar
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">İlgilenmeniz gereken son muayene kayıtları</p>
            </div>
            <button className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 transition-all px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-500/10 dark:to-indigo-500/20 hover:from-indigo-100 hover:to-indigo-150 dark:hover:from-indigo-500/20 dark:hover:to-indigo-500/30 group shrink-0">
              Tümünü Gör <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Custom Table Header */}
          <div className="hidden sm:flex items-center px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/70 rounded-xl mb-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest relative border border-slate-200 dark:border-slate-700/50">
            <div className="flex-1 w-full pl-14">Personel Detayları</div>
            <div className="w-24 text-left">Muayene</div>
            <div className="w-28 text-center">Durum</div>
            <div className="w-20 text-right pr-2">Kayıt No</div>
          </div>

          <ScreeningList screenings={recentScreenings} />
        </div>

        {/* Today's Schedule */}
        <div className="bg-gradient-to-br from-white/95 to-white/90 dark:from-slate-800/95 dark:to-slate-800/90 backdrop-blur-xl rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)] border border-slate-200/60 dark:border-slate-700/60 p-4 sm:p-6 lg:p-8 lg:col-span-4 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-[40px] -z-10 pointer-events-none" />

          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Günlük Plan</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">12 Haziran Salı</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Calendar size={20} />
            </div>
          </div>

          {/* Progress Bar for Today */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-slate-500 dark:text-slate-400">Tamamlanan</span>
              <span className="text-indigo-600 dark:text-indigo-400">12 / 45 Tarama</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full relative" style={{ width: '26%' }}>
                <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/30" />
              </div>
            </div>
          </div>

          <div className="flex-1 relative border-l border-slate-200 dark:border-slate-700 ml-4 space-y-6 pb-4 overflow-y-auto max-h-96 scrollbar-hide">
            {timelineItems.map((item, i) => (
              <TimelineItem key={i} {...item} />
            ))}
          </div>

          <Button variant="secondary" className="w-full border-dashed mt-4" icon={<Plus size={16} />}>
            Yeni Plan Ekle
          </Button>
        </div>

      </div>
    </div>
  );
}

