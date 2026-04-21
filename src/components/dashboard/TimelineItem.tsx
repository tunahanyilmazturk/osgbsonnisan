import React from 'react';
import { motion } from 'motion/react';

interface TimelineItemProps {
  time: string;
  title: string;
  desc: string;
  status: 'completed' | 'current' | 'upcoming';
}

export function TimelineItem({ time, title, desc, status }: TimelineItemProps) {
  const isCurrent = status === 'current';
  const isCompleted = status === 'completed';
  
  return (
    <div className="relative pl-8 group">
      <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full shadow-lg flex items-center justify-center ring-4 ring-white dark:ring-slate-800 transition-colors duration-300
        ${isCompleted ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' : isCurrent ? 'bg-gradient-to-br from-indigo-400 to-indigo-600' : 'bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700'}
      `}>
        {isCurrent && (
          <motion.div 
            animate={{ scale: [1, 2, 1], opacity: [1, 0, 1] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 rounded-full bg-indigo-500 -z-10"
          />
        )}
      </div>
      
      <div className={`flex flex-col p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden ${isCurrent ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 dark:from-indigo-500/10 dark:to-purple-500/10 dark:border-indigo-500/30 shadow-lg shadow-indigo-500/10' : 'border-transparent hover:border-slate-200 dark:hover:border-slate-700/50 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-800/50 dark:hover:to-slate-800/70 group-hover:shadow-lg pt-2 pb-3 mb-2'}`}>
        {isCurrent && (
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-indigo-500/0 pointer-events-none" />
        )}
        <span className={`text-[11px] font-bold tracking-widest uppercase mb-1.5 ${isCurrent ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400' : 'text-slate-400 dark:text-slate-500'}`}>{time}</span>
        <span className={`text-[15px] font-bold leading-tight ${isCompleted ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-slate-100'}`}>{title}</span>
        <span className={`text-[13px] mt-1 line-clamp-2 ${isCurrent ? 'text-indigo-600/80 dark:text-indigo-400/80 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>{desc}</span>
      </div>
    </div>
  );
}
