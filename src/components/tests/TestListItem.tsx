import React from 'react';
import { motion } from 'motion/react';
import { Edit, Trash2, Copy, Beaker } from 'lucide-react';

interface TestListItemProps {
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

export default function TestListItem({
  test,
  categoryColors,
  categoryIcons,
  selectedTests,
  onEdit,
  onDelete,
  onCopy,
  onSelect,
  index,
}: TestListItemProps) {
  return (
    <motion.tr
      key={test.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-slate-200 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
    >
      <td className="p-4">
        <input
          type="checkbox"
          checked={selectedTests.has(test.id)}
          onChange={() => onSelect(test.id)}
          className="w-4 h-4 rounded border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-0"
        />
      </td>
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg ${categoryColors[test.category]?.bg} ${categoryColors[test.category]?.darkBg} flex items-center justify-center ${categoryColors[test.category]?.icon} ${categoryColors[test.category]?.darkIcon} shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/10`} aria-hidden="true">
            {categoryIcons[test.category] || <Beaker size={16} />}
          </div>
          <span className="font-semibold text-slate-900 dark:text-white">{test.name}</span>
        </div>
      </td>
      <td className="p-4">
        <span className={`px-2.5 py-1 rounded-lg ${categoryColors[test.category]?.bg} ${categoryColors[test.category]?.darkBg} border border-slate-200 dark:border-slate-600 ${categoryColors[test.category]?.icon} ${categoryColors[test.category]?.darkIcon} text-xs font-bold`}>
          {test.category}
        </span>
      </td>
      <td className="p-4 text-right">
        <span className="font-bold text-slate-900 dark:text-white">{test.price} {test.unit}</span>
      </td>
      <td className="p-4">
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => onCopy(test)} className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors">
            <Copy size={14} />
          </button>
          <button onClick={() => onEdit(test)} className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors">
            <Edit size={14} />
          </button>
          <button onClick={() => onDelete(test.id)} className="p-2 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}
