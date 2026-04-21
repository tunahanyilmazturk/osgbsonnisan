import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({ 
  label, 
  error, 
  helperText, 
  leftIcon, 
  rightIcon, 
  className = '', 
  ...props 
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {leftIcon}
          </div>
        )}
        <input
          className={`w-full px-4 py-2.5 bg-white dark:bg-slate-800 border ${error ? 'border-rose-500 shadow-[0_0_0_3px_rgba(244,63,94,0.1)]' : 'border-slate-200 dark:border-slate-700'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''} ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      )}
    </div>
  );
}
