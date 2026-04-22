import React from 'react';
import { 
  Plus, FileText, Users, Calendar, AlertCircle, 
  Settings, Download, Upload, Search, Filter
} from 'lucide-react';

export interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  color: string;
  bgColor: string;
  borderColor: string;
}

interface QuickActionsProps {
  actions?: QuickAction[];
}

const defaultActions: QuickAction[] = [
  {
    id: 'new-screening',
    label: 'Yeni Tarama',
    icon: <Plus size={16} />,
    onClick: () => console.log('Yeni tarama'),
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-50 dark:bg-indigo-500/10',
    borderColor: 'border-indigo-200 dark:border-indigo-500/30'
  },
  {
    id: 'new-report',
    label: 'Rapor Oluştur',
    icon: <FileText size={16} />,
    onClick: () => console.log('Rapor oluştur'),
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-500/10',
    borderColor: 'border-emerald-200 dark:border-emerald-500/30'
  },
  {
    id: 'add-personnel',
    label: 'Personel Ekle',
    icon: <Users size={16} />,
    onClick: () => console.log('Personel ekle'),
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-500/10',
    borderColor: 'border-purple-200 dark:border-purple-500/30'
  },
  {
    id: 'schedule',
    label: 'Planlama',
    icon: <Calendar size={16} />,
    onClick: () => console.log('Planlama'),
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-500/10',
    borderColor: 'border-amber-200 dark:border-amber-500/30'
  },
  {
    id: 'alerts',
    label: 'Uyarılar',
    icon: <AlertCircle size={16} />,
    onClick: () => console.log('Uyarılar'),
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-50 dark:bg-rose-500/10',
    borderColor: 'border-rose-200 dark:border-rose-500/30'
  },
  {
    id: 'settings',
    label: 'Ayarlar',
    icon: <Settings size={16} />,
    onClick: () => console.log('Ayarlar'),
    color: 'text-slate-600 dark:text-slate-400',
    bgColor: 'bg-slate-50 dark:bg-slate-500/10',
    borderColor: 'border-slate-200 dark:border-slate-500/30'
  },
  {
    id: 'export',
    label: 'Dışa Aktar',
    icon: <Download size={16} />,
    onClick: () => console.log('Dışa aktar'),
    color: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-50 dark:bg-cyan-500/10',
    borderColor: 'border-cyan-200 dark:border-cyan-500/30'
  },
  {
    id: 'import',
    label: 'İçe Aktar',
    icon: <Upload size={16} />,
    onClick: () => console.log('İçe aktar'),
    color: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-50 dark:bg-teal-500/10',
    borderColor: 'border-teal-200 dark:border-teal-500/30'
  }
];

export default function QuickActions({ actions = defaultActions }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action, index) => (
        <button
          key={action.id}
          onClick={action.onClick}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${action.bgColor} ${action.borderColor} border ${action.color} font-semibold text-sm transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5`}
        >
          {action.icon}
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
}
