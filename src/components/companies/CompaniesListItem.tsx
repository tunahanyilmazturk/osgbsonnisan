import React from 'react';
import { motion } from 'motion/react';
import { Edit, Trash2, Copy, Building2, Users, Phone, Mail, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { Company } from '../../constants/mockData';

interface CompaniesListItemProps {
  company: Company;
  onEdit: (company: Company) => void;
  onDelete: (id: string) => void;
  onCopy: (company: Company) => void;
  selected: boolean;
  onSelect: (id: string) => void;
  index: number;
}

const sectorColors: { [key: string]: { bg: string; icon: string; darkBg: string; darkIcon: string } } = {
  'Teknoloji': { bg: 'bg-blue-50', icon: 'text-blue-600', darkBg: 'dark:bg-blue-500/10', darkIcon: 'text-blue-400' },
  'Sağlık': { bg: 'bg-rose-50', icon: 'text-rose-600', darkBg: 'dark:bg-rose-500/10', darkIcon: 'text-rose-400' },
  'İnşaat': { bg: 'bg-amber-50', icon: 'text-amber-600', darkBg: 'dark:bg-amber-500/10', darkIcon: 'text-amber-400' },
  'Eğitim': { bg: 'bg-violet-50', icon: 'text-violet-600', darkBg: 'dark:bg-violet-500/10', darkIcon: 'text-violet-400' },
  'Gıda': { bg: 'bg-emerald-50', icon: 'text-emerald-600', darkBg: 'dark:bg-emerald-500/10', darkIcon: 'text-emerald-400' },
  'Üretim': { bg: 'bg-orange-50', icon: 'text-orange-600', darkBg: 'dark:bg-orange-500/10', darkIcon: 'text-orange-400' },
  'Hizmet': { bg: 'bg-cyan-50', icon: 'text-cyan-600', darkBg: 'dark:bg-cyan-500/10', darkIcon: 'text-cyan-400' },
  'Perakende': { bg: 'bg-pink-50', icon: 'text-pink-600', darkBg: 'dark:bg-pink-500/10', darkIcon: 'text-pink-400' },
  'Tümü': { bg: 'bg-slate-50', icon: 'text-slate-600', darkBg: 'dark:bg-slate-500/10', darkIcon: 'text-slate-400' },
};

export default function CompaniesListItem({ company, onEdit, onDelete, onCopy, selected, onSelect, index }: CompaniesListItemProps) {
  const colors = sectorColors[company.sector] || sectorColors['Tümü'];

  return (
    <motion.tr
      key={company.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-slate-200 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
    >
      <td className="p-4">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(company.id)}
          aria-label={`${company.name} seç`}
          className="w-4 h-4 rounded border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-0"
        />
      </td>
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${colors.bg} ${colors.darkBg} flex items-center justify-center ${colors.icon} ${colors.darkIcon} shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/10`} aria-hidden="true">
            <Building2 size={16} />
          </div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">{company.name}</div>
            <div className={`text-xs ${colors.icon} ${colors.darkIcon} font-medium`}>{company.sector}</div>
          </div>
        </div>
      </td>
      <td className="p-4">
        <span className="text-slate-600 dark:text-slate-400">{company.authorizedPerson}</span>
      </td>
      <td className="p-4">
        <span className="text-slate-600 dark:text-slate-400">{company.taxNumber}</span>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
          <Users size={14} />
          <span>{company.employeeCount}</span>
        </div>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
          <Phone size={14} />
          <span className="truncate max-w-[150px] block">{company.authorizedPersonPhone}</span>
        </div>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
          <Mail size={14} />
          <span className="truncate max-w-[150px] block">{company.authorizedPersonEmail}</span>
        </div>
      </td>
      <td className="p-4">
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${company.status === 'active' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400'}`}>
          {company.status === 'active' ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
          {company.status === 'active' ? 'Aktif' : 'Pasif'}
        </div>
      </td>
      <td className="p-4">
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => onCopy(company)} className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors">
            <Copy size={14} />
          </button>
          <button onClick={() => onEdit(company)} className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors">
            <Edit size={14} />
          </button>
          <button onClick={() => onDelete(company.id)} className="p-2 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}
