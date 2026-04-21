import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Phone, Mail, Building2, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { Input } from '../ui';
import { staffPositions } from '../../constants/mockData';
import { Button } from '../ui';

interface PersonnelModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    position: string;
    startDate: string;
    status: 'active' | 'inactive';
  };
  onFormDataChange: (data: any) => void;
  isEditing: boolean;
}

export default function PersonnelModal({
  show,
  onClose,
  onSubmit,
  formData,
  onFormDataChange,
  isEditing,
}: PersonnelModalProps) {
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
            className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
          
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {isEditing ? 'Personeli Düzenle' : 'Yeni Personel Ekle'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            {isEditing ? 'Personel bilgilerini güncelleyin' : 'Sisteme yeni personel ekleyin'}
          </p>
          
          <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Ad</label>
              <Input
                placeholder="Adınızı giriniz"
                value={formData.firstName}
                onChange={(e) => onFormDataChange({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Soyad</label>
              <Input
                placeholder="Soyadınızı giriniz"
                value={formData.lastName}
                onChange={(e) => onFormDataChange({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Telefon</label>
              <Input
                type="tel"
                placeholder="05XX XXX XX XX"
                value={formData.phone}
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
                  onFormDataChange({ ...formData, phone: value });
                }}
                maxLength={13}
                required
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">11 haneli Türkiye telefon numarası</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">E-posta</label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => onFormDataChange({ ...formData, email: e.target.value })}
                required
                pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                title="Geçerli bir e-posta adresi giriniz (örn: email@example.com)"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Pozisyon</label>
              <select
                value={formData.position}
                onChange={(e) => onFormDataChange({ ...formData, position: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                {staffPositions.filter(p => p !== 'Tümü').map(position => (
                  <option key={position} value={position}>{position}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Başlangıç Tarihi</label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => onFormDataChange({ ...formData, startDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Geçmiş tarih seçilemez</p>
            </div>

            <div>
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
