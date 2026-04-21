import React from 'react';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import { Input } from '../ui';

interface PersonnelFiltersProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  selectedPosition: string;
  positions: string[];
  positionColors: { [key: string]: { bg: string; icon: string; darkBg: string; darkIcon: string } };
  onFilter: (position: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: () => void;
}

export default function PersonnelFilters({
  searchQuery,
  onSearch,
  selectedPosition,
  positions,
  positionColors,
  onFilter,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
}: PersonnelFiltersProps) {
  return (
    <motion.div className="flex flex-col lg:flex-row gap-4">
      <div className="relative w-full lg:flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} aria-hidden="true" />
        <Input
          placeholder="Personel ara..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10"
          aria-label="Personellerde ara"
        />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto scrollbar-hide" role="group" aria-label="Pozisyon filtreleri">
        {positions.map(position => {
          const colors = positionColors[position];
          return (
            <button
              key={position}
              onClick={() => onFilter(position)}
              aria-pressed={selectedPosition === position}
              aria-label={`${position} filtresini uygula`}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap shrink-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${
                selectedPosition === position
                  ? `${colors?.bg} ${colors?.darkBg} ${colors?.icon} ${colors?.darkIcon} shadow-lg`
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {position}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-2 w-full lg:w-auto">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1 lg:flex-none"
        >
          <option value="name">İsme Göre</option>
          <option value="position">Pozisyona Göre</option>
          <option value="startDate">Tarihe Göre</option>
        </select>
        <button
          onClick={onSortOrderChange}
          className="px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shrink-0"
        >
          {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
        </button>
      </div>
    </motion.div>
  );
}
