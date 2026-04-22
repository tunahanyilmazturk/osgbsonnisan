import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, FileCheck, Building2, Package as PackageIcon, ChevronRight, Circle, CheckCircle2, Plus, Clock, Search } from 'lucide-react';
import { Button, Input } from '../components/ui';
import { Proposal, initialProposals, Test, initialTests } from '../constants/mockData';
import { Company, initialCompanies } from '../constants/mockData';
import { TestPackage } from '../constants/mockData';

type Step = 'company' | 'package' | 'details' | 'coverletter' | 'review';

export default function ProposalFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState<Step>('company');
  const [formData, setFormData] = useState({
    company: '',
    companyId: '',
    package: '',
    packageId: '',
    totalPrice: 0,
    discountPercentage: 0,
    vatPercentage: 10,
    finalPrice: 0,
    validityDate: '',
    notes: '',
    contactPerson: '',
    selectedTests: [] as string[],
    proposalTitle: '',
    paymentMethod: '',
    deliveryDate: '',
  });

  const [companySearch, setCompanySearch] = useState('');
  const [companySectorFilter, setCompanySectorFilter] = useState('Tümü');
  const [testTab, setTestTab] = useState<'packages' | 'tests'>('tests');
  const [testSearch, setTestSearch] = useState('');
  const [testCategoryFilter, setTestCategoryFilter] = useState('Tümü');
  const [selectedTests, setSelectedTests] = useState<{ testId: string; quantity: number; customPrice?: number }[]>([]);
  const [selectedCoverLetter, setSelectedCoverLetter] = useState('professional');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Load companies, packages, and tests from localStorage
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [packages, setPackages] = useState<TestPackage[]>([]);
  const [tests, setTests] = useState<Test[]>(initialTests);

  useEffect(() => {
    const savedCompanies = localStorage.getItem('companies');
    if (savedCompanies) {
      try {
        const parsedCompanies = JSON.parse(savedCompanies);
        setCompanies(parsedCompanies);
      } catch (e) {
        console.error('Error loading companies:', e);
      }
    }

    const savedPackages = localStorage.getItem('packages');
    if (savedPackages) {
      try {
        const parsedPackages = JSON.parse(savedPackages);
        setPackages(parsedPackages);
      } catch (e) {
        console.error('Error loading packages:', e);
      }
    }

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

  const updateTotalPrice = (testSelections: { testId: string; quantity: number; customPrice?: number }[]) => {
    const totalPrice = testSelections.reduce((sum, st) => {
      const test = tests.find(t => t.id === st.testId);
      const price = st.customPrice !== undefined ? st.customPrice : (test?.price || 0);
      return sum + (price * st.quantity);
    }, 0);
    setFormData({ ...formData, totalPrice, selectedTests: testSelections.map(st => st.testId) });
  };

  const generateProposalTitles = () => {
    const company = companies.find(c => c.id === formData.companyId);
    if (!company) return [];
    
    const date = new Date();
    const year = date.getFullYear();
    const month = date.toLocaleString('tr-TR', { month: 'long' });
    
    return [
      `${company.name} - ${year} ${month} Periyodik Muayene Teklifi`,
      `${company.name} - İşe Giriş Muayene Teklifi - ${year}`
    ];
  };

  const generateCoverLetter = (template: string) => {
    const company = companies.find(c => c.id === formData.companyId);
    if (!company) return '';

    const date = new Date().toLocaleDateString('tr-TR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const totalPrice = ((formData.totalPrice - (formData.totalPrice * formData.discountPercentage / 100)) * (1 + formData.vatPercentage / 100)).toLocaleString();

    const templates: Record<string, string> = {
      professional: `Sayın ${company.authorizedPerson},

${company.name} firması için hazırlamış olduğumuz iş sağlığı ve güvenliği hizmetleri teklifimizi sunmaktan memnuniyet duyarız.

${company.employeeCount} personel çalışma kapasitesine sahip kurumunuzun ihtiyaçları doğrultusunda, uluslararası standartlara uygun, profesyonel sağlık tarama hizmetleri sunuyoruz. Uzman kadromuz ve modern ekipmanlarımız ile çalışanlarınızın sağlığını en üst düzeyde korumayı hedefliyoruz.

Teklifimiz kapsamında sunulan hizmetler:
• Periyodik sağlık taramaları
• İşe giriş muayeneleri
• Laboratuvar analizleri
• Radyolojik incelemeler
• Özel sağlık raporları

Toplam teklif tutarı: ${totalPrice} ₺ (KDV dahil)

Teklifimizin geçerlilik süresi: ${formData.validityDate || '30 gün'}dür.

Sorularınız ve detaylar için iletişime açık olduğumuzu belirtir, iş birliğimize başlamayı umarız.

Saygılarımla,

[Şirket Adınız]
[İletişim Bilgileri]`,

      friendly: `Merhaba ${company.authorizedPerson},

${company.name} ekibi olarak, kurumunuz için özel olarak hazırladığımız sağlık hizmetleri teklifimizi paylaşmaktan mutluluk duyuyoruz.

${company.employeeCount} değerli çalışanın sağlığı ve güvenliği bizim için önemli. Bu nedenle, en güncel teknolojiler ve deneyimli sağlık profesyonelleri ile kapsamlı sağlık tarama hizmetleri sunuyoruz.

Hizmetlerimiz şunları içeriyor:
• Kapsamlı sağlık taramaları
• İşe giriş muayeneleri
• Detaylı laboratuvar testleri
• Gelişmiş görüntüleme hizmetleri
• Kişiselleştirilmiş sağlık raporları

Toplam yatırım: ${totalPrice} ₺ (KDV dahil)

Teklifimiz ${formData.validityDate || '30 gün'} geçerlidir.

Her türlü sorunuz için bize ulaşabilirsiniz. Sağlık ve başarı dolu günler dileriz.

Sevgiyle,

[Şirket Adınız]`,

      formal: `Sayın ${company.authorizedPerson},

${company.name} şirketi adına, iş sağlığı ve güvenliği hizmetleri ile ilgili teklifimizi sunarız.

${company.employeeCount} çalışan istihdam eden kurumunuzun mevzuata uygun sağlık hizmetleri ihtiyacını karşılamak amacıyla, yetkili ve sertifikalı sağlık kuruluşumuz ile hizmet vermekteyiz.

Sunulan hizmet kapsamı:
1. Periyodik sağlık muayeneleri
2. İşe giriş sağlık kontrolleri
3. Biyokimyasal analizler
4. Radyolojik tetkikler
5. Sağlık raporu düzenlemeleri

Teklif bedeli: ${totalPrice} ₺ (KDV dahil)
Geçerlilik tarihi: ${formData.validityDate || '30 gün'}

Bilgilerinize sunulur.

Saygılarımızla,

[Şirket Adınız]
[Yetkili Kişi]`,

      concise: `Sayın ${company.authorizedPerson},

${company.name} için sağlık tarama hizmetleri teklifimiz aşağıdadır:

• ${company.employeeCount} personel için kapsamlı sağlık taraması
• Laboratuvar ve radyoloji hizmetleri
• Profesyonel sağlık raporları

Toplam: ${totalPrice} ₺ (KDV dahil)
Geçerlilik: ${formData.validityDate || '30 gün'}

Detaylar için iletişime geçebilirsiniz.

Saygılar,

[Şirket Adınız]`
    };

    return templates[template] || templates.professional;
  };

  // Load proposal data if editing
  useEffect(() => {
    if (location.state?.proposal) {
      const proposal = location.state.proposal;
      setFormData({
        company: proposal.company,
        companyId: proposal.companyId,
        package: proposal.package,
        packageId: proposal.packageId,
        totalPrice: proposal.totalPrice,
        discountPercentage: proposal.discountPercentage || 0,
        vatPercentage: (proposal as any).vatPercentage || 10,
        finalPrice: proposal.finalPrice || proposal.totalPrice,
        validityDate: proposal.validityDate || '',
        notes: proposal.notes || '',
        contactPerson: proposal.contactPerson || '',
        selectedTests: (proposal as any).selectedTests || [],
        proposalTitle: (proposal as any).proposalTitle || '',
        paymentMethod: (proposal as any).paymentMethod || '',
        deliveryDate: (proposal as any).deliveryDate || '',
      });
    } else {
      // Set default validity date to today if creating new proposal
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, validityDate: today }));
    }
  }, [location.state]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleNextStep = () => {
    if (currentStep === 'company') setCurrentStep('package');
    else if (currentStep === 'package') setCurrentStep('details');
    else if (currentStep === 'details') setCurrentStep('coverletter');
    else if (currentStep === 'coverletter') setCurrentStep('review');
  };

  const handlePreviousStep = () => {
    if (currentStep === 'package') setCurrentStep('company');
    else if (currentStep === 'details') setCurrentStep('package');
    else if (currentStep === 'coverletter') setCurrentStep('details');
    else if (currentStep === 'review') setCurrentStep('coverletter');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company || selectedTests.length === 0) {
      setNotification({ type: 'error', message: 'Lütfen bir firma ve test/paket seçin.' });
      return;
    }

    const finalPrice = formData.discountPercentage > 0 
      ? formData.totalPrice - (formData.totalPrice * formData.discountPercentage / 100)
      : formData.totalPrice;

    const newProposal: Proposal = {
      id: location.state?.proposal?.id || `PROP-${Date.now()}`,
      company: formData.company,
      companyId: formData.companyId,
      package: formData.package,
      packageId: formData.packageId,
      status: 'pending',
      date: new Date().toISOString(),
      totalPrice: formData.totalPrice,
      discountPercentage: formData.discountPercentage,
      finalPrice: finalPrice,
      validityDate: formData.validityDate,
      notes: formData.notes,
      contactPerson: formData.contactPerson,
    };

    // Save to localStorage
    const existingProposals = JSON.parse(localStorage.getItem('proposals') || '[]');
    if (location.state?.proposal) {
      const updatedProposals = existingProposals.map((p: Proposal) =>
        p.id === newProposal.id ? newProposal : p
      );
      localStorage.setItem('proposals', JSON.stringify(updatedProposals));
    } else {
      localStorage.setItem('proposals', JSON.stringify([...existingProposals, newProposal]));
    }

    navigate('/proposals');
  };

  const steps = [
    { id: 'company', title: 'Firma Seçimi', icon: Building2 },
    { id: 'package', title: 'Paket Seçimi', icon: PackageIcon },
    { id: 'details', title: 'Teklif Detayları', icon: FileCheck },
    { id: 'coverletter', title: 'Ön Yazı', icon: FileCheck },
    { id: 'review', title: 'Önizleme', icon: FileCheck },
  ] as const;

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-[#0B1120] dark:via-[#0F172A] dark:to-[#0B1120] overflow-hidden">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
          notification.type === 'error' 
            ? 'bg-red-500 text-white' 
            : 'bg-emerald-500 text-white'
        }`}>
          <p className="text-sm font-medium">{notification.message}</p>
        </div>
      )}
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 p-5 flex flex-col h-full">
          <div className="mb-4">
            <button
              onClick={() => navigate('/proposals')}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:shadow-md transition-all text-sm"
            >
              <ArrowLeft size={16} />
              <span className="font-medium">Geri Dön</span>
            </button>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <FileCheck size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 dark:text-white">Yeni Teklif</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Adım adım oluşturun</p>
            </div>
          </div>

          <nav className="space-y-1 flex-1 overflow-y-auto">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
              const isCurrent = step.id === currentStep;
              const isUpcoming = steps.findIndex(s => s.id === currentStep) < index;

              return (
                <button
                  key={step.id}
                  onClick={() => {
                    if (isCompleted || isCurrent) {
                      setCurrentStep(step.id as Step);
                    }
                  }}
                  disabled={isUpcoming}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                    isCurrent
                      ? 'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 text-indigo-700 dark:text-indigo-300 border-2 border-indigo-500 dark:border-indigo-400 shadow-md shadow-indigo-500/20'
                      : isCompleted
                      ? 'bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600'
                      : 'bg-slate-50 dark:bg-slate-700/30 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-600 cursor-not-allowed opacity-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-md'
                      : isCompleted
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                      : 'bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-400'
                  }`}>
                    {isCompleted ? <CheckCircle2 size={16} /> : <StepIcon size={16} />}
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-xs font-semibold">{step.title}</span>
                  </div>
                  {isCurrent && <ChevronRight size={16} className="text-indigo-500" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto py-5 lg:py-6 px-4 lg:px-6">
            <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-4">
            {/* Step 1: Company Selection */}
            {currentStep === 'company' && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/20 border border-slate-200/60 dark:border-slate-700/60 p-5">
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Firma Seçimi</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Teklif göndermek istediğiniz firmayı seçin</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Left Panel - Company List */}
                  <div className="space-y-3">
                    {/* Search and Filter */}
                    <div className="space-y-2">
                      <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={companySearch}
                          onChange={(e) => setCompanySearch(e.target.value)}
                          placeholder="Firma ara..."
                          className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['Tümü', ...Array.from(new Set(companies.map(c => c.sector)))].map((sector) => (
                          <button
                            key={sector}
                            type="button"
                            onClick={() => setCompanySectorFilter(sector)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              companySectorFilter === sector
                                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                            }`}
                          >
                            {sector}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Company List */}
                    <div className="space-y-2 max-h-[500px] overflow-y-auto">
                      {companies
                        .filter(company => {
                          const matchesSearch = company.name.toLowerCase().includes(companySearch.toLowerCase()) ||
                                             company.sector.toLowerCase().includes(companySearch.toLowerCase());
                          const matchesSector = companySectorFilter === 'Tümü' || company.sector === companySectorFilter;
                          return matchesSearch && matchesSector;
                        })
                        .map((company) => (
                        <button
                          key={company.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, company: company.name, companyId: company.id })}
                          className={`w-full p-3 rounded-xl border-2 transition-all text-left hover:shadow-md ${
                            formData.companyId === company.id
                              ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 shadow-md shadow-indigo-500/20'
                              : 'border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 bg-white dark:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                              formData.companyId === company.id
                                ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white'
                                : 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-110'
                            }`}>
                              <Building2 size={16} />
                            </div>
                            <div className="flex-1">
                              <span className="font-semibold text-sm text-slate-900 dark:text-white block">{company.name}</span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">{company.sector}</span>
                            </div>
                          </div>
                          {formData.companyId === company.id && (
                            <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold text-xs">
                              <CheckCircle2 size={14} />
                              Seçildi
                            </div>
                          )}
                        </button>
                      ))}
                      {companies.filter(company => {
                        const matchesSearch = company.name.toLowerCase().includes(companySearch.toLowerCase()) ||
                                           company.sector.toLowerCase().includes(companySearch.toLowerCase());
                        const matchesSector = companySectorFilter === 'Tümü' || company.sector === companySectorFilter;
                        return matchesSearch && matchesSector;
                      }).length === 0 && (
                        <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                          <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                            <Search size={28} className="opacity-50" />
                          </div>
                          <p className="text-sm font-medium mb-2">Firma bulunamadı</p>
                          <button
                            type="button"
                            onClick={() => navigate('/companies/add')}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold transition-colors text-sm"
                          >
                            <Plus size={16} />
                            Firma Ekle
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Panel - Company Details */}
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-700/30 rounded-xl border border-slate-200 dark:border-slate-600 p-4">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Firma Bilgileri</h3>
                    {!formData.companyId ? (
                      <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                        <Building2 size={40} className="mx-auto mb-3 opacity-50" />
                        <p className="text-sm">Henüz firma seçilmedi</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {(() => {
                          const selectedCompany = companies.find(c => c.id === formData.companyId);
                          if (!selectedCompany) return null;
                          return (
                            <>
                              <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                                <h4 className="font-bold text-base text-slate-900 dark:text-white mb-3">{selectedCompany.name}</h4>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500 dark:text-slate-400">Sektör</span>
                                    <span className="font-medium text-slate-900 dark:text-white">{selectedCompany.sector}</span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500 dark:text-slate-400">Çalışan Sayısı</span>
                                    <span className="font-medium text-slate-900 dark:text-white">{selectedCompany.employeeCount}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                                <h5 className="font-semibold text-sm text-slate-900 dark:text-white mb-3">Yetkili Kişi</h5>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500 dark:text-slate-400">Ad Soyad</span>
                                    <span className="font-medium text-slate-900 dark:text-white">{selectedCompany.authorizedPerson}</span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500 dark:text-slate-400">Telefon</span>
                                    <span className="font-medium text-slate-900 dark:text-white">{selectedCompany.authorizedPersonPhone}</span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500 dark:text-slate-400">E-posta</span>
                                    <span className="font-medium text-slate-900 dark:text-white text-xs">{selectedCompany.authorizedPersonEmail}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                                <h5 className="font-semibold text-sm text-slate-900 dark:text-white mb-3">Vergi Bilgileri</h5>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500 dark:text-slate-400">Vergi No</span>
                                    <span className="font-medium text-slate-900 dark:text-white">{selectedCompany.taxNumber}</span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500 dark:text-slate-400">Vergi Dairesi</span>
                                    <span className="font-medium text-slate-900 dark:text-white">{selectedCompany.taxOffice}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                                <h5 className="font-semibold text-sm text-slate-900 dark:text-white mb-2">Adres</h5>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{selectedCompany.address}</p>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Package Selection */}
            {currentStep === 'package' && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/20 border border-slate-200/60 dark:border-slate-700/60 p-5">
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Test Seçimi</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Paket veya test seçin, sağ taraftan düzenleyin</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Left Panel - Tabs */}
                  <div className="space-y-3">
                    {/* Tabs */}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setTestTab('tests')}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          testTab === 'tests'
                            ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                        }`}
                      >
                        Testler
                      </button>
                      <button
                        type="button"
                        onClick={() => setTestTab('packages')}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          testTab === 'packages'
                            ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                        }`}
                      >
                        Paketler
                      </button>
                    </div>

                    {/* Packages Tab */}
                    {testTab === 'packages' && (
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {packages.map((pkg) => {
                          const selectedCompany = companies.find(c => c.id === formData.companyId);
                          const defaultQuantity = selectedCompany?.employeeCount || 1;
                          return (
                            <button
                              key={pkg.id}
                              type="button"
                              onClick={() => {
                                const newTests = pkg.testIds.map(testId => ({
                                  testId,
                                  quantity: defaultQuantity,
                                  customPrice: pkg.testPrices[testId] || undefined
                                }));
                                setSelectedTests(newTests);
                                // Calculate total price based on individual test prices * employee count
                                const totalPrice = newTests.reduce((sum, st) => {
                                  const test = tests.find(t => t.id === st.testId);
                                  const price = st.customPrice || test?.price || 0;
                                  return sum + (price * st.quantity);
                                }, 0);
                                setFormData({ 
                                  ...formData, 
                                  package: pkg.name, 
                                  packageId: pkg.id, 
                                  totalPrice,
                                  selectedTests: pkg.testIds 
                                });
                              }}
                              className="w-full p-3 rounded-xl border-2 transition-all text-left hover:shadow-md border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 bg-white dark:bg-slate-800"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
                                  <PackageIcon size={16} className="text-purple-600 dark:text-purple-400" />
                                </div>
                                <div className="flex-1">
                                  <span className="font-semibold text-sm text-slate-900 dark:text-white block">{pkg.name}</span>
                                  <span className="text-xs text-slate-500 dark:text-slate-400">{pkg.testIds.length} test</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-slate-900 dark:text-white">{pkg.totalPrice.toLocaleString()} ₺</span>
                                <Plus size={16} className="text-indigo-600 dark:text-indigo-400" />
                              </div>
                            </button>
                          );
                        })}
                        {packages.length === 0 && (
                          <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                            <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                              <PackageIcon size={28} className="opacity-50" />
                            </div>
                            <p className="text-sm font-medium mb-2">Henüz paket oluşturulmadı</p>
                            <button
                              type="button"
                              onClick={() => navigate('/tests/package/new')}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold transition-colors text-sm"
                            >
                              <Plus size={16} />
                              Paket Oluştur
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tests Tab */}
                    {testTab === 'tests' && (
                      <div className="space-y-2">
                        {/* Search and Filter */}
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              value={testSearch}
                              onChange={(e) => setTestSearch(e.target.value)}
                              placeholder="Test ara..."
                              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                            />
                          </div>
                          <select
                            value={testCategoryFilter}
                            onChange={(e) => setTestCategoryFilter(e.target.value)}
                            className="px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                          >
                            {['Tümü', ...Array.from(new Set(tests.map(t => t.category)))].map((category) => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        </div>

                        {/* Test List */}
                        <div className="space-y-3 max-h-[500px] min-h-[500px] overflow-y-auto">
                          {tests
                            .filter(test => {
                              const matchesSearch = test.name.toLowerCase().includes(testSearch.toLowerCase()) ||
                                                 test.category.toLowerCase().includes(testSearch.toLowerCase());
                              const matchesCategory = testCategoryFilter === 'Tümü' || test.category === testCategoryFilter;
                              const notSelected = !selectedTests.find(st => st.testId === test.id);
                              return matchesSearch && matchesCategory && notSelected;
                            })
                            .map((test) => {
                              const selectedCompany = companies.find(c => c.id === formData.companyId);
                              const defaultQuantity = selectedCompany?.employeeCount || 1;
                              return (
                                <button
                                  key={test.id}
                                  type="button"
                                  onClick={() => {
                                    if (!selectedTests.find(st => st.testId === test.id)) {
                                      setSelectedTests([...selectedTests, { testId: test.id, quantity: defaultQuantity }]);
                                      updateTotalPrice([...selectedTests, { testId: test.id, quantity: defaultQuantity }]);
                                    }
                                  }}
                                  className="w-full p-3 rounded-lg border-2 transition-all text-left flex items-center justify-between border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 bg-white dark:bg-slate-800"
                                >
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
                                      <Plus size={16} className="text-slate-500 dark:text-slate-400" />
                                    </div>
                                    <div>
                                      <span className="font-semibold text-sm text-slate-900 dark:text-white block">{test.name}</span>
                                      <span className="text-xs text-slate-500 dark:text-slate-400">{test.category}</span>
                                    </div>
                                  </div>
                                  <span className="text-sm font-bold text-slate-900 dark:text-white">{test.price} ₺</span>
                                </button>
                              );
                            })}
                          {tests.filter(test => {
                            const matchesSearch = test.name.toLowerCase().includes(testSearch.toLowerCase()) ||
                                               test.category.toLowerCase().includes(testSearch.toLowerCase());
                            const matchesCategory = testCategoryFilter === 'Tümü' || test.category === testCategoryFilter;
                            const notSelected = !selectedTests.find(st => st.testId === test.id);
                            return matchesSearch && matchesCategory && notSelected;
                          }).length === 0 && (
                            <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-sm">
                              Tüm testler seçildi veya uygun test bulunamadı
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Panel - Selected Tests */}
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-700/30 rounded-xl border border-slate-200 dark:border-slate-600 p-4">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Seçilen Testler</h3>
                    {selectedTests.length === 0 ? (
                      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                        <PackageIcon size={40} className="mx-auto mb-3 opacity-50" />
                        <p className="text-sm">Henüz test seçilmedi</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[450px] overflow-y-auto">
                        {selectedTests.map((selectedTest, index) => {
                          const test = tests.find(t => t.id === selectedTest.testId);
                          const testName = test?.name || `Test ID: ${selectedTest.testId}`;
                          const testPrice = selectedTest.customPrice || test?.price || 0;
                          return (
                            <div key={selectedTest.testId} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-sm text-slate-900 dark:text-white">{testName}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newSelected = selectedTests.filter((_, i) => i !== index);
                                    setSelectedTests(newSelected);
                                    updateTotalPrice(newSelected);
                                  }}
                                  className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                                >
                                  <Plus size={16} className="rotate-45" />
                                </button>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Miktar</label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={selectedTest.quantity}
                                    onChange={(e) => {
                                      const newSelected = [...selectedTests];
                                      newSelected[index].quantity = Math.max(1, Number(e.target.value));
                                      setSelectedTests(newSelected);
                                      updateTotalPrice(newSelected);
                                    }}
                                    className="w-full px-2 py-1.5 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Fiyat (₺)</label>
                                  <input
                                    type="number"
                                    min="0"
                                    value={selectedTest.customPrice || testPrice}
                                    onChange={(e) => {
                                      const newSelected = [...selectedTests];
                                      newSelected[index].customPrice = Number(e.target.value) || undefined;
                                      setSelectedTests(newSelected);
                                      updateTotalPrice(newSelected);
                                    }}
                                    className="w-full px-2 py-1.5 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                                  />
                                </div>
                              </div>
                              <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-600 flex justify-between">
                                <span className="text-xs text-slate-500 dark:text-slate-400">Toplam</span>
                                <span className="text-sm font-bold text-slate-900 dark:text-white">
                                  {(testPrice * selectedTest.quantity).toLocaleString()} ₺
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {selectedTests.length > 0 && (
                      <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg border border-indigo-200 dark:border-indigo-500/20">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Genel Toplam</span>
                          <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                            {formData.totalPrice.toLocaleString()} ₺
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Details */}
            {currentStep === 'details' && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/20 border border-slate-200/60 dark:border-slate-700/60 p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Teklif Detayları</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">İndirim, geçerlilik süresi ve ek bilgileri belirleyin</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Left Column - Main Settings */}
                  <div className="lg:col-span-2 space-y-4">
                    {/* Proposal Title */}
                    <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-500/10 dark:to-cyan-500/10 rounded-xl border border-blue-200 dark:border-blue-500/20">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">Teklif Başlığı</h3>
                      <div className="space-y-3">
                        {generateProposalTitles().map((title, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setFormData({ ...formData, proposalTitle: title })}
                            className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                              formData.proposalTitle === title
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                                : 'border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 bg-white dark:bg-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                formData.proposalTitle === title
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-400'
                              }`}>
                                {formData.proposalTitle === title && <CheckCircle2 size={12} />}
                              </div>
                              <span className="text-sm font-medium text-slate-900 dark:text-white">{title}</span>
                            </div>
                          </button>
                        ))}
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.proposalTitle}
                            onChange={(e) => setFormData({ ...formData, proposalTitle: e.target.value })}
                            placeholder="Özel başlık girin..."
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Discount Section */}
                    <div className="p-3 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-xl border border-indigo-200 dark:border-indigo-500/20">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">KDV ve İndirim</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">KDV Oranı (%)</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={formData.vatPercentage}
                            onChange={(e) => {
                              const vat = Math.min(100, Math.max(0, Number(e.target.value)));
                              setFormData({ 
                                ...formData, 
                                vatPercentage: vat,
                              });
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                            placeholder="10"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">İndirim Oranı (%)</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={formData.discountPercentage}
                            onChange={(e) => {
                              const discount = Math.min(100, Math.max(0, Number(e.target.value)));
                              setFormData({ 
                                ...formData, 
                                discountPercentage: discount,
                              });
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div className="mt-3 p-2 bg-slate-50 dark:bg-slate-600 rounded-lg border border-slate-200 dark:border-slate-600">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Ara Toplam (KDV'siz)</span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {formData.totalPrice.toLocaleString()} ₺
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm mt-1">
                          <span className="text-slate-600 dark:text-slate-400">KDV ({formData.vatPercentage}%)</span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {((formData.totalPrice - (formData.totalPrice * formData.discountPercentage / 100)) * formData.vatPercentage / 100).toLocaleString()} ₺
                          </span>
                        </div>
                        {formData.discountPercentage > 0 && (
                          <div className="flex justify-between items-center text-sm mt-1 text-emerald-600 dark:text-emerald-400">
                            <span>İndirim ({formData.discountPercentage}%)</span>
                            <span className="font-bold">
                              -{(formData.totalPrice * formData.discountPercentage / 100).toLocaleString()} ₺
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between items-center text-sm mt-2 pt-2 border-t border-slate-200 dark:border-slate-600">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Genel Toplam (KDV dahil)</span>
                          <span className="font-bold text-lg text-indigo-600 dark:text-indigo-400">
                            {((formData.totalPrice - (formData.totalPrice * formData.discountPercentage / 100)) * (1 + formData.vatPercentage / 100)).toLocaleString()} ₺
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Additional Settings */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Teklif Geçerlilik Tarihi</label>
                      <div className="space-y-2">
                        <input
                          type="date"
                          value={formData.validityDate}
                          onChange={(e) => setFormData({ ...formData, validityDate: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                        />
                        <div className="flex flex-wrap gap-2">
                          {[15, 30, 45, 60, 90].map((days) => {
                            const date = new Date();
                            date.setDate(date.getDate() + days);
                            const dateStr = date.toISOString().split('T')[0];
                            return (
                              <button
                                key={days}
                                type="button"
                                onClick={() => setFormData({ ...formData, validityDate: dateStr })}
                                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all"
                              >
                                {days} gün
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Price Summary */}
                  <div className="space-y-3">
                    <div className="p-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 rounded-xl border border-amber-200 dark:border-amber-500/20 sticky top-6">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Fiyat Özeti</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600 dark:text-slate-400">Test Fiyatı</span>
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {formData.totalPrice.toLocaleString()} ₺
                          </span>
                        </div>
                        {formData.discountPercentage > 0 && (
                          <>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600 dark:text-slate-400">İndirim ({formData.discountPercentage}%)</span>
                              <span className="text-sm font-bold text-red-600 dark:text-red-400">
                                -{(formData.totalPrice * formData.discountPercentage / 100).toLocaleString()} ₺
                              </span>
                            </div>
                            <div className="border-t border-amber-200 dark:border-amber-500/20 pt-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold text-slate-900 dark:text-white">İndirimli Fiyat</span>
                                <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                                  {(formData.totalPrice - (formData.totalPrice * formData.discountPercentage / 100)).toLocaleString()} ₺
                                </span>
                              </div>
                            </div>
                          </>
                        )}
                        {formData.discountPercentage === 0 && (
                          <div className="border-t border-amber-200 dark:border-amber-500/20 pt-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-semibold text-slate-900 dark:text-white">Toplam Fiyat</span>
                              <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                                {formData.totalPrice.toLocaleString()} ₺
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Selected Tests Summary */}
                    <div className="p-3 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-700/30 rounded-xl border border-slate-200 dark:border-slate-600">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Seçilen Testler</h3>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {selectedTests.map((selectedTest, index) => {
                          const test = tests.find(t => t.id === selectedTest.testId);
                          const testName = test?.name || `Test ID: ${selectedTest.testId}`;
                          const testPrice = selectedTest.customPrice || test?.price || 0;
                          return (
                            <div key={selectedTest.testId} className="flex justify-between items-center text-sm">
                              <span className="text-slate-600 dark:text-slate-400">{testName}</span>
                              <span className="font-semibold text-slate-900 dark:text-white">
                                {(testPrice * selectedTest.quantity).toLocaleString()} ₺
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600 flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Toplam {selectedTests.length} Test</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Cover Letter */}
            {currentStep === 'coverletter' && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/20 border border-slate-200/60 dark:border-slate-700/60 p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Ön Yazı</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Teklifiniz için profesyonel bir ön yazı seçin</p>
                </div>
                <div className="space-y-4">
                  {/* Template Selection */}
                  <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-500/10 dark:to-cyan-500/10 rounded-xl border border-blue-200 dark:border-blue-500/20">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">Şablon Seçimi</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { id: 'professional', title: 'Profesyonel', description: 'Kurumsal ve resmi dil' },
                        { id: 'friendly', title: 'Samimi', description: 'Yaklaşık ve sıcak dil' },
                        { id: 'formal', title: 'Resmi', description: 'Ticari ve formal dil' },
                        { id: 'concise', title: 'Kısa ve Öz', description: 'Hızlı ve net anlatım' }
                      ].map((template) => (
                        <button
                          key={template.id}
                          type="button"
                          onClick={() => setSelectedCoverLetter(template.id)}
                          className={`p-4 rounded-lg border-2 transition-all text-left ${
                            selectedCoverLetter === template.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                              : 'border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 bg-white dark:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              selectedCoverLetter === template.id
                                ? 'bg-blue-500 text-white'
                                : 'bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-400'
                            }`}>
                              {selectedCoverLetter === template.id && <CheckCircle2 size={12} />}
                            </div>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">{template.title}</span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 ml-7">{template.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cover Letter Preview */}
                  <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-700/30 rounded-xl border border-slate-200 dark:border-slate-600">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">Ön Yazı Önizleme</h3>
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                      <pre className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
                        {generateCoverLetter(selectedCoverLetter)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {currentStep === 'review' && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/20 border border-slate-200/60 dark:border-slate-700/60 p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Teklif Önizleme</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Teklif detaylarını kontrol edin ve onaylayın</p>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-700/30 rounded-xl border border-slate-200 dark:border-slate-600">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Firma</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{formData.company}</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Paket</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{formData.package}</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">İletişim Kişisi</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{formData.contactPerson || '-'}</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-600">
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Toplam Fiyat</span>
                      <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                        {formData.totalPrice.toLocaleString()} ₺
                      </span>
                    </div>
                  </div>

                  {formData.discountPercentage > 0 && (
                    <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/10 rounded-xl border border-emerald-200 dark:border-emerald-500/20">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">İndirim Oranı</span>
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formData.discountPercentage}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">İndirimli Fiyat</span>
                        <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                          {(formData.totalPrice - (formData.totalPrice * formData.discountPercentage / 100)).toLocaleString()} ₺
                        </span>
                      </div>
                    </div>
                  )}

                  {formData.validityDate && (
                    <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-500/10 dark:to-cyan-500/10 p-4 rounded-xl border border-blue-200 dark:border-blue-500/20">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                          <Clock size={16} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Geçerlilik Tarihi</span>
                      </div>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{new Date(formData.validityDate).toLocaleDateString('tr-TR')}</span>
                    </div>
                  )}

                  {formData.notes && (
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-500/10 dark:to-pink-500/10 rounded-xl border border-purple-200 dark:border-purple-500/20">
                      <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Notlar</h3>
                      <p className="text-sm text-slate-900 dark:text-white">{formData.notes}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 p-4 rounded-xl border border-amber-200 dark:border-amber-500/20">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center">
                        <Clock size={16} className="text-amber-600 dark:text-amber-400" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Teklif Durumu</span>
                    </div>
                    <span className="text-sm font-bold text-amber-600 dark:text-amber-400">Beklemede</span>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/proposals')}
                className="flex-1 h-10 text-sm font-semibold"
              >
                İptal
              </Button>
              {currentStep !== 'company' && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handlePreviousStep}
                  className="flex-1 h-10 text-sm font-semibold"
                >
                  Geri
                </Button>
              )}
              {currentStep !== 'review' ? (
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleNextStep}
                  disabled={
                    (currentStep === 'company' && !formData.companyId) ||
                    (currentStep === 'package' && selectedTests.length === 0)
                  }
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/30 h-10 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  İleri
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/30 h-10 text-sm font-semibold"
                >
                  Teklif Oluştur
                </Button>
              )}
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
}
