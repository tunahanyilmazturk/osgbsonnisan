import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export function Loading({ size = 'md', color = 'currentColor' }: LoadingProps) {
  const sizes = {
    sm: 16,
    md: 24,
    lg: 32,
  };

  return (
    <svg
      className="animate-spin"
      width={sizes[size]}
      height={sizes[size]}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill={color}
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
}

export function LoadingOverlay({ isLoading, children }: LoadingOverlayProps) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-10">
          <Loading size="lg" />
        </div>
      )}
    </div>
  );
}
