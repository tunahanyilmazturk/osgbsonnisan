import React from 'react';
import { Plus, Trash2, Download, RotateCcw, Grid, List, Upload } from 'lucide-react';
import { Button } from '../ui';

interface CompaniesHeaderProps {
  selectedCount: number;
  onBulkDelete: () => void;
  onReset: () => void;
  onExport: () => void;
  onExcelImport: () => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onAddCompany: () => void;
}

export default function CompaniesHeader({
  selectedCount,
  onBulkDelete,
  onReset,
  onExport,
  onExcelImport,
  viewMode,
  onViewModeChange,
  onAddCompany,
}: CompaniesHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
        {selectedCount > 0 && (
          <div
            className="flex items-center gap-2 px-3 py-2 bg-rose-100 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-xl shrink-0"
          >
            <span className="text-sm font-semibold text-rose-700 dark:text-rose-400">{selectedCount} seçili</span>
            <button
              onClick={onBulkDelete}
              className="p-1.5 rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 lg:gap-3 w-full lg:w-auto">
        {selectedCount === 0 && (
          <>
            <button
              onClick={onExcelImport}
              className="px-3 py-2 bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-xl text-blue-700 dark:text-blue-400 text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-500/20 transition-colors shrink-0 flex items-center gap-2"
            >
              <Upload size={14} />
              İçe Aktar
            </button>
            <button
              onClick={onExport}
              className="px-3 py-2 bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl text-emerald-700 dark:text-emerald-400 text-sm font-medium hover:bg-emerald-200 dark:hover:bg-emerald-500/20 transition-colors shrink-0 flex items-center gap-2"
            >
              <Download size={14} />
              Excel
            </button>
          </>
        )}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 shrink-0">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
          >
            <List size={18} />
          </button>
        </div>
        <Button variant="primary" icon={<Plus size={18} />} onClick={onAddCompany} className="shrink-0">
          <span className="hidden sm:inline">Yeni Firma</span>
          <span className="sm:hidden">Ekle</span>
        </Button>
      </div>
    </div>
  );
}
