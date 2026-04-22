import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Input } from '../ui';

interface ProposalsFiltersProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  selectedStatus: string;
  statuses: string[];
  statusColors: { [key: string]: { bg: string; icon: string; darkBg: string; darkIcon: string } };
  onFilter: (status: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: () => void;
  showAdvancedFilters: boolean;
  onToggleAdvancedFilters: () => void;
}

export default function ProposalsFilters({
  searchQuery,
  onSearch,
  selectedStatus,
  statuses,
  statusColors,
  onFilter,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
  showAdvancedFilters,
  onToggleAdvancedFilters,
}: ProposalsFiltersProps) {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="relative w-full lg:flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} aria-hidden="true" />
        <Input
          placeholder="Teklif ara..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10 pr-44"
          aria-label="Tekliflerde ara"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <div className="relative">
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="px-2 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-1"
            >
              {selectedStatus === 'all' ? 'Tümü' : selectedStatus}
              <ChevronDown size={12} />
            </button>
            {showStatusDropdown && (
              <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-10">
                {statuses.map(status => (
                  <button
                    key={status}
                    onClick={() => {
                      onFilter(status);
                      setShowStatusDropdown(false);
                    }}
                    className="w-full px-3 py-2 text-left text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
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
          <option value="date">Tarihe Göre</option>
          <option value="price">Fiyata Göre</option>
          <option value="status">Duruma Göre</option>
        </select>
        <button
          onClick={onSortOrderChange}
          className="px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shrink-0"
        >
          {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
        </button>
      </div>
    </div>
  );
}
