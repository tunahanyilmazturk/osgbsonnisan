import React, { useState } from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function Toggle({ checked, onChange, label, description, disabled = false, icon }: ToggleProps) {
  return (
    <div className={`flex items-center justify-between ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <div className="flex items-center gap-3 flex-1">
        {icon && (
          <div className="text-slate-400 dark:text-slate-500">
            {icon}
          </div>
        )}
        <div className="flex-1">
          {label && (
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {label}
            </span>
          )}
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked 
            ? 'bg-indigo-600 dark:bg-indigo-500' 
            : 'bg-slate-200 dark:bg-slate-700'
        } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        disabled={disabled}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${
            checked ? 'translate-x-5 shadow-indigo-500/50' : 'translate-x-1 shadow-slate-400/50'
          }`}
        />
      </button>
    </div>
  );
}
