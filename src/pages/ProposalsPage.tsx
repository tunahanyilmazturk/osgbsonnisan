import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, FileCheck, LayoutGrid, List, X, Building2, Package as PackageIcon, CheckCircle, XCircle, Clock, Edit, Copy } from 'lucide-react';
import { Button, ToastContainer } from '../components/ui';
import { Proposal, initialProposals, Test, initialTests } from '../constants/mockData';
import { ProposalsFilters, ProposalsPagination, ProposalsCard, ProposalsListItem } from '../components/proposals';
import type { ToastType } from '../components/ui/Toast';

export default function ProposalsPage() {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [tests, setTests] = useState<Test[]>(initialTests);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [proposalToDelete, setProposalToDelete] = useState<Proposal | null>(null);
  const [selectedProposals, setSelectedProposals] = useState<Set<string>>(new Set());
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [showBulkStatusMenu, setShowBulkStatusMenu] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: string; type: ToastType; message: string }>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 0 });

  // Load proposals and tests from localStorage on mount
  useEffect(() => {
    const savedProposals = localStorage.getItem('proposals');
    if (savedProposals) {
      try {
        const parsedProposals = JSON.parse(savedProposals);
        setProposals(parsedProposals);
      } catch (e) {
        console.error('Failed to parse proposals from localStorage:', e);
      }
    }

    const savedTests = localStorage.getItem('tests');
    if (savedTests) {
      try {
        const parsedTests = JSON.parse(savedTests);
        setTests(parsedTests);
      } catch (e) {
        console.error('Failed to parse tests from localStorage:', e);
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

  const handleAddProposal = () => {
    navigate('/proposals/new');
  };

  const handleEditProposal = (proposal: Proposal) => {
    navigate('/proposals/new', { state: { proposal } });
  };

  const handleDeleteProposal = (proposal: Proposal) => {
    setProposalToDelete(proposal);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (proposalToDelete) {
      const updatedProposals = proposals.filter(p => p.id !== proposalToDelete.id);
      setProposals(updatedProposals);
      localStorage.setItem('proposals', JSON.stringify(updatedProposals));
      showToast('success', 'Teklif başarıyla silindi');
      setShowDeleteModal(false);
      setProposalToDelete(null);
    }
  };

  const handleStatusChange = (proposal: Proposal, newStatus: 'pending' | 'approved' | 'rejected') => {
    const updatedProposals = proposals.map(p =>
      p.id === proposal.id ? { ...p, status: newStatus } : p
    );
    setProposals(updatedProposals);
    localStorage.setItem('proposals', JSON.stringify(updatedProposals));
    showToast('success', 'Durum güncellendi');
  };

  const handleSelectProposal = (id: string) => {
    setSelectedProposals(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedProposals.size === paginatedProposals.length) {
      setSelectedProposals(new Set());
    } else {
      setSelectedProposals(new Set(paginatedProposals.map(p => p.id)));
    }
  };

  const handleBulkDelete = () => {
    if (selectedProposals.size === 0) return;
    setShowBulkDeleteModal(true);
  };

  const handleBulkDeleteConfirm = () => {
    const updatedProposals = proposals.filter(p => !selectedProposals.has(p.id));
    setProposals(updatedProposals);
    localStorage.setItem('proposals', JSON.stringify(updatedProposals));
    setSelectedProposals(new Set());
    setShowBulkDeleteModal(false);
    showToast('success', `${selectedProposals.size} teklif başarıyla silindi`);
  };

  const handleBulkStatusChange = (newStatus: 'pending' | 'approved' | 'rejected') => {
    const updatedProposals = proposals.map(p =>
      selectedProposals.has(p.id) ? { ...p, status: newStatus } : p
    );
    setProposals(updatedProposals);
    localStorage.setItem('proposals', JSON.stringify(updatedProposals));
    setSelectedProposals(new Set());
    showToast('success', `${selectedProposals.size} teklif durumu güncellendi`);
  };

  const handleCopy = (proposal: Proposal) => {
    const newProposal: Proposal = {
      ...proposal,
      id: `PROP-${Date.now()}`,
      status: 'pending',
      date: new Date().toISOString(),
    };
    const updatedProposals = [...proposals, newProposal];
    setProposals(updatedProposals);
    localStorage.setItem('proposals', JSON.stringify(updatedProposals));
    showToast('success', 'Teklif kopyalandı');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedProposals(new Set());
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
    setSelectedProposals(new Set());
  };

  const statuses = ['Tümü', 'Beklemede', 'Onaylandı', 'Reddedildi'];
  const statusColors: { [key: string]: { bg: string; icon: string; darkBg: string; darkIcon: string } } = {
    'Tümü': { bg: 'bg-slate-50', icon: 'text-slate-600', darkBg: 'dark:bg-slate-500/10', darkIcon: 'text-slate-400' },
    'Beklemede': { bg: 'bg-amber-50', icon: 'text-amber-600', darkBg: 'dark:bg-amber-500/10', darkIcon: 'text-amber-400' },
    'Onaylandı': { bg: 'bg-emerald-50', icon: 'text-emerald-600', darkBg: 'dark:bg-emerald-500/10', darkIcon: 'text-emerald-400' },
    'Reddedildi': { bg: 'bg-rose-50', icon: 'text-rose-600', darkBg: 'dark:bg-rose-500/10', darkIcon: 'text-rose-400' },
  };

  const statusIcons: { [key: string]: React.ReactNode } = {
    'pending': <Clock size={20} />,
    'approved': <CheckCircle size={20} />,
    'rejected': <XCircle size={20} />,
  };

  // Filter and sort proposals
  const filteredProposals = proposals
    .filter(proposal => 
      (proposal.company?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      ((proposal as any).selectedTests?.length > 0 && `${(proposal as any).selectedTests.length} test`.includes(searchQuery.toLowerCase()))
    )
    .filter(proposal => 
      selectedStatus === 'all' || proposal.status === selectedStatus
    )
    .filter(proposal => {
      if (!dateRange.start && !dateRange.end) return true;
      const proposalDate = new Date(proposal.date);
      if (dateRange.start) {
        const startDate = new Date(dateRange.start);
        startDate.setHours(0, 0, 0, 0);
        if (proposalDate < startDate) return false;
      }
      if (dateRange.end) {
        const endDate = new Date(dateRange.end);
        endDate.setHours(23, 59, 59, 999);
        if (proposalDate > endDate) return false;
      }
      return true;
    })
    .filter(proposal => {
      const price = proposal.totalPrice || 0;
      if (priceRange.min > 0 && price < priceRange.min) return false;
      if (priceRange.max > 0 && price > priceRange.max) return false;
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'price':
          comparison = (a.totalPrice || 0) - (b.totalPrice || 0);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status, 'tr');
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Pagination
  const totalPages = Math.ceil(filteredProposals.length / itemsPerPage);
  const paginatedProposals = filteredProposals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when search or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy]);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 dark:from-white dark:via-indigo-200 dark:to-purple-200 pb-1">
            Teklifler
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">
            Firmalara gönderilen test teklifleri
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedProposals.size > 0 && (
            <div className="relative">
              <Button
                variant="secondary"
                icon={<Edit size={16} />}
                onClick={() => setShowBulkStatusMenu(!showBulkStatusMenu)}
                className="shrink-0"
              >
                Durum Değiştir
              </Button>
              {showBulkStatusMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-10">
                  <button
                    onClick={() => {
                      handleBulkStatusChange('pending');
                      setShowBulkStatusMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors"
                  >
                    <Clock size={14} className="text-amber-600 dark:text-amber-400" />
                    Beklemede
                  </button>
                  <button
                    onClick={() => {
                      handleBulkStatusChange('approved');
                      setShowBulkStatusMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors"
                  >
                    <CheckCircle size={14} className="text-emerald-600 dark:text-emerald-400" />
                    Onaylandı
                  </button>
                  <button
                    onClick={() => {
                      handleBulkStatusChange('rejected');
                      setShowBulkStatusMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors"
                  >
                    <XCircle size={14} className="text-rose-600 dark:text-rose-400" />
                    Reddedildi
                  </button>
                </div>
              )}
            </div>
          )}
          <Button
            variant="secondary"
            icon={<Trash2 size={16} />}
            onClick={() => setShowBulkDeleteModal(true)}
            disabled={selectedProposals.size === 0}
            className="shrink-0"
          >
            Toplu Sil
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
            onClick={handleAddProposal}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/20 shrink-0"
          >
            Yeni Teklif
          </Button>
        </div>
      </div>

      {/* Filters */}
      <ProposalsFilters
        searchQuery={searchQuery}
        onSearch={(value) => setSearchQuery(value)}
        selectedStatus={selectedStatus}
        statuses={statuses}
        statusColors={statusColors}
        onFilter={(value) => setSelectedStatus(value as 'all' | 'pending' | 'approved' | 'rejected')}
        sortBy={sortBy}
        onSortChange={(value) => setSortBy(value as 'date' | 'price' | 'status')}
        sortOrder={sortOrder}
        onSortOrderChange={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        showAdvancedFilters={showAdvancedFilters}
        onToggleAdvancedFilters={() => setShowAdvancedFilters(!showAdvancedFilters)}
      />

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="bg-gradient-to-br from-white/95 to-white/90 dark:from-slate-800/95 dark:to-slate-800/90 backdrop-blur-xl rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)] border border-slate-200/60 dark:border-slate-700/60 p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tarih Aralığı</label>
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
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Fiyat Aralığı (₺)</label>
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
          </div>
          <div className="flex justify-end mt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setDateRange({ start: '', end: '' });
                setPriceRange({ min: 0, max: 0 });
              }}
            >
              Filtreleri Temizle
            </Button>
          </div>
        </div>
      )}

      {filteredProposals.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-500/10 dark:to-purple-500/10 flex items-center justify-center">
            <FileCheck size={40} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {proposals.length === 0 ? 'Henüz teklif yok' : 'Sonuç bulunamadı'}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
            {proposals.length === 0 
              ? 'İlk teklifinizi oluşturmak için "Yeni Teklif" butonuna tıklayın' 
              : 'Arama kriterlerinize uygun teklif bulunamadı. Filtreleri temizleyerek tekrar deneyin.'}
          </p>
          {proposals.length === 0 && (
            <Button
              variant="primary"
              icon={<Plus size={16} />}
              onClick={handleAddProposal}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/20"
            >
              Yeni Teklif Oluştur
            </Button>
          )}
          {proposals.length > 0 && filteredProposals.length === 0 && (
            <Button
              variant="secondary"
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('all');
              }}
            >
              Filtreleri Temizle
            </Button>
          )}
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedProposals.map((proposal, index) => (
                <ProposalsCard
                  key={proposal.id}
                  proposal={proposal}
                  statusColors={statusColors}
                  statusIcons={statusIcons}
                  selectedProposals={selectedProposals}
                  onEdit={handleEditProposal}
                  onDelete={(id) => {
                    const prop = proposals.find(p => p.id === id);
                    if (prop) handleDeleteProposal(prop);
                  }}
                  onCopy={handleCopy}
                  onSelect={handleSelectProposal}
                  onStatusChange={handleStatusChange}
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
                          checked={selectedProposals.size === paginatedProposals.length && paginatedProposals.length > 0}
                          onChange={handleSelectAll}
                          className="w-4 h-4 rounded border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-0"
                        />
                      </th>
                      <th className="text-left p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Firma</th>
                      <th className="text-left p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Test Sayısı</th>
                      <th className="text-left p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tarih</th>
                      <th className="text-right p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fiyat</th>
                      <th className="text-center p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Durum</th>
                      <th className="text-center p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProposals.map((proposal, index) => (
                      <ProposalsListItem
                        key={proposal.id}
                        proposal={proposal}
                        tests={tests}
                        statusColors={statusColors}
                        statusIcons={statusIcons}
                        selectedProposals={selectedProposals}
                        onEdit={handleEditProposal}
                        onDelete={(id) => {
                          const prop = proposals.find(p => p.id === id);
                          if (prop) handleDeleteProposal(prop);
                        }}
                        onCopy={handleCopy}
                        onSelect={handleSelectProposal}
                        onStatusChange={handleStatusChange}
                        index={index}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && proposalToDelete && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-500/10 flex items-center justify-center">
                    <Trash2 size={24} className="text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Teklifi Sil</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Bu işlem geri alınamaz</p>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  <span className="font-semibold text-slate-900 dark:text-white">{proposalToDelete.company}</span> firmasına gönderilen teklifi silmek istediğinizden emin misiniz?
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => {
                      setShowDeleteModal(false);
                      setProposalToDelete(null);
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
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-500/10 flex items-center justify-center">
                    <Trash2 size={24} className="text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Teklifleri Sil</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Bu işlem geri alınamaz</p>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {selectedProposals.size} teklifi silmek istediğinizden emin misiniz?
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
        </>
      )}

      {/* Pagination */}
      <ProposalsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalProposals={filteredProposals.length}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
