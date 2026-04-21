import React from 'react';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import { Input } from '../ui';

interface TestFiltersProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  selectedCategory: string;
  categories: string[];
  categoryColors: { [key: string]: { bg: string; icon: string; darkBg: string; darkIcon: string } };
  onFilter: (category: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: () => void;
}

export default function TestFilters({
  searchQuery,
  onSearch,
  selectedCategory,
  categories,
  categoryColors,
  onFilter,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
}: TestFiltersProps) {
  return (
    <motion.div className="flex flex-col lg:flex-row gap-4">
      <div className="relative w-full lg:flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} aria-hidden="true" />
        <Input
          placeholder="Test ara..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10"
          aria-label="Testlerde ara"
        />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto scrollbar-hide" role="group" aria-label="Kategori filtreleri">
        {categories.map(category => {
          const colors = categoryColors[category];
          return (
            <button
              key={category}
              onClick={() => onFilter(category)}
              aria-pressed={selectedCategory === category}
              aria-label={`${category} filtresini uygula`}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap shrink-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${
                selectedCategory === category
                  ? `${colors?.bg} ${colors?.darkBg} ${colors?.icon} ${colors?.darkIcon} shadow-lg`
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {category}
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
          <option value="category">Kategoriye Göre</option>
          <option value="price">Fiyata Göre</option>
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
