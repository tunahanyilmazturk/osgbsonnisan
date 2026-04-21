import React from 'react';
import { motion } from 'motion/react';

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  trendDown?: boolean;
  trendLabel?: string;
  icon: React.ReactNode;
  color: string;
  chartColor: string;
}

export function StatCard({ 
  title, 
  value, 
  trend, 
  icon, 
  color, 
  trendDown, 
  trendLabel, 
  chartColor 
}: StatCardProps) {
  const pathData = trendDown 
    ? "M0,20 Q10,25 20,15 T40,25 T60,10 T80,30 T100,40"
    : "M0,40 Q10,35 20,45 T40,20 T60,30 T80,10 T100,5";

  return (
    <motion.div
      whileHover={{ scale: 1.02, rotateX: 2, rotateY: 2 }}
      transition={{ type: "spring" as const, stiffness: 400, damping: 20 }}
      className="bg-gradient-to-br from-white/90 to-white/60 dark:from-slate-800/90 dark:to-slate-800/60 backdrop-blur-xl p-5 lg:p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.3)] border border-slate-200/60 dark:border-slate-700/60 hover:shadow-2xl hover:shadow-indigo-500/15 hover:-translate-y-1 hover:border-indigo-300/50 dark:hover:border-indigo-500/30 transition-all duration-300 group cursor-default relative overflow-hidden flex flex-col justify-between h-full"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:via-purple-500/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none" />
      
      <div className={`absolute bottom-0 left-0 right-0 h-24 opacity-[0.05] dark:opacity-[0.1] pointer-events-none group-hover:scale-y-110 group-hover:opacity-[0.1] dark:group-hover:opacity-[0.2] transition-all duration-700 ${chartColor}`}>
        <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="w-full h-full vector-effect-non-scaling-stroke">
          <path d={pathData} fill="none" stroke="currentColor" strokeWidth="4" vectorEffect="non-scaling-stroke" />
          <path d={`${pathData} L100,50 L0,50 Z`} fill="currentColor" className="opacity-30" />
        </svg>
      </div>

      <div className="flex items-start justify-between relative z-10 mb-4">
        <div>
          <p className="text-[13px] font-semibold text-slate-500 dark:text-slate-400 mb-1 tracking-wide uppercase">{title}</p>
          <h3 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ease-out ${color}`}>
          {icon}
        </div>
      </div>
      
      <div className="flex items-center text-sm font-medium relative z-10 mt-auto pt-2">
        <span className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center transition-all shadow-sm ${trendDown ? 'bg-gradient-to-r from-rose-50 to-rose-100 text-rose-600 dark:from-rose-500/10 dark:to-rose-500/20 dark:text-rose-400 group-hover:shadow-md' : (trend?.includes('+') ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-600 dark:from-emerald-500/10 dark:to-emerald-500/20 dark:text-emerald-400 group-hover:shadow-md' : 'bg-gradient-to-r from-slate-50 to-slate-100 text-slate-600 dark:from-slate-700 dark:to-slate-600 dark:text-slate-300')}`}>
          {trendDown ? '↓' : '↑'} {trend}
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500 ml-2 font-medium">{trendLabel || 'geçen aya göre'}</span>
      </div>
    </motion.div>
  );
}
