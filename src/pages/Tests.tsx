import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit, Trash2, Beaker, Activity, Eye, Stethoscope, Heart, Syringe, X, LayoutGrid, List, Scan, Wind, Copy, Package as PackageIcon } from 'lucide-react';
import { Button, Input, ToastContainer } from '../components/ui';
import { containerVariants, itemVariants } from '../lib/animations';
import { TestCard, TestListItem, TestFilters, TestPagination, TestModal, PackageModal, PackageCard, TestsHeader } from '../components/tests';
import { Test, TestPackage, initialTests, initialPackages, categories } from '../constants/mockData';
import { exportToExcelAdvanced, importFromExcelAdvanced } from '../lib/excel';
import type { ToastType } from '../components/ui/Toast';

export default function TestsPage() {
  const [activeTab, setActiveTab] = useState<'tests' | 'packages'>('tests');
  const [tests, setTests] = useState<Test[]>(initialTests);
  const [filteredTests, setFilteredTests] = useState<Test[]>(initialTests);
  const [packages, setPackages] = useState<TestPackage[]>(initialPackages);
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
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [packageFormData, setPackageFormData] = useState({ name: '', selectedTestIds: new Set<string>(), testPrices: {} as { [testId: string]: number }, discountPercentage: 0 });
  const [editingPackage, setEditingPackage] = useState<TestPackage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [toasts, setToasts] = useState<Array<{ id: string; type: ToastType; message: string }>>([]);

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
    const filtered = category === 'Tümü' 
      ? tests 
      : tests.filter(test => test.category === category);
    setFilteredTests(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = tests.filter(test => 
      test.name.toLowerCase().includes(query.toLowerCase()) ||
      test.category.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTests(filtered);
  };

  const handleDelete = (id: string) => {
    setTestToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (testToDelete) {
      setTests(tests.filter(test => test.id !== testToDelete));
      setFilteredTests(filteredTests.filter(test => test.id !== testToDelete));
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
      setFilteredTests(filteredTests.map(test => test.id === editingTest.id ? newTest : test));
      setEditingTest(null);
    } else {
      setTests([...tests, newTest]);
      setFilteredTests([...filteredTests, newTest]);
    }

    setFormData({ name: '', category: 'Laboratuvar', price: '' });
    setShowAddModal(false);
  };

  const sortedTests = [...filteredTests].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === 'category') {
      comparison = a.category.localeCompare(b.category);
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
    setFilteredTests(filteredTests.filter(test => !selectedTests.has(test.id)));
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
    setFilteredTests([...filteredTests, newTest]);
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
      setFilteredTests([...filteredTests, ...newTests]);
      
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

  const handleAddPackage = () => {
    if (!packageFormData.name || packageFormData.selectedTestIds.size === 0) return;

    const originalPrice = Array.from(packageFormData.selectedTestIds)
      .reduce((sum, testId) => {
        const customPrice = packageFormData.testPrices[testId];
        return sum + (customPrice || 0);
      }, 0);

    const discountPercentage = packageFormData.discountPercentage || 0;
    const totalPrice = originalPrice * (1 - discountPercentage / 100);

    const newPackage: TestPackage = {
      id: Date.now().toString(),
      name: packageFormData.name,
      testIds: Array.from(packageFormData.selectedTestIds),
      testPrices: packageFormData.testPrices,
      originalPrice,
      discountPercentage,
      totalPrice,
    };

    if (editingPackage) {
      setPackages(packages.map(pkg => pkg.id === editingPackage.id ? newPackage : pkg));
      setEditingPackage(null);
    } else {
      setPackages([...packages, newPackage]);
    }

    setPackageFormData({ name: '', selectedTestIds: new Set<string>(), testPrices: {} as { [testId: string]: number }, discountPercentage: 0 });
    setShowPackageModal(false);
  };

  const handleEditPackage = (pkg: TestPackage) => {
    setEditingPackage(pkg);
    setPackageFormData({ name: pkg.name, selectedTestIds: new Set(pkg.testIds), testPrices: pkg.testPrices, discountPercentage: pkg.discountPercentage });
    setShowPackageModal(true);
  };

  const handleDeletePackage = (id: string) => {
    setPackages(packages.filter(pkg => pkg.id !== id));
  };

  const handleTestSelection = (testId: string) => {
    const newSelected = new Set(packageFormData.selectedTestIds);
    const newTestPrices = { ...packageFormData.testPrices };
    const test = tests.find(t => t.id === testId);
    
    if (newSelected.has(testId)) {
      newSelected.delete(testId);
      delete newTestPrices[testId];
    } else {
      newSelected.add(testId);
      if (test) {
        newTestPrices[testId] = test.price;
      }
    }
    setPackageFormData({ ...packageFormData, selectedTestIds: newSelected, testPrices: newTestPrices });
  };

  const handlePriceChange = (testId: string, newPrice: string) => {
    const newTestPrices = { ...packageFormData.testPrices };
    newTestPrices[testId] = parseFloat(newPrice) || 0;
    setPackageFormData({ ...packageFormData, testPrices: newTestPrices });
  };

  const handleRemoveTest = (testId: string) => {
    const newSelected = new Set(packageFormData.selectedTestIds);
    const newTestPrices = { ...packageFormData.testPrices };
    newSelected.delete(testId);
    delete newTestPrices[testId];
    setPackageFormData({ ...packageFormData, selectedTestIds: newSelected, testPrices: newTestPrices });
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 dark:from-white dark:via-indigo-200 dark:to-purple-200 pb-1">
            Testler
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">
            Tarama ve teklif için kullanılan testler ve paketler
          </p>
        </div>
        <TestsHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          selectedTests={selectedTests}
          onBulkDelete={() => setShowBulkDeleteModal(true)}
          onExcelExport={handleExcelExport}
          onExcelImport={handleExcelImport}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onAddTest={() => setShowAddModal(true)}
          onAddPackage={() => setShowPackageModal(true)}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
        />
      </motion.div>

      {activeTab === 'tests' && (
        <>
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
          />

      {/* Tests Grid/List */}
      {viewMode === 'grid' ? (
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-white/90 to-white/70 dark:from-slate-800/90 dark:to-slate-800/70 backdrop-blur-xl rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.3)] border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
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
        </motion.div>
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowDeleteModal(false);
            setTestToDelete(null);
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
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
          </motion.div>
        </motion.div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowBulkDeleteModal(false);
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
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
          </motion.div>
        </motion.div>
      )}
      </>
      )}

      {/* Packages Tab Content */}
      {activeTab === 'packages' && (
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Test Paketleri</h2>
            <Button variant="primary" icon={<Plus size={16} />} onClick={() => setShowPackageModal(true)} className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/20">
              Yeni Paket Oluştur
            </Button>
          </div>

          {packages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <PackageIcon size={32} className="text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Henüz paket yok</h3>
              <p className="text-slate-500 dark:text-slate-400">Test paketi oluşturmak için butona tıklayın</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {packages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  tests={tests}
                  onEdit={handleEditPackage}
                  onDelete={handleDeletePackage}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Package Modal */}
      <PackageModal
        isOpen={showPackageModal}
        onClose={() => {
          setShowPackageModal(false);
          setEditingPackage(null);
          setPackageFormData({ name: '', selectedTestIds: new Set<string>(), testPrices: {} as { [testId: string]: number }, discountPercentage: 0 });
        }}
        onSubmit={(e) => { e.preventDefault(); handleAddPackage(); }}
        formData={packageFormData}
        onFormDataChange={setPackageFormData}
        tests={tests}
        categoryColors={categoryColors}
        categoryIcons={categoryIcons}
        onTestSelection={handleTestSelection}
        onPriceChange={handlePriceChange}
        onRemoveTest={handleRemoveTest}
        isEditing={!!editingPackage}
      />
      
      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </motion.div>
  );
}
