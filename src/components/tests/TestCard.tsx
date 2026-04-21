import React from 'react';
import { motion } from 'motion/react';
import { Edit, Trash2, Copy, Beaker } from 'lucide-react';

interface TestCardProps {
  test: {
    id: string;
    name: string;
    category: string;
    price: number;
    unit: string;
  };
  categoryColors: { [key: string]: { bg: string; icon: string; darkBg: string; darkIcon: string } };
  categoryIcons: { [key: string]: React.ReactNode };
  selectedTests: Set<string>;
  onEdit: (test: any) => void;
  onDelete: (id: string) => void;
  onCopy: (test: any) => void;
  onSelect: (id: string) => void;
  index: number;
}

export default function TestCard({
  test,
  categoryColors,
  categoryIcons,
  selectedTests,
  onEdit,
  onDelete,
  onCopy,
  onSelect,
  index,
}: TestCardProps) {
  return (
    <motion.div
      key={test.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-gradient-to-br from-white/95 to-white/90 dark:from-slate-800/95 dark:to-slate-800/90 backdrop-blur-xl rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)] border border-slate-200/60 dark:border-slate-700/60 p-5 hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/20 transition-all group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-indigo-500/0 group-hover:from-indigo-500/5 group-hover:via-purple-500/5 group-hover:to-indigo-500/5 dark:group-hover:from-indigo-500/10 dark:group-hover:via-purple-500/10 dark:group-hover:to-indigo-500/10 transition-all duration-300 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedTests.has(test.id)}
              onChange={() => onSelect(test.id)}
              aria-label={`${test.name} seç`}
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-0 focus:ring-offset-white dark:focus:ring-offset-slate-800"
            />
            <div className={`w-10 h-10 rounded-xl ${categoryColors[test.category]?.bg} ${categoryColors[test.category]?.darkBg} flex items-center justify-center ${categoryColors[test.category]?.icon} ${categoryColors[test.category]?.darkIcon} shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/10`} aria-hidden="true">
              {categoryIcons[test.category] || <Beaker size={20} />}
            </div>
          </div>
          <div className="flex gap-1">
            <button onClick={() => onCopy(test)} aria-label={`${test.name} kopyala`} className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800">
              <Copy size={14} />
            </button>
            <button onClick={() => onEdit(test)} aria-label={`${test.name} düzenle`} className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800">
              <Edit size={14} />
            </button>
            <button onClick={() => onDelete(test.id)} aria-label={`${test.name} sil`} className="p-2 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800">
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        <h3 className="font-bold text-slate-900 dark:text-white mb-1">{test.name}</h3>
        <p className={`text-xs ${categoryColors[test.category]?.icon} ${categoryColors[test.category]?.darkIcon} font-medium mb-3`}>{test.category}</p>
        
        <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
          <span className="text-lg font-bold text-slate-900 dark:text-white">{test.price} {test.unit}</span>
          <span className="text-xs text-slate-400 dark:text-slate-500">Birim fiyat</span>
        </div>
      </div>
    </motion.div>
  );
}
