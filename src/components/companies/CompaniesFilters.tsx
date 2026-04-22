import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Input } from '../ui';

interface CompaniesFiltersProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  selectedSector: string;
  sectors: string[];
  sectorColors: { [key: string]: { bg: string; icon: string; darkBg: string; darkIcon: string } };
  onFilter: (sector: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: () => void;
  showAdvancedFilters: boolean;
  onToggleAdvancedFilters: () => void;
  showSectorPanel: boolean;
  onToggleSectorPanel: () => void;
}

export default function CompaniesFilters({
  searchQuery,
  onSearch,
  selectedSector,
  sectors,
  sectorColors,
  onFilter,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
  showAdvancedFilters,
  onToggleAdvancedFilters,
  showSectorPanel,
  onToggleSectorPanel,
}: CompaniesFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative w-full lg:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} aria-hidden="true" />
          <Input
            placeholder="Firma ara..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-10 pr-44"
            aria-label="Firmalarda ara"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button
              onClick={onToggleSectorPanel}
              className="px-2 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-1"
            >
              {selectedSector === 'Tümü' ? 'Tümü' : selectedSector}
              <ChevronDown size={12} />
            </button>
            <button
              onClick={onToggleAdvancedFilters}
              className="px-2 py-1.5 bg-indigo-100 dark:bg-indigo-500/10 rounded-lg text-xs font-medium text-indigo-700 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-500/20 transition-colors"
            >
              {showAdvancedFilters ? 'Gelişmiş' : 'Gelişmiş'}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1 lg:flex-none"
          >
            <option value="name">Firma Adı</option>
            <option value="sector">Sektör</option>
            <option value="employeeCount">Çalışan Sayısı</option>
            <option value="createdAt">Kayıt Tarihi</option>
          </select>
          <button
            onClick={onSortOrderChange}
            className="px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shrink-0"
          >
            {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
          </button>
        </div>
      </div>
      {showSectorPanel && (
        <div className="bg-gradient-to-br from-white/95 to-white/90 dark:from-slate-800/95 dark:to-slate-800/90 backdrop-blur-xl rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)] border border-slate-200/60 dark:border-slate-700/60 p-5">
          <div className="flex flex-wrap gap-2">
            {sectors.map(sector => (
              <button
                key={sector}
                onClick={() => onFilter(sector)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedSector === sector
                    ? 'bg-indigo-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {sector}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
