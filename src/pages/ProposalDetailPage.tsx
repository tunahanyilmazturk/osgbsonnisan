import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, FileCheck, Building2, Package as PackageIcon, Clock, CheckCircle, XCircle, Calendar, DollarSign, User, Phone, Mail, FileText, Printer, FileText as FileTextIcon } from 'lucide-react';
import { Button, ToastContainer } from '../components/ui';
import { Proposal, Test, initialTests, Company, initialCompanies } from '../constants/mockData';
import type { ToastType } from '../components/ui/Toast';

export default function ProposalDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [tests, setTests] = useState<Test[]>(initialTests);
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: string; type: ToastType; message: string }>>([]);
  const [activeTab, setActiveTab] = useState<'general' | 'tests' | 'price' | 'documents' | 'signature'>('general');

  useEffect(() => {
    // Load proposal
    const savedProposals = localStorage.getItem('proposals');
    if (savedProposals && id) {
      try {
        const parsedProposals = JSON.parse(savedProposals);
        const foundProposal = parsedProposals.find((p: Proposal) => p.id === id);
        setProposal(foundProposal || null);
      } catch (e) {
        console.error('Failed to parse proposals from localStorage:', e);
      }
    }

    // Load tests
    const savedTests = localStorage.getItem('tests');
    if (savedTests) {
      try {
        const parsedTests = JSON.parse(savedTests);
        setTests(parsedTests);
      } catch (e) {
        console.error('Failed to parse tests from localStorage:', e);
      }
    }

    // Load companies
    const savedCompanies = localStorage.getItem('companies');
    if (savedCompanies) {
      try {
        const parsedCompanies = JSON.parse(savedCompanies);
        setCompanies(parsedCompanies);
      } catch (e) {
        console.error('Failed to parse companies from localStorage:', e);
      }
    }
  }, [id]);

  const showToast = (type: ToastType, message: string) => {
    const toastId = Date.now().toString();
    setToasts(prev => [...prev, { id: toastId, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toastId));
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleEdit = () => {
    if (proposal) {
      navigate('/proposals/new', { state: { proposal } });
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (proposal) {
      const savedProposals = localStorage.getItem('proposals');
      if (savedProposals) {
        try {
          const parsedProposals = JSON.parse(savedProposals);
          const updatedProposals = parsedProposals.filter((p: Proposal) => p.id !== proposal.id);
          localStorage.setItem('proposals', JSON.stringify(updatedProposals));
          showToast('success', 'Teklif başarıyla silindi');
          navigate('/proposals');
        } catch (e) {
          console.error('Failed to delete proposal:', e);
          showToast('error', 'Teklif silinirken hata oluştu');
        }
      }
    }
    setShowDeleteModal(false);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!proposal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-[#0B1120] dark:via-[#0F172A] dark:to-[#0B1120] flex items-center justify-center">
        <div className="text-center">
          <FileCheck size={64} className="mx-auto mb-4 text-slate-400" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Teklif bulunamadı</h2>
          <Button onClick={() => navigate('/proposals')}>Tekliflere Dön</Button>
        </div>
      </div>
    );
  }

  const company = companies.find(c => c.id === proposal.companyId);
  const statusConfig = {
    pending: { label: 'Beklemede', icon: Clock, color: 'amber' },
    approved: { label: 'Onaylandı', icon: CheckCircle, color: 'emerald' },
    rejected: { label: 'Reddedildi', icon: XCircle, color: 'rose' },
  };
  const status = statusConfig[proposal.status as keyof typeof statusConfig] || statusConfig.pending;
  const StatusIcon = status.icon;

  const selectedTestsData = proposal.selectedTests?.map(st => {
    const test = tests.find(t => t.id === st.testId);
    return {
      ...test,
      quantity: st.quantity,
      customPrice: st.customPrice,
      totalPrice: (st.customPrice || test?.price || 0) * st.quantity,
    };
  }) || [];

  const subtotal = selectedTestsData.reduce((sum, st) => sum + st.totalPrice, 0);
  const discountAmount = subtotal * ((proposal.discountPercentage || 0) / 100);
  const afterDiscount = subtotal - discountAmount;
  const vatAmount = afterDiscount * ((proposal.vatPercentage || 10) / 100);
  const finalTotal = afterDiscount + vatAmount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-[#0B1120] dark:via-[#0F172A] dark:to-[#0B1120]">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/proposals')}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:shadow-md transition-all text-sm"
              >
                <ArrowLeft size={16} />
                <span className="font-medium">Geri Dön</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{proposal.proposalTitle || 'Teklif Detayları'}</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">ID: {proposal.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                icon={<Printer size={16} />}
                onClick={handlePrint}
                className="shrink-0"
              >
                Yazdır
              </Button>
              <Button
                variant="secondary"
                icon={<Edit size={16} />}
                onClick={handleEdit}
                className="shrink-0"
              >
                Düzenle
              </Button>
              <Button
                variant="secondary"
                icon={<Trash2 size={16} />}
                onClick={handleDelete}
                className="shrink-0 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10"
              >
                Sil
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/20 border border-slate-200/60 dark:border-slate-700/60 mb-6">
          <div className="flex overflow-x-auto">
            {[
              { id: 'general' as const, label: 'Genel Bilgiler', icon: Building2 },
              { id: 'tests' as const, label: 'Testler', icon: PackageIcon },
              { id: 'price' as const, label: 'Fiyat', icon: DollarSign },
              { id: 'documents' as const, label: 'Dokümanlar', icon: FileText },
              { id: 'signature' as const, label: 'İmza', icon: FileText },
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/10'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50 border-b-2 border-transparent'
                  }`}
                >
                  <TabIcon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Tab */}
            {activeTab === 'general' && (
              <>
                {/* Status Card */}
                <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/50 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/20 border border-slate-200/60 dark:border-slate-700/60 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Teklif Durumu</h2>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold bg-${status.color}-50 dark:bg-${status.color}-500/10 text-${status.color}-700 dark:text-${status.color}-400 border border-${status.color}-200 dark:border-${status.color}-500/20`}>
                      <StatusIcon size={16} />
                      {status.label}
                    </div>
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 space-y-1">
                    <p>Oluşturulma Tarihi: {new Date(proposal.date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    {proposal.validityDate && (
                      <p>Geçerlilik Tarihi: {new Date(proposal.validityDate).toLocaleDateString('tr-TR')}</p>
                    )}
                  </div>
                </div>

                {/* Company Card */}
                {company && (
                  <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/50 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/20 border border-slate-200/60 dark:border-slate-700/60 p-6">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-500/10 dark:to-purple-500/10 flex items-center justify-center border-2 border-indigo-200 dark:border-indigo-500/20">
                        <Building2 size={32} className="text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{company.name}</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{company.sector}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-2">Yetkili Kişi</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <User size={16} className="text-slate-400" />
                            <span className="text-slate-600 dark:text-slate-400">{company.authorizedPerson}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={16} className="text-slate-400" />
                            <span className="text-slate-600 dark:text-slate-400">{company.authorizedPersonPhone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail size={16} className="text-slate-400" />
                            <span className="text-slate-600 dark:text-slate-400 text-xs">{company.authorizedPersonEmail}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-2">Şirket Detayları</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 dark:text-slate-400">Çalışan Sayısı</span>
                            <span className="font-medium text-slate-900 dark:text-white">{company.employeeCount}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 dark:text-slate-400">Vergi No</span>
                            <span className="font-medium text-slate-900 dark:text-white">{company.taxNumber}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 dark:text-slate-400">Vergi Dairesi</span>
                            <span className="font-medium text-slate-900 dark:text-white">{company.taxOffice}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {company.address && (
                      <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-2">Adres</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{company.address}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Additional Info */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/20 border border-slate-200/60 dark:border-slate-700/60 p-6">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <FileText size={20} />
                    Ek Bilgiler
                  </h2>
                  <div className="space-y-3 text-sm">
                    {proposal.contactPerson && (
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-slate-400" />
                        <span className="text-slate-600 dark:text-slate-400">İletişim Kişisi:</span>
                        <span className="font-medium text-slate-900 dark:text-white">{proposal.contactPerson}</span>
                      </div>
                    )}
                    {proposal.paymentMethod && (
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-slate-400" />
                        <span className="text-slate-600 dark:text-slate-400">Ödeme Yöntemi:</span>
                        <span className="font-medium text-slate-900 dark:text-white">{proposal.paymentMethod}</span>
                      </div>
                    )}
                    {proposal.deliveryDate && (
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-slate-400" />
                        <span className="text-slate-600 dark:text-slate-400">Teslimat Tarihi:</span>
                        <span className="font-medium text-slate-900 dark:text-white">{new Date(proposal.deliveryDate).toLocaleDateString('tr-TR')}</span>
                      </div>
                    )}
                    {proposal.package && (
                      <div className="flex items-center gap-2">
                        <PackageIcon size={16} className="text-slate-400" />
                        <span className="text-slate-600 dark:text-slate-400">Paket:</span>
                        <span className="font-medium text-slate-900 dark:text-white">{proposal.package}</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Tests Tab */}
            {activeTab === 'tests' && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/20 border border-slate-200/60 dark:border-slate-700/60 p-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <PackageIcon size={20} />
                  Seçilen Testler
                </h2>
                {selectedTestsData.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <PackageIcon size={48} className="mx-auto mb-3 opacity-50" />
                    <p>Henüz test seçilmedi</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedTestsData.map((test, index) => (
                      <div key={test?.id || index} className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white">{test?.name || 'Bilinmeyen Test'}</span>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{test?.category || ''}</p>
                          </div>
                          <span className="font-bold text-slate-900 dark:text-white">{test?.totalPrice?.toLocaleString() || 0} ₺</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Birim Fiyat: {test?.customPrice || test?.price || 0} ₺</span>
                          <span className="text-slate-600 dark:text-slate-400">Miktar: {test?.quantity || 1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Price Tab */}
            {activeTab === 'price' && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/20 border border-slate-200/60 dark:border-slate-700/60 p-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <DollarSign size={20} />
                  Fiyat Özeti
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Ara Toplam</span>
                    <span className="font-medium text-slate-900 dark:text-white">{subtotal.toLocaleString()} ₺</span>
                  </div>
                  {proposal.discountPercentage && proposal.discountPercentage > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">İskonto (%{proposal.discountPercentage})</span>
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">-{discountAmount.toLocaleString()} ₺</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">KDV (%{proposal.vatPercentage || 10})</span>
                    <span className="font-medium text-slate-900 dark:text-white">{vatAmount.toLocaleString()} ₺</span>
                  </div>
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">Toplam</span>
                      <span className="font-bold text-xl text-indigo-600 dark:text-indigo-400">{finalTotal.toLocaleString()} ₺</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="space-y-6">
                {/* Description */}
                {proposal.description && (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/20 border border-slate-200/60 dark:border-slate-700/60 p-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <FileText size={20} />
                      Teklif Açıklaması
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{proposal.description}</p>
                  </div>
                )}

                {/* Cover Letter */}
                {proposal.coverLetter && (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/20 border border-slate-200/60 dark:border-slate-700/60 p-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <FileTextIcon size={20} />
                      Ön Yazı
                    </h2>
                    <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                      <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap font-serif leading-relaxed">{proposal.coverLetter}</p>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {proposal.notes && (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/20 border border-slate-200/60 dark:border-slate-700/60 p-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <FileText size={20} />
                      Notlar
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{proposal.notes}</p>
                  </div>
                )}

                {!proposal.notes && !proposal.coverLetter && !proposal.description && (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/20 border border-slate-200/60 dark:border-slate-700/60 p-6">
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                      <FileText size={48} className="mx-auto mb-3 opacity-50" />
                      <p>Henüz doküman eklenmedi</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Signature Tab */}
            {activeTab === 'signature' && (
              <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-700/50 dark:to-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/20 border border-slate-200/60 dark:border-slate-700/60 p-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <FileText size={20} />
                  İmza
                </h2>
                <div className="space-y-4">
                  <div className="border-b border-slate-200 dark:border-slate-600 pb-8">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Teklifi Hazırlayan</p>
                    <div className="h-16"></div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 text-center">İmza</p>
                  </div>
                  <div className="border-b border-slate-200 dark:border-slate-600 pb-8">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Kabul Eden</p>
                    <div className="h-16"></div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 text-center">İmza & Tarih</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Quick Summary (always visible) */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-2xl shadow-lg shadow-indigo-200/50 dark:shadow-black/20 border border-indigo-200/60 dark:border-indigo-500/20 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Hızlı Özet</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Durum</span>
                  <span className="font-medium text-slate-900 dark:text-white">{status.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Test Sayısı</span>
                  <span className="font-medium text-slate-900 dark:text-white">{selectedTestsData.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Toplam Tutar</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{finalTotal.toLocaleString()} ₺</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
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
              {proposal.company} firmasına gönderilen teklifi silmek istediğinizden emin misiniz?
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setShowDeleteModal(false)}
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
