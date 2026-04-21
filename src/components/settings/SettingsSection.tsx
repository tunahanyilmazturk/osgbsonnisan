import React from 'react';
import { motion } from 'motion/react';
import { itemVariants } from '../../lib/animations';

interface SettingsSectionProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
}

export function SettingsSection({ title, description, icon, children, delay = 0 }: SettingsSectionProps) {
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="show"
      transition={{ delay }}
      className="bg-gradient-to-br from-white/95 to-white/90 dark:from-slate-800/95 dark:to-slate-800/90 backdrop-blur-xl rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)] border border-slate-200/60 dark:border-slate-700/60 p-6 lg:p-8 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-[40px] -z-10 pointer-events-none" />
      
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
          {description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        {children}
      </div>
    </motion.div>
  );
}
