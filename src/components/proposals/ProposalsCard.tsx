import React, { useState } from 'react';
import { Edit, Trash2, Copy, Building2, CheckCircle, XCircle, Clock, ChevronDown } from 'lucide-react';

interface ProposalsCardProps {
  proposal: {
    id: string;
    company: string;
    package: string;
    status: string;
    date: string;
    totalPrice: number;
  };
  statusColors: { [key: string]: { bg: string; icon: string; darkBg: string; darkIcon: string } };
  statusIcons: { [key: string]: React.ReactNode };
  selectedProposals: Set<string>;
  onEdit: (proposal: any) => void;
  onDelete: (id: string) => void;
  onCopy: (proposal: any) => void;
  onSelect: (id: string) => void;
  onStatusChange: (proposal: any, newStatus: 'pending' | 'approved' | 'rejected') => void;
  index: number;
}

export default function ProposalsCard({
  proposal,
  statusColors,
  statusIcons,
  selectedProposals,
  onEdit,
  onDelete,
  onCopy,
  onSelect,
  onStatusChange,
  index,
}: ProposalsCardProps) {
  const statusConfig = {
    pending: { label: 'Beklemede', icon: Clock },
    approved: { label: 'Onaylandı', icon: CheckCircle },
    rejected: { label: 'Reddedildi', icon: XCircle },
  };
  const config = statusConfig[proposal.status as keyof typeof statusConfig] || statusConfig.pending;
  const StatusIcon = config.icon;
  const [showDropdown, setShowDropdown] = useState(false);

  const statusDesign = {
    pending: {
      bg: 'bg-amber-50',
      darkBg: 'dark:bg-amber-500/10',
      text: 'text-amber-700',
      darkText: 'dark:text-amber-400',
      border: 'border-amber-200/50',
      darkBorder: 'dark:border-amber-500/20',
      shadow: 'shadow-[0_0_10px_rgba(245,158,11,0.05)]',
      darkShadow: 'dark:shadow-[0_0_10px_rgba(245,158,11,0.1)]',
    },
    approved: {
      bg: 'bg-emerald-50',
      darkBg: 'dark:bg-emerald-500/10',
      text: 'text-emerald-700',
      darkText: 'dark:text-emerald-400',
      border: 'border-emerald-200/50',
      darkBorder: 'dark:border-emerald-500/20',
      shadow: 'shadow-[0_0_10px_rgba(16,185,129,0.05)]',
      darkShadow: 'dark:shadow-[0_0_10px_rgba(16,185,129,0.1)]',
    },
    rejected: {
      bg: 'bg-rose-50',
      darkBg: 'dark:bg-rose-500/10',
      text: 'text-rose-700',
      darkText: 'dark:text-rose-400',
      border: 'border-rose-200/50',
      darkBorder: 'dark:border-rose-500/20',
      shadow: 'shadow-[0_0_10px_rgba(244,63,94,0.05)]',
      darkShadow: 'dark:shadow-[0_0_10px_rgba(244,63,94,0.1)]',
    },
  }[proposal.status as 'pending' | 'approved' | 'rejected'];

  const defaultDesign = {
    bg: 'bg-amber-50',
    darkBg: 'dark:bg-amber-500/10',
    text: 'text-amber-700',
    darkText: 'dark:text-amber-400',
    border: 'border-amber-200/50',
    darkBorder: 'dark:border-amber-500/20',
    shadow: 'shadow-[0_0_10px_rgba(245,158,11,0.05)]',
    darkShadow: 'dark:shadow-[0_0_10px_rgba(245,158,11,0.1)]',
  };

  const design = statusDesign || defaultDesign;

  const handleStatusClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleStatusSelect = (newStatus: 'pending' | 'approved' | 'rejected') => {
    onStatusChange(proposal, newStatus);
    setShowDropdown(false);
  };

  return (
    <div
      key={proposal.id}
      className="bg-gradient-to-br from-white/95 to-white/90 dark:from-slate-800/95 dark:to-slate-800/90 backdrop-blur-xl rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)] border border-slate-200/60 dark:border-slate-700/60 p-5 hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/20 transition-all group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-indigo-500/0 group-hover:from-indigo-500/5 group-hover:via-purple-500/5 group-hover:to-indigo-500/5 dark:group-hover:from-indigo-500/10 dark:group-hover:via-purple-500/10 dark:group-hover:to-indigo-500/10 transition-all duration-300 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedProposals.has(proposal.id)}
              onChange={() => onSelect(proposal.id)}
              aria-label={`${proposal.company} seç`}
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-0 focus:ring-offset-white dark:focus:ring-offset-slate-800"
            />
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/10" aria-hidden="true">
              <Building2 size={20} />
            </div>
          </div>
          <div className="flex gap-1">
            <button onClick={() => onCopy(proposal)} aria-label={`${proposal.company} kopyala`} className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800">
              <Copy size={14} />
            </button>
            <button onClick={() => onEdit(proposal)} aria-label={`${proposal.company} düzenle`} className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800">
              <Edit size={14} />
            </button>
            <button onClick={() => onDelete(proposal.id)} aria-label={`${proposal.company} sil`} className="p-2 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800">
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        <h3 className="font-bold text-slate-900 dark:text-white mb-1">{proposal.company}</h3>
        {(proposal as any).proposalTitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{(proposal as any).proposalTitle}</p>
        )}
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{(proposal as any).selectedTests?.length || 0} test</p>
        
        <div className="flex items-center gap-2 mb-3 relative">
          <button
            onClick={handleStatusClick}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer hover:opacity-80 transition-opacity ${design.bg} ${design.darkBg} ${design.text} ${design.darkText} ${design.border} ${design.darkBorder} ${design.shadow} ${design.darkShadow}`}
          >
            <StatusIcon size={10} className={design.text} />
            {config.label}
            <ChevronDown size={10} />
          </button>
          {showDropdown && (
            <div className="absolute left-0 mt-2 w-32 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-10">
              {Object.entries(statusConfig).map(([key, value]) => {
                const dropdownColorClass = {
                  pending: 'text-amber-600 dark:text-amber-400',
                  approved: 'text-emerald-600 dark:text-emerald-400',
                  rejected: 'text-rose-600 dark:text-rose-400'
                }[key];
                return (
                  <button
                    key={key}
                    onClick={() => handleStatusSelect(key as 'pending' | 'approved' | 'rejected')}
                    className="w-full px-3 py-2 text-left text-xs hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors"
                  >
                    <value.icon size={12} className={dropdownColorClass} />
                    {value.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
          <span className="text-lg font-bold text-slate-900 dark:text-white">{(proposal.totalPrice || 0).toLocaleString()} ₺</span>
          <span className="text-xs text-slate-400 dark:text-slate-500">{proposal.date ? new Date(proposal.date).toLocaleDateString('tr-TR') : '-'}</span>
        </div>
      </div>
    </div>
  );
}
