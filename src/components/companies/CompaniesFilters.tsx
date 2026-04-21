import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, ArrowUpDown, X } from 'lucide-react';
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
}: CompaniesFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.sector-filter-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const filteredSectors = sectors
    .filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 20);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white/95 to-white/90 dark:from-slate-800/95 dark:to-slate-800/90 backdrop-blur-xl rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.3)] border border-slate-200/60 dark:border-slate-700/60 p-4 relative z-10"
    >
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
            <Input
              placeholder="Firma adı, yetkili kişi veya vergi no ara..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="relative sector-filter-dropdown">
          <div className="relative">
            <Input
              placeholder="Sektör ara..."
              value={searchTerm || selectedSector}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-64"
            />
            {selectedSector !== 'Tümü' && (
              <button
                type="button"
                onClick={() => {
                  onFilter('Tümü');
                  setSearchTerm('');
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X size={16} />
              </button>
            )}
          </div>
          {isDropdownOpen && (
            <div className="absolute z-[9999] w-64 mt-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl shadow-lg max-h-60 overflow-y-auto">
              {filteredSectors.map(sector => (
                <button
                  key={sector}
                  type="button"
                  onClick={() => {
                    onFilter(sector);
                    setSearchTerm('');
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                    selectedSector === sector
                      ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-600'
                  }`}
                >
                  {sector}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="name">Firma Adı</option>
            <option value="sector">Sektör</option>
            <option value="employeeCount">Çalışan Sayısı</option>
            <option value="createdAt">Kayıt Tarihi</option>
          </select>
          <button
            onClick={onSortOrderChange}
            className="p-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label={`Sıralama: ${sortOrder === 'asc' ? 'Artan' : 'Azalan'}`}
          >
            <ArrowUpDown size={18} className={sortOrder === 'desc' ? 'rotate-180' : ''} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
