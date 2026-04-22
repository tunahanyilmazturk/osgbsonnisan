import React from 'react';

export default function PlaceholderPage({ title, description }: { title: string, description: string }) {
  return (
    <div className="w-full space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 dark:from-white dark:via-indigo-200 dark:to-slate-300 pb-1">
            {title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 font-medium">
            {description} sayfası yapım aşamasındadır.
          </p>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-200/60 dark:border-slate-700/60 p-12 flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl">🚧</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Yakında Eklenecek</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md">
          {title} modülü şu anda geliştirme aşamasındadır. Çok yakında bu ekrandan tüm işlemlerinizi yönetebileceksiniz.
        </p>
      </div>
    </div>
  );
}
