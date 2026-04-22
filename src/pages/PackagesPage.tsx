import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Package as PackageIcon, Search, LayoutGrid, List, X } from 'lucide-react';
import { Button, ToastContainer } from '../components/ui';
import { PackageCard } from '../components/tests';
import { TestPackage, initialTests } from '../constants/mockData';
import type { ToastType } from '../components/ui/Toast';

export default function PackagesPage() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<TestPackage[]>([]);
  const [packageSearchQuery, setPackageSearchQuery] = useState('');
  const [packageSortBy, setPackageSortBy] = useState<'name' | 'price' | 'testCount'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState<TestPackage | null>(null);
  const [toasts, setToasts] = useState<Array<{ id: string; type: ToastType; message: string }>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Load packages from localStorage on mount
  useEffect(() => {
    const savedPackages = localStorage.getItem('packages');
    if (savedPackages) {
      try {
        const parsedPackages = JSON.parse(savedPackages);
        setPackages(parsedPackages);
      } catch (e) {
        console.error('Failed to parse packages from localStorage:', e);
      }
    }
  }, []);

  const showToast = (type: ToastType, message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleAddPackage = () => {
    navigate('/tests/package/new');
  };

  const handleEditPackage = (pkg: TestPackage) => {
    navigate('/tests/package/new', { state: { package: pkg } });
  };

  const handleDeletePackage = (pkg: TestPackage) => {
    setPackageToDelete(pkg);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (packageToDelete) {
      const updatedPackages = packages.filter(pkg => pkg.id !== packageToDelete.id);
      setPackages(updatedPackages);
      localStorage.setItem('packages', JSON.stringify(updatedPackages));
      showToast('success', 'Paket başarıyla silindi');
      setShowDeleteModal(false);
      setPackageToDelete(null);
    }
  };

  // Filter and sort packages
  const filteredPackages = packages
    .filter(pkg => pkg.name.toLowerCase().includes(packageSearchQuery.toLowerCase()))
    .sort((a, b) => {
      switch (packageSortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.totalPrice - b.totalPrice;
        case 'testCount':
          return a.testIds.length - b.testIds.length;
        default:
          return 0;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);
  const paginatedPackages = filteredPackages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when search or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [packageSearchQuery, packageSortBy]);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 dark:from-white dark:via-indigo-200 dark:to-purple-200 pb-1">
            Test Paketleri
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">
            Tarama ve teklif için kullanılan test paketleri
          </p>
        </div>
      </div>

      {/* Header with Search and Sort */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Paket Listesi</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Paket ara..."
              value={packageSearchQuery}
              onChange={(e) => setPackageSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-48"
            />
          </div>
          <select
            value={packageSortBy}
            onChange={(e) => setPackageSortBy(e.target.value as 'name' | 'price' | 'testCount')}
            className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="name">İsme Göre</option>
            <option value="price">Fiyata Göre</option>
            <option value="testCount">Test Sayısına Göre</option>
          </select>
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
            >
              <List size={18} />
            </button>
          </div>
          <Button variant="primary" icon={<Plus size={16} />} onClick={handleAddPackage} className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/20">
            Yeni Paket
          </Button>
        </div>
      </div>

      {filteredPackages.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <PackageIcon size={32} className="text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            {packages.length === 0 ? 'Henüz paket yok' : 'Sonuç bulunamadı'}
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            {packages.length === 0 ? 'Test paketi oluşturmak için butona tıklayın' : 'Arama kriterlerinize uygun paket bulunamadı'}
          </p>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedPackages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  tests={initialTests}
                  onEdit={handleEditPackage}
                  onDelete={() => handleDeletePackage(pkg)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-white/90 to-white/70 dark:from-slate-800/90 dark:to-slate-800/70 backdrop-blur-xl rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.3)] border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Paket Adı</th>
                      <th className="text-left p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Test Sayısı</th>
                      <th className="text-right p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fiyat</th>
                      <th className="text-center p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPackages.map((pkg) => (
                      <tr key={pkg.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                              <PackageIcon size={20} className="text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                              <span className="font-semibold text-slate-900 dark:text-white">{pkg.name}</span>
                              {pkg.discountPercentage > 0 && (
                                <span className="ml-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">%{pkg.discountPercentage} indirim</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-600 dark:text-slate-400">{pkg.testIds.length} test</td>
                        <td className="p-4 text-right">
                          <div className="flex flex-col items-end">
                            <span className="font-bold text-slate-900 dark:text-white">{pkg.totalPrice} ₺</span>
                            {pkg.discountPercentage > 0 && (
                              <span className="text-sm text-slate-500 dark:text-slate-400 line-through">{pkg.originalPrice} ₺</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditPackage(pkg)}
                              className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeletePackage(pkg)}
                              className="p-2 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Toplam {filteredPackages.length} paket
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Önceki
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-indigo-600 text-white'
                          : 'border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-600'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Sonraki
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && packageToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-500/10 flex items-center justify-center">
                <Trash2 size={24} className="text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Paketi Sil</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Bu işlem geri alınamaz</p>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              <span className="font-semibold text-slate-900 dark:text-white">{packageToDelete.name}</span> paketini silmek istediğinizden emin misiniz?
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  setShowDeleteModal(false);
                  setPackageToDelete(null);
                }}
              >
                İptal
              </Button>
              <Button
                variant="primary"
                className="flex-1 bg-rose-500 hover:bg-rose-600"
                onClick={handleDeleteConfirm}
              >
                Sil
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
