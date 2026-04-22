import React, { useState, useRef } from 'react';
import { Plus, Edit, Trash2, Activity, X, LayoutGrid, List } from 'lucide-react';
import { Button, ToastContainer } from '../components/ui';
import { PersonnelCard, PersonnelModal, PersonnelFilters, PersonnelHeader, PersonnelListItem, PersonnelPagination } from '../components/personnel';
import { Staff, initialStaff, staffPositions } from '../constants/mockData';
import { exportToExcelAdvanced, importFromExcelAdvanced } from '../lib/excel';
import type { ToastType } from '../components/ui/Toast';

export default function PersonnelPage() {
  const [staff, setStaff] = useState<Staff[]>(initialStaff);
  const [selectedPosition, setSelectedPosition] = useState('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    position: 'İş Yeri Hekimi',
    startDate: new Date().toISOString().split('T')[0],
    status: 'active' as 'active' | 'inactive',
  });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedStaff, setSelectedStaff] = useState<Set<string>>(new Set());
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showPositionPanel, setShowPositionPanel] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
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

  const positionColors: { [key: string]: { bg: string; icon: string; darkBg: string; darkIcon: string } } = {
    'Radyoloji Teknikeri': { bg: 'bg-blue-50', icon: 'text-blue-600', darkBg: 'dark:bg-blue-500/10', darkIcon: 'text-blue-400' },
    'Odyometrist': { bg: 'bg-violet-50', icon: 'text-violet-600', darkBg: 'dark:bg-violet-500/10', darkIcon: 'text-violet-400' },
    'Hemşire': { bg: 'bg-rose-50', icon: 'text-rose-600', darkBg: 'dark:bg-rose-500/10', darkIcon: 'text-rose-400' },
    'Laboratuvar Teknikeri': { bg: 'bg-emerald-50', icon: 'text-emerald-600', darkBg: 'dark:bg-emerald-500/10', darkIcon: 'text-emerald-400' },
    'Sağlık Teknikeri': { bg: 'bg-amber-50', icon: 'text-amber-600', darkBg: 'dark:bg-amber-500/10', darkIcon: 'text-amber-400' },
    'İş Yeri Hekimi': { bg: 'bg-indigo-50', icon: 'text-indigo-600', darkBg: 'dark:bg-indigo-500/10', darkIcon: 'text-indigo-400' },
    'Müdür': { bg: 'bg-purple-50', icon: 'text-purple-600', darkBg: 'dark:bg-purple-500/10', darkIcon: 'text-purple-400' },
    'Yönetici': { bg: 'bg-slate-50', icon: 'text-slate-600', darkBg: 'dark:bg-slate-500/10', darkIcon: 'text-slate-400' },
  };

  const handleFilter = (position: string) => {
    setSelectedPosition(position);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Apply all filters
  const filteredStaff = staff
    .filter(s => 
      s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery)
    )
    .filter(s => 
      selectedPosition === 'Tümü' || s.position === selectedPosition
    )
    .filter(s => {
      if (!dateRange.start && !dateRange.end) return true;
      const staffDate = new Date(s.startDate);
      if (dateRange.start) {
        const startDate = new Date(dateRange.start);
        startDate.setHours(0, 0, 0, 0);
        if (staffDate < startDate) return false;
      }
      if (dateRange.end) {
        const endDate = new Date(dateRange.end);
        endDate.setHours(23, 59, 59, 999);
        if (staffDate > endDate) return false;
      }
      return true;
    })
    .filter(s => {
      if (selectedStatus === 'Tümü') return true;
      return s.status === selectedStatus;
    });

  const handleDelete = (id: string) => {
    setStaffToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (staffToDelete) {
      setStaff(staff.filter(s => s.id !== staffToDelete));
      setShowDeleteModal(false);
      setStaffToDelete(null);
    }
  };

  const handleEdit = (s: Staff) => {
    setEditingStaff(s);
    setFormData({
      firstName: s.firstName,
      lastName: s.lastName,
      phone: s.phone,
      email: s.email,
      position: s.position,
      startDate: s.startDate,
      status: s.status,
    });
    setShowAddModal(true);
  };

  const handleCopy = (s: Staff) => {
    const newStaff: Staff = {
      ...s,
      id: `ST-${Date.now()}`,
      firstName: s.firstName,
      lastName: s.lastName,
      phone: s.phone,
      email: s.email,
      position: s.position,
      startDate: s.startDate,
      status: s.status,
    };
    setStaff([...staff, newStaff]);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email) return;

    // E-posta duplicasyon kontrolü
    const emailExists = staff.some(s => s.email === formData.email && s.id !== editingStaff?.id);
    if (emailExists) {
      showToast('error', 'Bu e-posta adresi zaten kullanımda!');
      return;
    }

    // Telefon duplicasyon kontrolü
    const phoneExists = staff.some(s => s.phone === formData.phone && s.id !== editingStaff?.id);
    if (phoneExists) {
      showToast('error', 'Bu telefon numarası zaten kullanımda!');
      return;
    }

    const newStaff: Staff = {
      id: `ST-${Date.now()}`,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      email: formData.email,
      position: formData.position,
      startDate: formData.startDate,
      status: formData.status,
    };

    if (editingStaff) {
      setStaff(staff.map(s => s.id === editingStaff.id ? newStaff : s));
      setEditingStaff(null);
    } else {
      setStaff([...staff, newStaff]);
    }

    setFormData({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      position: 'İş Yeri Hekimi',
      startDate: new Date().toISOString().split('T')[0],
      status: 'active',
    });
    setShowAddModal(false);
  };

  const sortedStaff = [...filteredStaff].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'name') {
      comparison = a.firstName.localeCompare(b.firstName, 'tr');
      if (comparison === 0) {
        comparison = a.lastName.localeCompare(b.lastName, 'tr');
      }
    } else if (sortBy === 'position') {
      comparison = a.position.localeCompare(b.position, 'tr');
    } else if (sortBy === 'startDate') {
      comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const totalPages = Math.ceil(sortedStaff.length / itemsPerPage);
  const paginatedStaff = sortedStaff.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedStaff(new Set());
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
    setSelectedStaff(new Set());
  };

  const handleSelectStaff = (id: string) => {
    const newSelected = new Set(selectedStaff);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedStaff(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedStaff.size === sortedStaff.length) {
      setSelectedStaff(new Set());
    } else {
      setSelectedStaff(new Set(sortedStaff.map(s => s.id)));
    }
  };

  const handleBulkDeleteConfirm = () => {
    setStaff(staff.filter(s => !selectedStaff.has(s.id)));
    setSelectedStaff(new Set());
    setShowBulkDeleteModal(false);
  };

  const handleResetConfirm = () => {
    setStaff(initialStaff);
    setSelectedStaff(new Set());
    setShowResetModal(false);
  };

  const handleExport = () => {
    const headers = [
      { key: 'id', label: 'ID' },
      { key: 'firstName', label: 'Ad' },
      { key: 'lastName', label: 'Soyad' },
      { key: 'phone', label: 'Telefon' },
      { key: 'email', label: 'Email' },
      { key: 'position', label: 'Pozisyon' },
      { key: 'startDate', label: 'Başlangıç Tarihi' },
      { key: 'status', label: 'Durum' }
    ];
    
    exportToExcelAdvanced(
      staff,
      headers,
      { fileName: 'personeller.xlsx', sheetName: 'Personeller' }
    );
  };

  const handleExcelImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const headers = [
      { key: 'firstName', label: 'Ad' },
      { key: 'lastName', label: 'Soyad' },
      { key: 'phone', label: 'Telefon' },
      { key: 'email', label: 'Email' },
      { key: 'position', label: 'Pozisyon' },
      { key: 'startDate', label: 'Başlangıç Tarihi' },
      { key: 'status', label: 'Durum' }
    ];

    const result = await importFromExcelAdvanced<Staff>(file, headers);

    if (result.error) {
      showToast('error', 'Dosya yüklenirken hata oluştu: ' + result.error);
      return;
    }

    if (result.data && result.data.length > 0) {
      const importedStaff: Staff[] = result.data.map((item, index) => ({
        id: `ST-${Date.now()}-${index}`,
        firstName: item.firstName || '',
        lastName: item.lastName || '',
        phone: item.phone || '',
        email: item.email || '',
        position: item.position || 'İş Yeri Hekimi',
        startDate: item.startDate || new Date().toISOString().split('T')[0],
        status: item.status || 'active',
      }));

      // Duplicate kontrolü - email ve telefon kombinasyonuna göre
      const existingKeys = new Set(staff.map(s => `${s.email.toLowerCase()}-${s.phone}`));
      const newStaff = importedStaff.filter(importedPerson => {
        const key = `${importedPerson.email.toLowerCase()}-${importedPerson.phone}`;
        return !existingKeys.has(key);
      });

      if (newStaff.length === 0) {
        showToast('warning', 'İçe aktarılan tüm personel zaten mevcut.');
        return;
      }

      const skippedCount = importedStaff.length - newStaff.length;
      setStaff([...staff, ...newStaff]);
      
      if (skippedCount > 0) {
        showToast('info', `${newStaff.length} yeni personel eklendi, ${skippedCount} personel zaten mevcut olduğu için atlandı.`);
      } else {
        showToast('success', `${newStaff.length} personel başarıyla içe aktarıldı.`);
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
            Personeller
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">
            OSGB personel kayıtları ve yönetimi
          </p>
        </div>
        <PersonnelHeader
          selectedCount={selectedStaff.size}
          onBulkDelete={() => setShowBulkDeleteModal(true)}
          onReset={() => setShowResetModal(true)}
          onExport={handleExport}
          onExcelImport={handleExcelImport}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onAddPersonnel={() => setShowAddModal(true)}
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
      <PersonnelFilters
        searchQuery={searchQuery}
        onSearch={handleSearch}
        selectedPosition={selectedPosition}
        positions={staffPositions}
        positionColors={positionColors}
        onFilter={handleFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        showAdvancedFilters={showAdvancedFilters}
        onToggleAdvancedFilters={() => setShowAdvancedFilters(!showAdvancedFilters)}
        showPositionPanel={showPositionPanel}
        onTogglePositionPanel={() => setShowPositionPanel(!showPositionPanel)}
      />

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="bg-gradient-to-br from-white/95 to-white/90 dark:from-slate-800/95 dark:to-slate-800/90 backdrop-blur-xl rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)] border border-slate-200/60 dark:border-slate-700/60 p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">İşe Başlama Tarihi Aralığı</label>
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
                setSelectedStatus('Tümü');
              }}
            >
              Filtreleri Temizle
            </Button>
          </div>
        </div>
      )}

      {/* Staff Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedStaff.map((s, index) => (
            <PersonnelCard
              key={s.id}
              staff={s}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCopy={handleCopy}
              selected={selectedStaff.has(s.id)}
              onSelect={handleSelectStaff}
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
                      checked={selectedStaff.size === sortedStaff.length && sortedStaff.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-0"
                    />
                  </th>
                  <th className="text-left p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Personel</th>
                  <th className="text-left p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pozisyon</th>
                  <th className="text-left p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Telefon</th>
                  <th className="text-left p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</th>
                  <th className="text-left p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Başlangıç Tarihi</th>
                  <th className="text-left p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Durum</th>
                  <th className="text-center p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStaff.map((s, index) => (
                  <PersonnelListItem
                    key={s.id}
                    staff={s}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onCopy={handleCopy}
                    selected={selectedStaff.has(s.id)}
                    onSelect={handleSelectStaff}
                    index={index}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      <PersonnelPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalStaff={sortedStaff.length}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {/* Add/Edit Modal */}
      <PersonnelModal
        show={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingStaff(null);
          setFormData({
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
            position: 'İş Yeri Hekimi',
            startDate: new Date().toISOString().split('T')[0],
            status: 'active',
          });
        }}
        onSubmit={handleAddSubmit}
        formData={formData}
        onFormDataChange={setFormData}
        isEditing={!!editingStaff}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowDeleteModal(false);
            setStaffToDelete(null);
          }}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-100 dark:bg-rose-500/10 flex items-center justify-center">
              <Trash2 size={32} className="text-rose-600 dark:text-rose-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">Personeli Sil</h2>
            <p className="text-slate-500 dark:text-slate-400 text-center mb-6">
              Bu personeli silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </p>
            
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  setShowDeleteModal(false);
                  setStaffToDelete(null);
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
            
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">Personelleri Sil</h2>
            <p className="text-slate-500 dark:text-slate-400 text-center mb-6">
              {selectedStaff.size} personeli silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
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
            
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">Personelleri Sıfırla</h2>
            <p className="text-slate-500 dark:text-slate-400 text-center mb-6">
              Tüm personeli varsayılan duruma sıfırlamak istediğinizden emin misiniz? Bu işlem geri alınamaz.
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
