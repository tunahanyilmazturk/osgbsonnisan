import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
}

export function Select({ 
  label, 
  error, 
  helperText, 
  options, 
  className = '', 
  ...props 
}: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          {label}
        </label>
      )}
      <select
        className={`w-full px-4 py-2.5 bg-white dark:bg-slate-800 border ${error ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 text-slate-900 dark:text-slate-100 transition-all cursor-pointer ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      )}
    </div>
  );
}
