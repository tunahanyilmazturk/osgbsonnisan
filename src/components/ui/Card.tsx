import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  tilt?: boolean;
  glow?: boolean;
}

export function Card({ children, className = '', hover = false, tilt = false, glow = false }: CardProps) {
  return (
    <div
      className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] dark:shadow-[0_2px_15px_rgba(0,0,0,0.2)] border border-slate-200/60 dark:border-slate-700/60 relative overflow-hidden ${hover ? 'cursor-pointer' : ''} ${glow ? 'group' : ''} transition-all duration-300 ${className}`}
    >
      {glow && (
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}
      {children}
    </div>
  );
}
