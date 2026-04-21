import React from 'react';
import { motion } from 'motion/react';
import { Activity, ChevronRight } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { generateAvatar } from '../../utils/helpers';
import { Personnel } from '../../types/common';

interface ScreeningListProps {
  screenings: Personnel[];
}

export function ScreeningList({ screenings }: ScreeningListProps) {
  return (
    <div className="space-y-3 relative z-10 flex-1">
      {screenings.map((scan, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05, type: "spring" as const, stiffness: 300, damping: 24 }}
          whileHover={{ scale: 1.005, x: 2 }}
          className="flex items-center justify-between p-4 sm:p-3 bg-gradient-to-r from-white/90 to-white/70 dark:from-slate-800/90 dark:to-slate-800/70 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 hover:border-indigo-300/50 dark:hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/20 rounded-2xl transition-all group cursor-pointer relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-indigo-500/0 group-hover:from-indigo-500/5 group-hover:via-purple-500/5 group-hover:to-indigo-500/5 transition-all duration-300 pointer-events-none" />

          <div className="flex items-center gap-4 flex-1 min-w-0 relative z-10">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-100 via-purple-100 to-indigo-100 dark:from-indigo-500/20 dark:via-purple-500/20 dark:to-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/10 group-hover:scale-110 group-hover:rotate-3 transition-transform shrink-0">
              {generateAvatar(scan.name)}
            </div>
            <div className="min-w-0 pr-4">
              <p className="font-bold text-slate-900 dark:text-white truncate">{scan.name}</p>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-500"></span>
                <span className="truncate">{scan.companyName}</span>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-sm relative z-10">
            <span className="font-semibold text-slate-600 dark:text-slate-300 w-24 text-left">{scan.screeningType as string}</span>
            <Badge status={scan.status as string} />
            <span className="font-mono font-medium text-slate-400 dark:text-slate-500 w-20 text-right bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600">{scan.recordNumber}</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all">
              <Activity size={18} />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
