import React from 'react';
import { motion } from 'motion/react';
import { Edit, Trash2, User, Phone, Mail, Calendar, Building2, CheckCircle2, XCircle, Stethoscope, Copy } from 'lucide-react';
import { Staff } from '../../constants/mockData';

interface PersonnelCardProps {
  staff: Staff;
  onEdit: (staff: Staff) => void;
  onDelete: (id: string) => void;
  onCopy: (staff: Staff) => void;
  selected: boolean;
  onSelect: (id: string) => void;
  index: number;
}

const positionColors: { [key: string]: { bg: string; icon: string; darkBg: string; darkIcon: string } } = {
  'Radyoloji Teknikeri': { bg: 'bg-blue-50', icon: 'text-blue-600', darkBg: 'dark:bg-blue-500/10', darkIcon: 'text-blue-400' },
  'Odyometrist': { bg: 'bg-violet-50', icon: 'text-violet-600', darkBg: 'dark:bg-violet-500/10', darkIcon: 'text-violet-400' },
  'Hemşire': { bg: 'bg-rose-50', icon: 'text-rose-600', darkBg: 'dark:bg-rose-500/10', darkIcon: 'text-rose-400' },
  'Laboratuvar Teknikeri': { bg: 'bg-emerald-50', icon: 'text-emerald-600', darkBg: 'dark:bg-emerald-500/10', darkIcon: 'text-emerald-400' },
  'Sağlık Teknikeri': { bg: 'bg-amber-50', icon: 'text-amber-600', darkBg: 'dark:bg-amber-500/10', darkIcon: 'text-amber-400' },
  'İş Yeri Hekimi': { bg: 'bg-indigo-50', icon: 'text-indigo-600', darkBg: 'dark:bg-indigo-500/10', darkIcon: 'text-indigo-400' },
  'Müdür': { bg: 'bg-purple-50', icon: 'text-purple-600', darkBg: 'dark:bg-purple-500/10', darkIcon: 'text-purple-400' },
  'Yönetici': { bg: 'bg-slate-50', icon: 'text-slate-600', darkBg: 'dark:bg-slate-500/10', darkIcon: 'text-slate-400' },
};

const positionIcons: { [key: string]: React.ReactNode } = {
  'Radyoloji Teknikeri': null,
  'Odyometrist': null,
  'Hemşire': null,
  'Laboratuvar Teknikeri': null,
  'Sağlık Teknikeri': null,
  'İş Yeri Hekimi': <Stethoscope size={20} />,
  'Müdür': null,
  'Yönetici': null,
};

export default function PersonnelCard({ staff, onEdit, onDelete, onCopy, selected, onSelect, index }: PersonnelCardProps) {
  const colors = positionColors[staff.position] || positionColors['Yönetici'];
  const initials = `${staff.firstName.charAt(0)}${staff.lastName.charAt(0)}`;

  return (
    <motion.div
      key={staff.id}
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
              checked={selected}
              onChange={() => onSelect(staff.id)}
              aria-label={`${staff.firstName} ${staff.lastName} seç`}
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-0 focus:ring-offset-white dark:focus:ring-offset-slate-800"
            />
            <div className={`w-10 h-10 rounded-xl ${colors.bg} ${colors.darkBg} flex items-center justify-center ${colors.icon} ${colors.darkIcon} shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/10`} aria-hidden="true">
              {positionIcons[staff.position] || <User size={20} />}
            </div>
          </div>
          <div className="flex gap-1">
            <button onClick={() => onCopy(staff)} aria-label={`${staff.firstName} ${staff.lastName} kopyala`} className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800">
              <Copy size={14} />
            </button>
            <button onClick={() => onEdit(staff)} aria-label={`${staff.firstName} ${staff.lastName} düzenle`} className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800">
              <Edit size={14} />
            </button>
            <button onClick={() => onDelete(staff.id)} aria-label={`${staff.firstName} ${staff.lastName} sil`} className="p-2 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800">
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        <h3 className="font-bold text-slate-900 dark:text-white mb-1">{staff.firstName} {staff.lastName}</h3>
        <p className={`text-xs ${colors.icon} ${colors.darkIcon} font-medium mb-3`}>{staff.position}</p>
        
        <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${staff.status === 'active' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400'}`}>
            {staff.status === 'active' ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
            {staff.status === 'active' ? 'Aktif' : 'Pasif'}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
