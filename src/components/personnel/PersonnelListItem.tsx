import React from 'react';
import { Edit, Trash2, User, Stethoscope, CheckCircle2, XCircle, Copy } from 'lucide-react';
import { Staff } from '../../constants/mockData';

interface PersonnelListItemProps {
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
  'İş Yeri Hekimi': <Stethoscope size={16} />,
  'Müdür': null,
  'Yönetici': null,
};

export default function PersonnelListItem({ staff, onEdit, onDelete, onCopy, selected, onSelect, index }: PersonnelListItemProps) {
  const colors = positionColors[staff.position] || positionColors['Yönetici'];

  return (
    <tr
      key={staff.id}
      className="border-b border-slate-200 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
    >
      <td className="p-4">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(staff.id)}
          className="w-4 h-4 rounded border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-0"
        />
      </td>
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg ${colors.bg} ${colors.darkBg} flex items-center justify-center ${colors.icon} ${colors.darkIcon} shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/10`} aria-hidden="true">
            {positionIcons[staff.position] || <User size={16} />}
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">
              {staff.firstName} {staff.lastName}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{staff.id}</p>
          </div>
        </div>
      </td>
      <td className="p-4">
        <span className={`px-2.5 py-1 rounded-lg ${colors.bg} ${colors.darkBg} border border-slate-200 dark:border-slate-600 ${colors.icon} ${colors.darkIcon} text-xs font-bold`}>
          {staff.position}
        </span>
      </td>
      <td className="p-4">
        <span className="text-slate-600 dark:text-slate-400">{staff.phone}</span>
      </td>
      <td className="p-4">
        <span className="text-slate-600 dark:text-slate-400 truncate max-w-[200px] block">{staff.email}</span>
      </td>
      <td className="p-4">
        <span className="text-slate-600 dark:text-slate-400">{new Date(staff.startDate).toLocaleDateString('tr-TR')}</span>
      </td>
      <td className="p-4">
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${staff.status === 'active' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400'}`}>
          {staff.status === 'active' ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
          {staff.status === 'active' ? 'Aktif' : 'Pasif'}
        </div>
      </td>
      <td className="p-4">
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => onCopy(staff)} className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors">
            <Copy size={14} />
          </button>
          <button onClick={() => onEdit(staff)} className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors">
            <Edit size={14} />
          </button>
          <button onClick={() => onDelete(staff.id)} className="p-2 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}
