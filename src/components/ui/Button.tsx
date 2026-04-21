import React from 'react';
import { motion } from 'motion/react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  icon, 
  children, 
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = 'rounded-xl font-semibold transition-all active:scale-95 flex items-center gap-2 relative overflow-hidden';
  
  const variants = {
    primary: 'bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/30 text-white shadow-sm',
    secondary: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm',
    ghost: 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      <motion.div
        className="absolute inset-0 bg-white/20 rounded-xl opacity-0"
        whileTap={{ opacity: 1, scale: 1.5 }}
        transition={{ duration: 0.3 }}
      />
      {icon}
      {children}
    </motion.button>
  );
}
