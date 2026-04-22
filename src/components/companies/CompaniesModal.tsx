import React, { useEffect } from 'react';
import { X, CheckCircle2, XCircle } from 'lucide-react';
import { Input } from '../ui';
import { Button } from '../ui';
import { companySectors } from '../../constants/mockData';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { companySchema, type CompanyFormData } from '../../lib/validation';

interface CompaniesModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: CompanyFormData) => void;
  defaultValues?: Partial<CompanyFormData>;
  isEditing: boolean;
}

export default function CompaniesModal({
  show,
  onClose,
  onSubmit,
  defaultValues,
  isEditing,
}: CompaniesModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: defaultValues || {
      name: '',
      taxNumber: '',
      taxOffice: '',
      authorizedPerson: '',
      authorizedPersonPhone: '',
      authorizedPersonEmail: '',
      employeeCount: 0,
      address: '',
      sector: 'Teknoloji',
      status: 'active',
    },
  });

  useEffect(() => {
    if (show && defaultValues) {
      reset(defaultValues);
    }
  }, [show, defaultValues, reset]);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleSubmit(onSubmit)();
      }
    };

    if (show) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [show, onClose, handleSubmit, onSubmit]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] p-4"
      onClick={onClose}
    >
      <div
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
          
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Firma Adı</label>
              <Input
                placeholder="Firma adını giriniz"
                {...register('name')}
              />
              {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Vergi Numarası</label>
              <Input
                placeholder="XXXXXXXXXX"
                {...register('taxNumber')}
                maxLength={10}
              />
              {errors.taxNumber && <p className="text-xs text-rose-500 mt-1">{errors.taxNumber.message}</p>}
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">10 haneli vergi numarası</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Vergi Dairesi</label>
              <Input
                placeholder="Vergi dairesini giriniz"
                {...register('taxOffice')}
              />
              {errors.taxOffice && <p className="text-xs text-rose-500 mt-1">{errors.taxOffice.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Yetkili Kişi</label>
              <Input
                placeholder="Yetkili kişinin adını giriniz"
                {...register('authorizedPerson')}
              />
              {errors.authorizedPerson && <p className="text-xs text-rose-500 mt-1">{errors.authorizedPerson.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Yetkili Telefon</label>
              <Input
                type="tel"
                placeholder="05XX XXX XX XX"
                {...register('authorizedPersonPhone')}
                maxLength={13}
              />
              {errors.authorizedPersonPhone && <p className="text-xs text-rose-500 mt-1">{errors.authorizedPersonPhone.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Yetkili E-posta</label>
              <Input
                type="email"
                placeholder="email@example.com"
                {...register('authorizedPersonEmail')}
              />
              {errors.authorizedPersonEmail && <p className="text-xs text-rose-500 mt-1">{errors.authorizedPersonEmail.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Çalışan Sayısı</label>
              <Input
                type="number"
                placeholder="Çalışan sayısını giriniz"
                {...register('employeeCount', { valueAsNumber: true })}
                min="1"
              />
              {errors.employeeCount && <p className="text-xs text-rose-500 mt-1">{errors.employeeCount.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Sektör</label>
              <select
                {...register('sector')}
                className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {errors.sector && <p className="text-xs text-rose-500 mt-1">{errors.sector.message}</p>}
                {companySectors.filter(s => s !== 'Tümü').map(sector => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Adres</label>
              <Input
                placeholder="Firma adresini giriniz"
                {...register('address')}
              />
              {errors.address && <p className="text-xs text-rose-500 mt-1">{errors.address.message}</p>}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Durum</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => reset({ ...defaultValues, status: 'active' })}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-semibold text-sm transition-all ${
                    defaultValues?.status === 'active'
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  <CheckCircle2 size={14} />
                  Aktif
                </button>
                <button
                  type="button"
                  onClick={() => reset({ ...defaultValues, status: 'inactive' })}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-semibold text-sm transition-all ${
                    defaultValues?.status === 'inactive'
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
      </div>
    </div>
  );
}
