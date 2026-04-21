import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, XCircle } from 'lucide-react';
import { Input } from '../ui';
import { Button } from '../ui';
import { companySectors } from '../../constants/mockData';

interface CompaniesModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: {
    name: string;
    taxNumber: string;
    taxOffice: string;
    authorizedPerson: string;
    authorizedPersonPhone: string;
    authorizedPersonEmail: string;
    employeeCount: number;
    address: string;
    sector: string;
    status: 'active' | 'inactive';
  };
  onFormDataChange: (data: any) => void;
  isEditing: boolean;
}

export default function CompaniesModal({
  show,
  onClose,
  onSubmit,
  formData,
  onFormDataChange,
  isEditing,
}: CompaniesModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        onSubmit(e as any);
      }
    };

    if (show) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [show, onClose, onSubmit]);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white dark:bg-slate-800/95 rounded-2xl shadow-2xl dark:shadow-black/50 p-6 w-full max-w-4xl relative border border-slate-200 dark:border-slate-700"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
            aria-label="Kapat"
          >
            <X size={20} />
          </button>
          
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {isEditing ? 'Firmayı Düzenle' : 'Yeni Firma Ekle'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            {isEditing ? 'Firma bilgilerini güncelleyin' : 'Sisteme yeni firma ekleyin'}
          </p>
          
          <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Firma Adı</label>
              <Input
                placeholder="Firma adını giriniz"
                value={formData.name}
                onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Vergi Numarası</label>
              <Input
                placeholder="XXXXXXXXXX"
                value={formData.taxNumber}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '');
                  if (value.length > 10) {
                    value = value.slice(0, 10);
                  }
                  onFormDataChange({ ...formData, taxNumber: value });
                }}
                maxLength={10}
                required
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">10 haneli vergi numarası</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Vergi Dairesi</label>
              <Input
                placeholder="Vergi dairesini giriniz"
                value={formData.taxOffice}
                onChange={(e) => onFormDataChange({ ...formData, taxOffice: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Yetkili Kişi</label>
              <Input
                placeholder="Yetkili kişinin adını giriniz"
                value={formData.authorizedPerson}
                onChange={(e) => onFormDataChange({ ...formData, authorizedPerson: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Yetkili Telefon</label>
              <Input
                type="tel"
                placeholder="05XX XXX XX XX"
                value={formData.authorizedPersonPhone}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '');
                  if (!value.startsWith('05')) {
                    value = '05' + value;
                  }
                  if (value.length > 11) {
                    value = value.slice(0, 11);
                  }
                  if (value.length >= 6) {
                    value = value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6);
                  } else if (value.length >= 3) {
                    value = value.slice(0, 3) + ' ' + value.slice(3);
                  }
                  onFormDataChange({ ...formData, authorizedPersonPhone: value });
                }}
                maxLength={13}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Yetkili E-posta</label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={formData.authorizedPersonEmail}
                onChange={(e) => onFormDataChange({ ...formData, authorizedPersonEmail: e.target.value })}
                required
                pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                title="Geçerli bir e-posta adresi giriniz (örn: email@example.com)"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Çalışan Sayısı</label>
              <Input
                type="number"
                placeholder="Çalışan sayısını giriniz"
                value={formData.employeeCount}
                onChange={(e) => onFormDataChange({ ...formData, employeeCount: Number(e.target.value) })}
                required
                min="1"
                title="Çalışan sayısı en az 1 olmalıdır"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Sektör</label>
              <select
                value={formData.sector}
                onChange={(e) => onFormDataChange({ ...formData, sector: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                {companySectors.filter(s => s !== 'Tümü').map(sector => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Adres</label>
              <Input
                placeholder="Firma adresini giriniz"
                value={formData.address}
                onChange={(e) => onFormDataChange({ ...formData, address: e.target.value })}
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Durum</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onFormDataChange({ ...formData, status: 'active' })}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-semibold text-sm transition-all ${
                    formData.status === 'active'
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  <CheckCircle2 size={14} />
                  Aktif
                </button>
                <button
                  type="button"
                  onClick={() => onFormDataChange({ ...formData, status: 'inactive' })}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-semibold text-sm transition-all ${
                    formData.status === 'inactive'
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  <XCircle size={14} />
                  Pasif
                </button>
              </div>
            </div>

            <div className="col-span-2">
              <Button variant="primary" className="w-full">
                {isEditing ? 'Güncelle' : 'Ekle'}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
