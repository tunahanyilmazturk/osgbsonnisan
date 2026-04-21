import React from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2, LayoutGrid, List, Download, Upload } from 'lucide-react';
import { Button } from '../ui';

interface TestsHeaderProps {
  activeTab: 'tests' | 'packages';
  onTabChange: (tab: 'tests' | 'packages') => void;
  selectedTests: Set<string>;
  onBulkDelete: () => void;
  onExcelExport: () => void;
  onExcelImport: () => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onAddTest: () => void;
  onAddPackage: () => void;
}

export default function TestsHeader({
  activeTab,
  onTabChange,
  selectedTests,
  onBulkDelete,
  onExcelExport,
  onExcelImport,
  viewMode,
  onViewModeChange,
  onAddTest,
  onAddPackage,
}: TestsHeaderProps) {
  return (
    <motion.div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
        {/* Tabs */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1" role="tablist">
          <button
            onClick={() => onTabChange('tests')}
            role="tab"
            aria-selected={activeTab === 'tests'}
            aria-controls="tests-panel"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${
              activeTab === 'tests' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Testler
          </button>
          <button
            onClick={() => onTabChange('packages')}
            role="tab"
            aria-selected={activeTab === 'packages'}
            aria-controls="packages-panel"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${
              activeTab === 'packages' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Test Paketleri
          </button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 lg:gap-3 w-full lg:w-auto">
        {activeTab === 'tests' && selectedTests.size > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-3 py-2 bg-rose-100 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-xl shrink-0"
          >
            <span className="text-sm font-semibold text-rose-700 dark:text-rose-400">{selectedTests.size} seçili</span>
            <button
              onClick={onBulkDelete}
              className="p-1.5 rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </motion.div>
        )}
        {activeTab === 'tests' && (
          <>
            <button
              onClick={onExcelImport}
              className="px-3 py-2 bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-xl text-blue-700 dark:text-blue-400 text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-500/20 transition-colors shrink-0 flex items-center gap-2"
            >
              <Upload size={14} />
              İçe Aktar
            </button>
            <button
              onClick={onExcelExport}
              className="px-3 py-2 bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl text-emerald-700 dark:text-emerald-400 text-sm font-medium hover:bg-emerald-200 dark:hover:bg-emerald-500/20 transition-colors shrink-0 flex items-center gap-2"
            >
              <Download size={14} />
              Excel
            </button>
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 shrink-0">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
              >
                <List size={18} />
              </button>
            </div>
            <Button variant="primary" icon={<Plus size={16} />} onClick={onAddTest} className="shrink-0">
              <span className="hidden sm:inline">Yeni Test Ekle</span>
              <span className="sm:hidden">Ekle</span>
            </Button>
          </>
        )}
        {activeTab === 'packages' && (
          <Button variant="primary" icon={<Plus size={16} />} onClick={onAddPackage} className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/20 shrink-0">
            <span className="hidden sm:inline">Yeni Paket Oluştur</span>
            <span className="sm:hidden">Paket</span>
          </Button>
        )}
      </div>
    </motion.div>
  );
}
