import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ 
  className = '', 
  variant = 'rectangular', 
  width, 
  height 
}: SkeletonProps) {
  const baseStyles = 'animate-pulse bg-slate-200 dark:bg-slate-700';
  
  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style = {
    width: width,
    height: height,
  };

  return (
    <div 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={style}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
      <Skeleton variant="circular" width={48} height={48} className="mb-4" />
      <Skeleton variant="text" width="60%" className="mb-2" />
      <Skeleton variant="text" width="40%" className="mb-4" />
      <Skeleton variant="text" width="80%" height={60} />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="w-full space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="text" width="30%" />
          </div>
          <Skeleton variant="rectangular" width={80} height={24} />
        </div>
      ))}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Skeleton variant="text" width="40%" className="mb-2" />
          <Skeleton variant="text" width="30%" height={32} />
        </div>
        <Skeleton variant="circular" width={44} height={44} />
      </div>
      <Skeleton variant="text" width="50%" />
    </div>
  );
}
