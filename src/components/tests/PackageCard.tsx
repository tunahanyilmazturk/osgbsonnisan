import React from 'react';
import { motion } from 'motion/react';
import { Edit, Trash2, Package } from 'lucide-react';
import { TestPackage } from '../../constants/mockData';

interface PackageCardProps {
  pkg: TestPackage;
  tests: Array<{ id: string; name: string; category: string; price: number; unit: string }>;
  onEdit: (pkg: any) => void;
  onDelete: (id: string) => void;
}

export default function PackageCard({
  pkg,
  tests,
  onEdit,
  onDelete,
}: PackageCardProps) {
  return (
    <motion.div
      key={pkg.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white/95 to-white/90 dark:from-slate-800/95 dark:to-slate-800/90 backdrop-blur-xl rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)] border border-slate-200/60 dark:border-slate-700/60 p-5"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/10">
          <Package size={24} />
        </div>
        <div className="flex gap-1">
          <button onClick={() => onEdit(pkg)} className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800">
            <Edit size={14} />
          </button>
          <button onClick={() => onDelete(pkg.id)} className="p-2 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <h3 className="font-bold text-slate-900 dark:text-white mb-2">{pkg.name}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{pkg.testIds.length} test içeriyor</p>

      <div className="space-y-2 mb-4">
        {pkg.testIds.slice(0, 3).map((testId) => {
          const test = tests.find(t => t.id === testId);
          return test ? (
            <div key={testId} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              {test.name}
            </div>
          ) : null;
        })}
        {pkg.testIds.length > 3 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">+{pkg.testIds.length - 3} test daha</p>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
        <div>
          <span className="text-lg font-bold text-slate-900 dark:text-white">{pkg.totalPrice} ₺</span>
          {pkg.discountPercentage > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-slate-500 dark:text-slate-400 line-through">{pkg.originalPrice} ₺</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">%{pkg.discountPercentage} indirim</span>
            </div>
          )}
        </div>
        <span className="text-xs text-slate-400 dark:text-slate-500">Toplam fiyat</span>
      </div>
    </motion.div>
  );
}
