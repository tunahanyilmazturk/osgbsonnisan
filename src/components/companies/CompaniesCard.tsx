import React from 'react';
import { Edit, Trash2, Copy, Building2, Phone, Mail, Users, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { Company } from '../../constants/mockData';

interface CompaniesCardProps {
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

const sectorIcons: { [key: string]: React.ReactNode } = {
  'Teknoloji': <Building2 size={20} />,
  'Sağlık': null,
  'İnşaat': null,
  'Eğitim': null,
  'Gıda': null,
  'Üretim': null,
  'Hizmet': null,
  'Perakende': null,
  'Tümü': null,
};

export default function CompaniesCard({ company, onEdit, onDelete, onCopy, selected, onSelect, index }: CompaniesCardProps) {
  const colors = sectorColors[company.sector] || sectorColors['Tümü'];
  const initials = company.name.split(' ').map(word => word.charAt(0)).join('').slice(0, 2).toUpperCase();

  return (
    <div
      key={company.id}
      className="bg-gradient-to-br from-white/95 to-white/90 dark:from-slate-800/95 dark:to-slate-800/90 backdrop-blur-xl rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)] border border-slate-200/60 dark:border-slate-700/60 p-5 hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/20 transition-all group relative overflow-hidden"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onSelect(company.id)}
            aria-label={`${company.name} seç`}
            className="w-4 h-4 rounded border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-0 focus:ring-offset-white dark:focus:ring-offset-slate-800"
          />
          <div className={`w-10 h-10 rounded-xl ${colors.bg} ${colors.darkBg} flex items-center justify-center ${colors.icon} ${colors.darkIcon} shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/10`} aria-hidden="true">
            {sectorIcons[company.sector] || <Building2 size={20} />}
          </div>
        </div>
        <div className="flex gap-1">
          <button onClick={() => onCopy(company)} aria-label={`${company.name} kopyala`} className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800">
            <Copy size={14} />
          </button>
          <button onClick={() => onEdit(company)} aria-label={`${company.name} düzenle`} className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800">
            <Edit size={14} />
          </button>
          <button onClick={() => onDelete(company.id)} aria-label={`${company.name} sil`} className="p-2 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <h3 className="font-bold text-slate-900 dark:text-white mb-1">{company.name}</h3>
      <p className={`text-xs ${colors.icon} ${colors.darkIcon} font-medium mb-3`}>{company.sector}</p>
      
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
          <Users size={12} />
          <span>{company.employeeCount} çalışan</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
          <Phone size={12} />
          <span>{company.authorizedPersonPhone}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
          <Mail size={12} />
          <span className="truncate">{company.authorizedPersonEmail}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${company.status === 'active' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400'}`}>
          {company.status === 'active' ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
          {company.status === 'active' ? 'Aktif' : 'Pasif'}
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
          <Calendar size={10} />
          <span>{new Date(company.createdAt).toLocaleDateString('tr-TR')}</span>
        </div>
      </div>
    </div>
  );
}
