import React from 'react';
import { X, Package } from 'lucide-react';
import { Button, Input } from '../ui';
import { Beaker } from 'lucide-react';
import { TestPackage } from '../../constants/mockData';

interface PackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: {
    name: string;
    selectedTestIds: Set<string>;
    testPrices: { [testId: string]: number };
    discountPercentage: number;
  };
  onFormDataChange: (data: any) => void;
  tests: Array<{ id: string; name: string; category: string; price: number; unit: string }>;
  categoryColors: { [key: string]: { bg: string; icon: string; darkBg: string; darkIcon: string } };
  categoryIcons: { [key: string]: React.ReactNode };
  onTestSelection: (testId: string) => void;
  onPriceChange: (testId: string, price: string) => void;
  onRemoveTest: (testId: string) => void;
  isEditing: boolean;
}

export default function PackageModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onFormDataChange,
  tests,
  categoryColors,
  categoryIcons,
  onTestSelection,
  onPriceChange,
  onRemoveTest,
  isEditing,
}: PackageModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800/95 rounded-2xl shadow-2xl dark:shadow-black/50 p-6 w-full max-w-5xl relative max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Package size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {isEditing ? 'Paket Düzenle' : 'Yeni Paket Oluştur'}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {isEditing ? 'Paket bilgilerini güncelleyin' : 'Testleri seçerek paket oluşturun'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(e as any); }} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Paket Adı</label>
            <Input
              placeholder="Örn: Temel Sağlık Paketi"
              value={formData.name}
              onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
              required
              className="text-base h-10"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">İndirim (%)</label>
            <Input
              type="number"
              placeholder="0"
              value={formData.discountPercentage}
              onChange={(e) => onFormDataChange({ ...formData, discountPercentage: parseFloat(e.target.value) || 0 })}
              min="0"
              max="100"
              step="1"
              className="text-base h-10"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Test Seçimi</label>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sol: Mevcut Testler */}
              <div className="border border-slate-200 dark:border-slate-600 rounded-xl p-4 bg-slate-50 dark:bg-slate-700/30">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Mevcut Testler</h3>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
                  {tests.map((test) => (
                    <label key={test.id} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                      formData.selectedTestIds.has(test.id)
                        ? 'bg-indigo-50 dark:bg-indigo-500/10 border-2 border-indigo-500 dark:border-indigo-400 shadow-md'
                        : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-sm'
                    }`}>
                      <input
                        type="checkbox"
                        checked={formData.selectedTestIds.has(test.id)}
                        onChange={() => onTestSelection(test.id)}
                        className="w-4 h-4 rounded border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-0"
                      />
                      <div className={`flex items-center gap-3 flex-1 ${formData.selectedTestIds.has(test.id) ? 'opacity-100' : 'opacity-80'}`}>
                        <div className={`w-8 h-8 rounded-lg ${categoryColors[test.category]?.bg} ${categoryColors[test.category]?.darkBg} flex items-center justify-center ${categoryColors[test.category]?.icon} ${categoryColors[test.category]?.darkIcon}`}>
                          {categoryIcons[test.category] || <Beaker size={16} />}
                        </div>
                        <div className="flex-1">
                          <span className="font-semibold text-slate-900 dark:text-white text-sm">{test.name}</span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-slate-500 dark:text-slate-400">{test.category}</span>
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{test.price} ₺</span>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sağ: Seçilen Testler */}
              <div className="border border-slate-200 dark:border-slate-600 rounded-xl p-4 bg-slate-50 dark:bg-slate-700/30">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Seçilen Testler</h3>
                {formData.selectedTestIds.size === 0 ? (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <Beaker size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Henüz test seçilmedi</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
                    {Array.from(formData.selectedTestIds).map((testId) => {
                      const test = tests.find(t => t.id === testId);
                      const customPrice = formData.testPrices[testId] || test?.price || 0;
                      return test ? (
                        <div key={testId} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg ${categoryColors[test.category]?.bg} ${categoryColors[test.category]?.darkBg} flex items-center justify-center ${categoryColors[test.category]?.icon} ${categoryColors[test.category]?.darkIcon}`}>
                              {categoryIcons[test.category] || <Beaker size={16} />}
                            </div>
                          </div>
                          <div className="flex-1">
                            <span className="font-semibold text-slate-900 dark:text-white text-sm">{test.name}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-slate-500 dark:text-slate-400">{test.category}</span>
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  value={customPrice}
                                  onChange={(e) => onPriceChange(testId, e.target.value)}
                                  className="w-20 px-2 py-1 text-xs border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                                />
                                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">₺</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => onRemoveTest(testId)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
                <div className="border-t border-slate-200 dark:border-slate-600 pt-4 mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Toplam Fiyat</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                      {Array.from(formData.selectedTestIds)
                        .reduce((sum, testId) => {
                          const customPrice = formData.testPrices[testId] || 0;
                          return sum + customPrice;
                        }, 0)} ₺
                    </span>
                  </div>
                  {formData.discountPercentage > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-slate-500 dark:text-slate-400 line-through">
                        {Array.from(formData.selectedTestIds)
                          .reduce((sum, testId) => {
                            const customPrice = formData.testPrices[testId];
                            return sum + (customPrice || 0);
                          }, 0)} ₺
                      </span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        %{formData.discountPercentage} indirim
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between bg-indigo-50 dark:bg-indigo-500/10 p-3 rounded-lg">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">İndirimli Fiyat</span>
                    <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                      {(Array.from(formData.selectedTestIds).reduce((sum, testId) => {
                        const customPrice = formData.testPrices[testId] || 0;
                        return sum + customPrice;
                      }, 0) * (1 - formData.discountPercentage / 100)).toFixed(2)} ₺
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Button variant="primary" className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/20 h-12 text-base font-semibold">
            {isEditing ? 'Paketi Güncelle' : 'Paket Oluştur'}
          </Button>
        </form>
      </div>
    </div>
  );
}
