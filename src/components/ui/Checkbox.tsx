import React from 'react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export function Checkbox({ label, error, className = '', ...props }: CheckboxProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="relative flex items-center">
        <input
          type="checkbox"
          className={`w-5 h-5 rounded border ${error ? 'border-rose-500' : 'border-slate-300 dark:border-slate-600'} text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 dark:focus:ring-offset-slate-900 cursor-pointer transition-all ${className}`}
          {...props}
        />
      </div>
      {label && (
        <label className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer select-none">
          {label}
        </label>
      )}
      {error && (
        <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{error}</p>
      )}
    </div>
  );
}
