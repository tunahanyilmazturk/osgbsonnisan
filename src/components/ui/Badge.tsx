import React from 'react';

interface BadgeProps {
  status: string;
  className?: string;
}

export function Badge({ status, className = '' }: BadgeProps) {
  const styles: Record<string, string> = {
    Temiz: 'bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.05)] dark:shadow-[0_0_10px_rgba(16,185,129,0.1)]',
    'İncelemede': 'bg-indigo-50 text-indigo-700 border-indigo-200/50 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.05)] dark:shadow-[0_0_10px_rgba(99,102,241,0.1)]',
    'Sevk Edildi': 'bg-rose-50 text-rose-700 border-rose-200/50 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.05)] dark:shadow-[0_0_10px_rgba(244,63,94,0.1)]',
  };
  
  return (
    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border w-28 text-center transition-all ${styles[status] || 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'} ${className}`}>
      {status}
    </span>
  );
}
