import React from 'react';
import { X } from 'lucide-react';
import { Button, Input } from '../ui';

interface TestModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: { name: string; category: string; price: string };
  onFormDataChange: (data: { name: string; category: string; price: string }) => void;
  categories: string[];
  isEditing: boolean;
}

export default function TestModal({
  show,
  onClose,
  onSubmit,
  formData,
  onFormDataChange,
  categories,
  isEditing,
}: TestModalProps) {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800/95 rounded-2xl shadow-2xl dark:shadow-black/50 p-6 w-full max-w-md relative border border-slate-200 dark:border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          {isEditing ? 'Test Düzenle' : 'Yeni Test Ekle'}
        </h2>
        
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(e as any); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Test Adı</label>
            <Input
              placeholder="Örn: Tam Kan Sayımı"
              value={formData.name}
              onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Kategori</label>
            <select
              value={formData.category}
              onChange={(e) => onFormDataChange({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              {categories.filter(cat => cat !== 'Tümü').map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Fiyat</label>
            <Input
              type="number"
              placeholder="150"
              value={formData.price}
              onChange={(e) => onFormDataChange({ ...formData, price: e.target.value })}
              required
              min="0"
              step="0.01"
            />
          </div>
          
          <Button variant="primary" className="w-full">
            {isEditing ? 'Testi Güncelle' : 'Test Ekle'}
          </Button>
        </form>
      </div>
    </div>
  );
}
