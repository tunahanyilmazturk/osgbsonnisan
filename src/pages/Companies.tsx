import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, Activity, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button, ToastContainer } from '../components/ui';
import { CompaniesCard, CompaniesModal, CompaniesFilters, CompaniesHeader, CompaniesListItem, CompaniesPagination } from '../components/companies';
import { Company, initialCompanies, companySectors } from '../constants/mockData';
import { exportToExcelAdvanced, importFromExcelAdvanced } from '../lib/excel';
import type { ToastType } from '../components/ui/Toast';
import type { CompanyFormData } from '../lib/validation';

export default function CompaniesPage() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);

  useEffect(() => {
    const storedCompanies = localStorage.getItem('companies');
    if (storedCompanies) {
      const localStorageCompanies = JSON.parse(storedCompanies);
      // initialCompanies ile birleştir, duplicasyonları kaldır
      const mergedCompanies = [...initialCompanies];
      localStorageCompanies.forEach((lc: Company) => {
        if (!mergedCompanies.find(c => c.id === lc.id)) {
          mergedCompanies.push(lc);
        }
      });
      setCompanies(mergedCompanies);
    } else {
      setCompanies(initialCompanies);
    }
  }, [window.location.pathname]);
  const [selectedSector, setSelectedSector] = useState('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    taxNumber: '',
    taxOffice: '',
    authorizedPerson: '',
    authorizedPersonPhone: '',
    authorizedPersonEmail: '',
    employeeCount: 0,
    address: '',
    sector: 'Teknoloji',
    status: 'active' as 'active' | 'inactive',
  });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedCompanies, setSelectedCompanies] = useState<Set<string>>(new Set());
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showSectorPanel, setShowSectorPanel] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [employeeCountRange, setEmployeeCountRange] = useState<{ min: number; max: number }>({ min: 0, max: 0 });
  const [selectedStatus, setSelectedStatus] = useState<'Tümü' | 'active' | 'inactive'>('Tümü');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [toasts, setToasts] = useState<Array<{ id: string; type: ToastType; message: string }>>([]);

  const showToast = (type: ToastType, message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const sectorColors: { [key: string]: { bg: string; icon: string; darkBg: string; darkIcon: string } } = {
    'Teknoloji': { bg: 'bg-blue-50', icon: 'text-blue-600', darkBg: 'dark:bg-blue-500/10', darkIcon: 'text-blue-400' },
    'Sağlık': { bg: 'bg-rose-50', icon: 'text-rose-600', darkBg: 'dark:bg-rose-500/10', darkIcon: 'text-rose-400' },
    'İnşaat': { bg: 'bg-amber-50', icon: 'text-amber-600', darkBg: 'dark:bg-amber-500/10', darkIcon: 'text-amber-400' },
    'Eğitim': { bg: 'bg-violet-50', icon: 'text-violet-600', darkBg: 'dark:bg-violet-500/10', darkIcon: 'text-violet-400' },
    'Gıda': { bg: 'bg-emerald-50', icon: 'text-emerald-600', darkBg: 'dark:bg-emerald-500/10', darkIcon: 'text-emerald-400' },
    'Üretim': { bg: 'bg-orange-50', icon: 'text-orange-600', darkBg: 'dark:bg-orange-500/10', darkIcon: 'text-orange-400' },
    'Hizmet': { bg: 'bg-cyan-50', icon: 'text-cyan-600', darkBg: 'dark:bg-cyan-500/10', darkIcon: 'text-cyan-400' },
    'Perakende': { bg: 'bg-pink-50', icon: 'text-pink-600', darkBg: 'dark:bg-pink-500/10', darkIcon: 'text-pink-400' },
    'Tümü': { bg: 'bg-slate-50', icon: 'text-slate-600', darkBg: 'dark:bg-slate-500/10', darkIcon: 'text-slate-400' },
  };

  const handleFilter = (sector: string) => {
    setSelectedSector(sector);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Apply all filters
  const filteredCompanies = companies
    .filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.authorizedPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.authorizedPersonEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.taxNumber.includes(searchQuery)
    )
    .filter(c => 
      selectedSector === 'Tümü' || c.sector === selectedSector
    )
    .filter(c => {
      if (!dateRange.start && !dateRange.end) return true;
      const companyDate = new Date(c.createdAt);
      if (dateRange.start) {
        const startDate = new Date(dateRange.start);
        startDate.setHours(0, 0, 0, 0);
        if (companyDate < startDate) return false;
      }
      if (dateRange.end) {
        const endDate = new Date(dateRange.end);
        endDate.setHours(23, 59, 59, 999);
        if (companyDate > endDate) return false;
      }
      return true;
    })
    .filter(c => {
      const employeeCount = c.employeeCount || 0;
      if (employeeCountRange.min > 0 && employeeCount < employeeCountRange.min) return false;
      if (employeeCountRange.max > 0 && employeeCount > employeeCountRange.max) return false;
      return true;
    })
    .filter(c => {
      if (selectedStatus === 'Tümü') return true;
      return c.status === selectedStatus;
    });

  const handleDelete = (id: string) => {
    setCompanyToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (companyToDelete) {
      setCompanies(companies.filter(c => c.id !== companyToDelete));
      setShowDeleteModal(false);
      setCompanyToDelete(null);
    }
  };

  const handleEdit = (c: Company) => {
    setEditingCompany(c);
    setFormData({
      name: c.name,
      taxNumber: c.taxNumber,
      taxOffice: c.taxOffice,
      authorizedPerson: c.authorizedPerson,
      authorizedPersonPhone: c.authorizedPersonPhone,
      authorizedPersonEmail: c.authorizedPersonEmail,
      employeeCount: c.employeeCount,
      address: c.address,
      sector: c.sector,
      status: c.status,
    });
    setShowAddModal(true);
  };

  const handleCopy = (c: Company) => {
    const newCompany: Company = {
      ...c,
      id: `CMP-${Date.now()}`,
      name: c.name,
      taxNumber: c.taxNumber,
      taxOffice: c.taxOffice,
      authorizedPerson: c.authorizedPerson,
      authorizedPersonPhone: c.authorizedPersonPhone,
      authorizedPersonEmail: c.authorizedPersonEmail,
      employeeCount: c.employeeCount,
      address: c.address,
      sector: c.sector,
      status: c.status,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCompanies([...companies, newCompany]);
  };

  const handleAddSubmit = (data: CompanyFormData) => {
    if (!data.name || !data.taxNumber || !data.authorizedPerson) return;

    // Vergi numarası duplicasyon kontrolü
    const taxNumberExists = companies.some(c => c.taxNumber === data.taxNumber && c.id !== editingCompany?.id);
    if (taxNumberExists) {
      showToast('error', 'Bu vergi numarası zaten kullanımda!');
      return;
    }

    // Telefon duplicasyon kontrolü
    const phoneExists = companies.some(c => c.authorizedPersonPhone === data.authorizedPersonPhone && c.id !== editingCompany?.id);
    if (phoneExists) {
      showToast('error', 'Bu telefon numarası zaten kullanımda!');
      return;
    }

    // E-posta duplicasyon kontrolü
    const emailExists = companies.some(c => c.authorizedPersonEmail === data.authorizedPersonEmail && c.id !== editingCompany?.id);
    if (emailExists) {
      showToast('error', 'Bu e-posta adresi zaten kullanımda!');
      return;
    }

    const newCompany: Company = {
      id: `CMP-${Date.now()}`,
      name: data.name,
      taxNumber: data.taxNumber,
      taxOffice: data.taxOffice,
      authorizedPerson: data.authorizedPerson,
      authorizedPersonPhone: data.authorizedPersonPhone,
      authorizedPersonEmail: data.authorizedPersonEmail,
      employeeCount: data.employeeCount,
      address: data.address,
      sector: data.sector,
      status: data.status,
      createdAt: new Date().toISOString().split('T')[0],
    };

    if (editingCompany) {
      setCompanies(companies.map(c => c.id === editingCompany.id ? newCompany : c));
      setEditingCompany(null);
    } else {
      setCompanies([...companies, newCompany]);
    }

    setShowAddModal(false);
    showToast('success', editingCompany ? 'Firma başarıyla güncellendi!' : 'Firma başarıyla eklendi!');
  };

  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name, 'tr');
    } else if (sortBy === 'sector') {
      comparison = a.sector.localeCompare(b.sector, 'tr');
    } else if (sortBy === 'employeeCount') {
      comparison = a.employeeCount - b.employeeCount;
    } else if (sortBy === 'createdAt') {
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const totalPages = Math.ceil(sortedCompanies.length / itemsPerPage);
  const paginatedCompanies = sortedCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedCompanies(new Set());
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
    setSelectedCompanies(new Set());
  };

  const handleSelectCompany = (id: string) => {
    const newSelected = new Set(selectedCompanies);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedCompanies(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedCompanies.size === sortedCompanies.length) {
      setSelectedCompanies(new Set());
    } else {
      setSelectedCompanies(new Set(sortedCompanies.map(c => c.id)));
    }
  };

  const handleBulkDeleteConfirm = () => {
    setCompanies(companies.filter(c => !selectedCompanies.has(c.id)));
    setSelectedCompanies(new Set());
    setShowBulkDeleteModal(false);
  };

  const handleResetConfirm = () => {
    setCompanies(initialCompanies);
    setSelectedCompanies(new Set());
    setShowResetModal(false);
  };

  const handleExport = () => {
    const headers = [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Firma Adı' },
      { key: 'taxNumber', label: 'Vergi No' },
      { key: 'taxOffice', label: 'Vergi Dairesi' },
      { key: 'authorizedPerson', label: 'Yetkili Kişi' },
      { key: 'authorizedPersonPhone', label: 'Yetkili Telefon' },
      { key: 'authorizedPersonEmail', label: 'Yetkili Email' },
      { key: 'employeeCount', label: 'Çalışan Sayısı' },
      { key: 'address', label: 'Adres' },
      { key: 'sector', label: 'Sektör' },
      { key: 'status', label: 'Durum' },
      { key: 'createdAt', label: 'Kayıt Tarihi' }
    ];
    
    exportToExcelAdvanced(
      companies,
      headers,
      { fileName: 'firmalar.xlsx', sheetName: 'Firmalar' }
    );
  };

  const handleExcelImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const headers = [
      { key: 'name', label: 'Firma Adı' },
      { key: 'taxNumber', label: 'Vergi No' },
      { key: 'taxOffice', label: 'Vergi Dairesi' },
      { key: 'authorizedPerson', label: 'Yetkili Kişi' },
      { key: 'authorizedPersonPhone', label: 'Yetkili Telefon' },
      { key: 'authorizedPersonEmail', label: 'Yetkili Email' },
      { key: 'employeeCount', label: 'Çalışan Sayısı' },
      { key: 'address', label: 'Adres' },
      { key: 'sector', label: 'Sektör' },
      { key: 'status', label: 'Durum' }
    ];

    const result = await importFromExcelAdvanced<Company>(file, headers);

    if (result.error) {
      showToast('error', 'Dosya yüklenirken hata oluştu: ' + result.error);
      return;
    }

    if (result.data && result.data.length > 0) {
      const importedCompanies: Company[] = result.data.map((item, index) => ({
        id: `CMP-${Date.now()}-${index}`,
        name: item.name || '',
        taxNumber: item.taxNumber || '',
        taxOffice: item.taxOffice || '',
        authorizedPerson: item.authorizedPerson || '',
        authorizedPersonPhone: item.authorizedPersonPhone || '',
        authorizedPersonEmail: item.authorizedPersonEmail || '',
        employeeCount: item.employeeCount || 0,
        address: item.address || '',
        sector: item.sector || 'Teknoloji',
        status: item.status || 'active',
        createdAt: new Date().toISOString().split('T')[0],
      }));

      // Duplicate kontrolü - vergi numarasına göre
      const existingTaxNumbers = new Set(companies.map(c => c.taxNumber));
      const newCompanies = importedCompanies.filter(importedCompany => {
        return !existingTaxNumbers.has(importedCompany.taxNumber);
      });

      if (newCompanies.length === 0) {
        showToast('warning', 'İçe aktarılan tüm firmalar zaten mevcut.');
        return;
      }

      const skippedCount = importedCompanies.length - newCompanies.length;
      setCompanies([...companies, ...newCompanies]);
      
      if (skippedCount > 0) {
        showToast('info', `${newCompanies.length} yeni firma eklendi, ${skippedCount} firma zaten mevcut olduğu için atlandı.`);
      } else {
        showToast('success', `${newCompanies.length} firma başarıyla içe aktarıldı.`);
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
            Firmalar
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">
            Telif ve tarama firmaları kayıtları ve yönetimi
          </p>
        </div>
        <CompaniesHeader
          selectedCount={selectedCompanies.size}
          onBulkDelete={() => setShowBulkDeleteModal(true)}
          onReset={() => setShowResetModal(true)}
          onExport={handleExport}
          onExcelImport={handleExcelImport}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onAddCompany={() => navigate('/companies/add')}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Filters */}
      <CompaniesFilters
        searchQuery={searchQuery}
        onSearch={handleSearch}
        selectedSector={selectedSector}
        sectors={companySectors}
        sectorColors={sectorColors}
        onFilter={handleFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        showAdvancedFilters={showAdvancedFilters}
        onToggleAdvancedFilters={() => setShowAdvancedFilters(!showAdvancedFilters)}
        showSectorPanel={showSectorPanel}
        onToggleSectorPanel={() => setShowSectorPanel(!showSectorPanel)}
      />

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="bg-gradient-to-br from-white/95 to-white/90 dark:from-slate-800/95 dark:to-slate-800/90 backdrop-blur-xl rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)] border border-slate-200/60 dark:border-slate-700/60 p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Kayıt Tarihi Aralığı</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Çalışan Sayısı Aralığı</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={employeeCountRange.min || ''}
                  onChange={(e) => setEmployeeCountRange({ ...employeeCountRange, min: Number(e.target.value) })}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={employeeCountRange.max || ''}
                  onChange={(e) => setEmployeeCountRange({ ...employeeCountRange, max: Number(e.target.value) })}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Durum</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as 'Tümü' | 'active' | 'inactive')}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="Tümü">Tümü</option>
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setDateRange({ start: '', end: '' });
                setEmployeeCountRange({ min: 0, max: 0 });
                setSelectedStatus('Tümü');
              }}
            >
              Filtreleri Temizle
            </Button>
          </div>
        </div>
      )}

      {/* Companies Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedCompanies.map((c, index) => (
            <CompaniesCard
              key={c.id}
              company={c}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCopy={handleCopy}
              selected={selectedCompanies.has(c.id)}
              onSelect={handleSelectCompany}
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
                      checked={selectedCompanies.size === sortedCompanies.length && sortedCompanies.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-0"
                    />
                  </th>
                  <th className="text-left p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Firma</th>
                  <th className="text-left p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Yetkili Kişi</th>
                  <th className="text-left p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Vergi No</th>
                  <th className="text-left p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Çalışan</th>
                  <th className="text-left p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Telefon</th>
                  <th className="text-left p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</th>
                  <th className="text-left p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Durum</th>
                  <th className="text-center p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCompanies.map((c, index) => (
                  <CompaniesListItem
                    key={c.id}
                    company={c}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onCopy={handleCopy}
                    selected={selectedCompanies.has(c.id)}
                    onSelect={handleSelectCompany}
                    index={index}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      <CompaniesPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalCompanies={sortedCompanies.length}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {/* Add/Edit Modal */}
      <CompaniesModal
        show={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingCompany(null);
          setFormData({
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
          });
        }}
        onSubmit={handleAddSubmit}
        defaultValues={editingCompany ? formData : undefined}
        isEditing={!!editingCompany}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowDeleteModal(false);
            setCompanyToDelete(null);
          }}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-100 dark:bg-rose-500/10 flex items-center justify-center">
              <Trash2 size={32} className="text-rose-600 dark:text-rose-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">Firmayı Sil</h2>
            <p className="text-slate-500 dark:text-slate-400 text-center mb-6">
              Bu firmayı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </p>
            
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  setShowDeleteModal(false);
                  setCompanyToDelete(null);
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
            
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">Firmaları Sil</h2>
            <p className="text-slate-500 dark:text-slate-400 text-center mb-6">
              {selectedCompanies.size} firmayı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
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

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowResetModal(false);
          }}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center">
              <Activity size={32} className="text-amber-600 dark:text-amber-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">Firmaları Sıfırla</h2>
            <p className="text-slate-500 dark:text-slate-400 text-center mb-6">
              Tüm firmaları varsayılan duruma sıfırlamak istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </p>
            
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  setShowResetModal(false);
                }}
              >
                İptal
              </Button>
              <Button
                variant="primary"
                className="flex-1 bg-amber-500 hover:bg-amber-600"
                onClick={handleResetConfirm}
              >
                Sıfırla
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
