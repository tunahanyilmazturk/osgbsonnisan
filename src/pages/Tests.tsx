import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Beaker, Activity, Eye, Stethoscope, Heart, Syringe, X, LayoutGrid, List, Scan, Wind, Copy, Search, Download, Upload } from 'lucide-react';
import { Button, Input, ToastContainer } from '../components/ui';
import { TestCard, TestListItem, TestFilters, TestPagination, TestModal } from '../components/tests';
import { Test, initialTests, categories } from '../constants/mockData';
import { exportToExcelAdvanced, importFromExcelAdvanced } from '../lib/excel';
import type { ToastType } from '../components/ui/Toast';

export default function TestsPage() {
  const navigate = useNavigate();
  const [tests, setTests] = useState<Test[]>(initialTests);
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [testToDelete, setTestToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', category: 'Laboratuvar', price: '' });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedTests, setSelectedTests] = useState<Set<string>>(new Set());
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showCategoryPanel, setShowCategoryPanel] = useState(false);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 0 });
  const [selectedUnit, setSelectedUnit] = useState<'Tümü' | '₺' | '€' | '$'>('Tümü');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [toasts, setToasts] = useState<Array<{ id: string; type: ToastType; message: string }>>([]);

  // Load tests from localStorage on mount
  useEffect(() => {
    const savedTests = localStorage.getItem('tests');
    if (savedTests) {
      try {
        const parsedTests = JSON.parse(savedTests);
        setTests(parsedTests);
      } catch (e) {
        console.error('Error loading tests:', e);
      }
    }
  }, []);

  // Save tests to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tests', JSON.stringify(tests));
  }, [tests]);

  const showToast = (type: ToastType, message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const categoryIcons: { [key: string]: React.ReactNode } = {
    'Laboratuvar': <Beaker size={20} />,
    'Görüntüleme': <Scan size={20} />,
    'Kardiyoloji': <Heart size={20} />,
    'SFT': <Wind size={20} />,
    'Odyometri': <Stethoscope size={20} />,
    'Göz': <Eye size={20} />,
    'Aşı': <Syringe size={20} />,
  };

  const categoryColors: { [key: string]: { bg: string; icon: string; darkBg: string; darkIcon: string } } = {
    'Laboratuvar': { bg: 'bg-emerald-50', icon: 'text-emerald-600', darkBg: 'dark:bg-emerald-500/10', darkIcon: 'text-emerald-400' },
    'Görüntüleme': { bg: 'bg-blue-50', icon: 'text-blue-600', darkBg: 'dark:bg-blue-500/10', darkIcon: 'text-blue-400' },
    'Kardiyoloji': { bg: 'bg-rose-50', icon: 'text-rose-600', darkBg: 'dark:bg-rose-500/10', darkIcon: 'text-rose-400' },
    'SFT': { bg: 'bg-orange-50', icon: 'text-orange-600', darkBg: 'dark:bg-orange-500/10', darkIcon: 'text-orange-400' },
    'Odyometri': { bg: 'bg-violet-50', icon: 'text-violet-600', darkBg: 'dark:bg-violet-500/10', darkIcon: 'text-violet-400' },
    'Göz': { bg: 'bg-cyan-50', icon: 'text-cyan-600', darkBg: 'dark:bg-cyan-500/10', darkIcon: 'text-cyan-400' },
    'Aşı': { bg: 'bg-amber-50', icon: 'text-amber-600', darkBg: 'dark:bg-amber-500/10', darkIcon: 'text-amber-400' },
  };

  const handleFilter = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Apply all filters
  const filteredTests = tests
    .filter(test => 
      test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(test => 
      selectedCategory === 'Tümü' || test.category === selectedCategory
    )
    .filter(test => {
      const price = test.price || 0;
      if (priceRange.min > 0 && price < priceRange.min) return false;
      if (priceRange.max > 0 && price > priceRange.max) return false;
      return true;
    })
    .filter(test => {
      if (selectedUnit === 'Tümü') return true;
      return test.unit === selectedUnit;
    });

  const handleDelete = (id: string) => {
    setTestToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (testToDelete) {
      setTests(tests.filter(test => test.id !== testToDelete));
      setShowDeleteModal(false);
      setTestToDelete(null);
    }
  };

  const handleEdit = (test: Test) => {
    setEditingTest(test);
    setFormData({ name: test.name, category: test.category, price: test.price.toString() });
    setShowAddModal(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    const newTest: Test = {
      id: Date.now().toString(),
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      unit: '₺',
    };

    if (editingTest) {
      setTests(tests.map(test => test.id === editingTest.id ? newTest : test));
      setEditingTest(null);
    } else {
      setTests([...tests, newTest]);
    }

    setFormData({ name: '', category: 'Laboratuvar', price: '' });
    setShowAddModal(false);
  };

  const sortedTests = [...filteredTests].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name, 'tr');
    } else if (sortBy === 'category') {
      comparison = a.category.localeCompare(b.category, 'tr');
    } else if (sortBy === 'price') {
      comparison = a.price - b.price;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const totalPages = Math.ceil(sortedTests.length / itemsPerPage);
  const paginatedTests = sortedTests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedTests(new Set());
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
    setSelectedTests(new Set());
  };

  const handleSelectTest = (id: string) => {
    const newSelected = new Set(selectedTests);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedTests(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedTests.size === sortedTests.length) {
      setSelectedTests(new Set());
    } else {
      setSelectedTests(new Set(sortedTests.map(test => test.id)));
    }
  };

  const handleBulkDeleteConfirm = () => {
    setTests(tests.filter(test => !selectedTests.has(test.id)));
    setSelectedTests(new Set());
    setShowBulkDeleteModal(false);
  };

  const handleCopy = (test: Test) => {
    const newTest: Test = {
      id: Date.now().toString(),
      name: test.name + ' (Kopya)',
      category: test.category,
      price: test.price,
      unit: test.unit,
    };
    setTests([...tests, newTest]);
  };

  const handleExcelExport = () => {
    const headers = [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Test Adı' },
      { key: 'category', label: 'Kategori' },
      { key: 'price', label: 'Fiyat' },
      { key: 'unit', label: 'Birim' }
    ];
    
    exportToExcelAdvanced(
      filteredTests,
      headers,
      { fileName: 'testler.xlsx', sheetName: 'Testler' }
    );
  };

  const handleExcelImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const headers = [
      { key: 'name', label: 'Test Adı' },
      { key: 'category', label: 'Kategori' },
      { key: 'price', label: 'Fiyat' },
      { key: 'unit', label: 'Birim' }
    ];

    const result = await importFromExcelAdvanced<Test>(file, headers);

    if (result.error) {
      showToast('error', 'Dosya yüklenirken hata oluştu: ' + result.error);
      return;
    }

    if (result.data && result.data.length > 0) {
      const importedTests: Test[] = result.data.map((item, index) => ({
        id: Date.now().toString() + index,
        name: item.name || '',
        category: item.category || 'Laboratuvar',
        price: item.price || 0,
        unit: item.unit || '₺'
      }));

      // Duplicate kontrolü - aynı isim ve kategoriye sahip testleri filtrele
      const existingTestKeys = new Set(tests.map(test => `${test.name.toLowerCase()}-${test.category.toLowerCase()}`));
      const newTests = importedTests.filter(importedTest => {
        const key = `${importedTest.name.toLowerCase()}-${importedTest.category.toLowerCase()}`;
        return !existingTestKeys.has(key);
      });

      if (newTests.length === 0) {
        showToast('warning', 'İçe aktarılan tüm testler zaten mevcut.');
        return;
      }

      const skippedCount = importedTests.length - newTests.length;
      setTests([...tests, ...newTests]);
      
      if (skippedCount > 0) {
        showToast('info', `${newTests.length} yeni test eklendi, ${skippedCount} test zaten mevcut olduğu için atlandı.`);
      } else {
        showToast('success', `${newTests.length} test başarıyla içe aktarıldı.`);
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 dark:from-white dark:via-indigo-200 dark:to-purple-200 pb-1">
            Testler
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">
            Tarama ve teklif için kullanılan testler
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            icon={<Trash2 size={16} />}
            onClick={() => setShowBulkDeleteModal(true)}
            disabled={selectedTests.size === 0}
            className="shrink-0"
          >
            Toplu Sil
          </Button>
          <Button
            variant="secondary"
            icon={<Download size={16} />}
            onClick={handleExcelExport}
            className="shrink-0"
          >
            Excel
          </Button>
          <Button
            variant="secondary"
            icon={<Upload size={16} />}
            onClick={handleExcelImport}
            className="shrink-0"
          >
            İçe Aktar
          </Button>
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 shrink-0">
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
          <Button
            variant="primary"
            icon={<Plus size={16} />}
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/20 shrink-0"
          >
            Yeni Test
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Filters */}
      <TestFilters
            searchQuery={searchQuery}
            onSearch={handleSearch}
            selectedCategory={selectedCategory}
            categories={categories}
            categoryColors={categoryColors}
            onFilter={handleFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            showAdvancedFilters={showAdvancedFilters}
            onToggleAdvancedFilters={() => setShowAdvancedFilters(!showAdvancedFilters)}
            showCategoryPanel={showCategoryPanel}
            onToggleCategoryPanel={() => setShowCategoryPanel(!showCategoryPanel)}
          />

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="bg-gradient-to-br from-white/95 to-white/90 dark:from-slate-800/95 dark:to-slate-800/90 backdrop-blur-xl rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)] border border-slate-200/60 dark:border-slate-700/60 p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Fiyat Aralığı</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min || ''}
                  onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max || ''}
                  onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Birim</label>
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value as 'Tümü' | '₺' | '€' | '$')}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="Tümü">Tümü</option>
                <option value="₺">₺ (TL)</option>
                <option value="€">€ (Euro)</option>
                <option value="$">$ (Dolar)</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setPriceRange({ min: 0, max: 0 });
                setSelectedUnit('Tümü');
              }}
            >
              Filtreleri Temizle
            </Button>
          </div>
        </div>
      )}

      {/* Tests Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedTests.map((test, index) => (
            <TestCard
              key={test.id}
              test={test}
              categoryColors={categoryColors}
              categoryIcons={categoryIcons}
              selectedTests={selectedTests}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCopy={handleCopy}
              onSelect={handleSelectTest}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gradient-to-br from-white/90 to-white/70 dark:from-slate-800/90 dark:to-slate-800/70 backdrop-blur-xl rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.3)] border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-10">
                    <input
                      type="checkbox"
                      checked={selectedTests.size === sortedTests.length && sortedTests.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-0"
                    />
                  </th>
                  <th className="text-left p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Test Adı</th>
                  <th className="text-left p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Kategori</th>
                  <th className="text-right p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fiyat</th>
                  <th className="text-center p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTests.map((test, index) => (
                  <TestListItem
                    key={test.id}
                    test={test}
                    categoryColors={categoryColors}
                    categoryIcons={categoryIcons}
                    selectedTests={selectedTests}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onCopy={handleCopy}
                    onSelect={handleSelectTest}
                    index={index}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      <TestPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalTests={sortedTests.length}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {/* Add/Edit Modal */}
      <TestModal
        show={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingTest(null);
          setFormData({ name: '', category: 'Laboratuvar', price: '' });
        }}
        onSubmit={(e) => { e.preventDefault(); handleAddSubmit(e); }}
        formData={formData}
        onFormDataChange={setFormData}
        categories={categories}
        isEditing={!!editingTest}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowDeleteModal(false);
            setTestToDelete(null);
          }}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-100 dark:bg-rose-500/10 flex items-center justify-center">
              <Trash2 size={32} className="text-rose-600 dark:text-rose-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">Testi Sil</h2>
            <p className="text-slate-500 dark:text-slate-400 text-center mb-6">
              Bu testi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </p>
            
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  setShowDeleteModal(false);
                  setTestToDelete(null);
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

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowBulkDeleteModal(false);
          }}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-100 dark:bg-rose-500/10 flex items-center justify-center">
              <Trash2 size={32} className="text-rose-600 dark:text-rose-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">Testleri Sil</h2>
            <p className="text-slate-500 dark:text-slate-400 text-center mb-6">
              {selectedTests.size} testi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </p>
            
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  setShowBulkDeleteModal(false);
                }}
              >
                İptal
              </Button>
              <Button
                variant="primary"
                className="flex-1 bg-rose-500 hover:bg-rose-600"
                onClick={handleBulkDeleteConfirm}
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
