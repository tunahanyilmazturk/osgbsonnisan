import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, ChevronRight, Check } from 'lucide-react';
import { Input, Button } from '../components/ui';
import { companySectors, Company, initialCompanies } from '../constants/mockData';

const steps = [
  { id: 1, title: 'Temel Bilgiler', description: 'Firma adı ve vergi bilgileri' },
  { id: 2, title: 'Yetkili Bilgileri', description: 'Kişisel ve iletişim bilgileri' },
  { id: 3, title: 'Detay Bilgileri', description: 'Çalışan sayısı ve adres' },
  { id: 4, title: 'Onay', description: 'Bilgileri kontrol edin' },
];

export default function CompaniesFormPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        navigate('/companies');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.sector-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleSubmit called', formData);

    const newCompany: Company = {
      id: `CMP-${Date.now()}`,
      name: formData.name,
      taxNumber: formData.taxNumber,
      taxOffice: formData.taxOffice,
      authorizedPerson: formData.authorizedPerson,
      authorizedPersonPhone: formData.authorizedPersonPhone,
      authorizedPersonEmail: formData.authorizedPersonEmail,
      employeeCount: formData.employeeCount,
      address: formData.address,
      sector: formData.sector,
      status: formData.status,
      createdAt: new Date().toISOString().split('T')[0],
    };

    console.log('newCompany created', newCompany);

    // LocalStorage'dan mevcut firmaları al
    const storedCompanies = localStorage.getItem('companies');
    const localStorageCompanies: Company[] = storedCompanies ? JSON.parse(storedCompanies) : [];

    // initialCompanies ile birleştir, duplicasyonları kaldır
    const mergedCompanies = [...initialCompanies];
    localStorageCompanies.forEach((lc: Company) => {
      if (!mergedCompanies.find(c => c.id === lc.id)) {
        mergedCompanies.push(lc);
      }
    });

    // Yeni firmayı ekle
    mergedCompanies.push(newCompany);
    localStorage.setItem('companies', JSON.stringify(mergedCompanies));
    console.log('localStorage updated');

    // Companies sayfasına dön
    navigate('/companies');
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.name;
      case 2:
        return true;
      case 3:
        return formData.employeeCount > 0 && formData.sector;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 p-6 flex flex-col">
        <button
          onClick={() => navigate('/companies')}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Geri Dön</span>
        </button>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Yeni Firma Ekle
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
          Adım adım firma bilgilerini girin
        </p>

        <div className="flex-1">
          {steps.map((step, index) => (
            <div
              key={step.id}
              onClick={() => {
                // Sadece geçmiş adımlara veya mevcut adıma tıklayabilir
                if (step.id <= currentStep || isStepValid(step.id - 1)) {
                  setCurrentStep(step.id);
                }
              }}
              className={`flex items-start gap-4 mb-6 cursor-pointer transition-all ${
                currentStep === step.id ? 'opacity-100' : 'opacity-50'
              } ${currentStep > step.id ? 'text-emerald-500' : ''} ${
                isStepValid(step.id - 1) || step.id <= currentStep ? 'hover:opacity-100' : ''
              }`}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    currentStep === step.id
                      ? 'border-indigo-500 bg-indigo-500 text-white'
                      : currentStep > step.id
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : isStepValid(step.id - 1) || step.id <= currentStep
                      ? 'border-indigo-300 dark:border-indigo-600 bg-white dark:bg-slate-800 text-indigo-500'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check size={16} />
                  ) : (
                    <span className="text-sm font-semibold">{step.id}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-0.5 h-8 mt-2 ${
                      currentStep > step.id ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Quick Summary */}
        <div className="mb-6 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 p-4">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Hızlı Özet</h3>
          <div className="flex flex-wrap gap-3 text-xs">
            {formData.name && (
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 px-3 py-1.5 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-slate-600 dark:text-slate-300">Firma: {formData.name}</span>
              </div>
            )}
            {formData.taxNumber && (
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 px-3 py-1.5 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-slate-600 dark:text-slate-300">Vergi No: {formData.taxNumber}</span>
              </div>
            )}
            {formData.authorizedPerson && (
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 px-3 py-1.5 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-slate-600 dark:text-slate-300">Yetkili: {formData.authorizedPerson}</span>
              </div>
            )}
            {formData.employeeCount > 0 && (
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 px-3 py-1.5 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-slate-600 dark:text-slate-300">Çalışan: {formData.employeeCount}</span>
              </div>
            )}
            {formData.sector && (
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 px-3 py-1.5 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-slate-600 dark:text-slate-300">Sektör: {formData.sector}</span>
              </div>
            )}
            {formData.address && (
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 px-3 py-1.5 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-slate-600 dark:text-slate-300">Adres: {formData.address}</span>
              </div>
            )}
          </div>
        </div>

        <div
          key={currentStep}
          className="max-w-3xl mx-auto"
        >
          <form onSubmit={handleSubmit}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
            {/* Step 1: Temel Bilgiler */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Temel Bilgiler</h2>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Firma Adı <span className="text-red-500">*</span></label>
                  <Input
                    placeholder="Firma adını giriniz"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Vergi Numarası</label>
                    <Input
                      placeholder="XXXXXXXXXX"
                      value={formData.taxNumber}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length > 10) {
                          value = value.slice(0, 10);
                        }
                        setFormData({ ...formData, taxNumber: value });
                      }}
                      maxLength={10}
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">10 haneli vergi numarası</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Vergi Dairesi</label>
                    <Input
                      placeholder="Vergi dairesini giriniz"
                      value={formData.taxOffice}
                      onChange={(e) => setFormData({ ...formData, taxOffice: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Yetkili Bilgileri */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Yetkili Bilgileri</h2>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Yetkili Kişi</label>
                  <Input
                    placeholder="Yetkili kişinin adını giriniz"
                    value={formData.authorizedPerson}
                    onChange={(e) => setFormData({ ...formData, authorizedPerson: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Yetkili Telefon</label>
                    <Input
                      type="tel"
                      placeholder="05XX XXX XX XX"
                      value={formData.authorizedPersonPhone}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length > 11) {
                          value = value.slice(0, 11);
                        }
                        if (value.length >= 6) {
                          value = value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6);
                        } else if (value.length >= 3) {
                          value = value.slice(0, 3) + ' ' + value.slice(3);
                        }
                        setFormData({ ...formData, authorizedPersonPhone: value });
                      }}
                      maxLength={13}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Yetkili E-posta</label>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      value={formData.authorizedPersonEmail}
                      onChange={(e) => setFormData({ ...formData, authorizedPersonEmail: e.target.value })}
                      pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                      title="Geçerli bir e-posta adresi giriniz (örn: email@example.com)"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Detay Bilgileri */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Detay Bilgileri</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Çalışan Sayısı <span className="text-red-500">*</span></label>
                    <Input
                      type="number"
                      placeholder="Çalışan sayısını giriniz"
                      value={formData.employeeCount}
                      onChange={(e) => setFormData({ ...formData, employeeCount: Number(e.target.value) })}
                      required
                      min="1"
                      title="Çalışan sayısı en az 1 olmalıdır"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Sektör <span className="text-red-500">*</span></label>
                    <div className="relative sector-dropdown">
                      <Input
                        type="text"
                        placeholder="Sektör ara..."
                        value={searchTerm || formData.sector}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setIsDropdownOpen(true);
                        }}
                        onFocus={() => setIsDropdownOpen(true)}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        required
                      />
                      {isDropdownOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                          {companySectors
                            .filter(s => s !== 'Tümü')
                            .filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
                            .slice(0, 20)
                            .map(sector => (
                              <button
                                key={sector}
                                type="button"
                                onClick={() => {
                                  setFormData({ ...formData, sector });
                                  setSearchTerm('');
                                  setIsDropdownOpen(false);
                                }}
                                className="w-full px-3 py-2 text-left text-sm text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                              >
                                {sector}
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Adres</label>
                  <Input
                    placeholder="Firma adresini giriniz"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Onay */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Bilgileri Kontrol Edin</h2>
                <div className="space-y-3">
                  <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Temel Bilgiler</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      <span className="font-medium">Firma:</span> {formData.name}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      <span className="font-medium">Vergi No:</span> {formData.taxNumber}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      <span className="font-medium">Vergi Dairesi:</span> {formData.taxOffice}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Yetkili Bilgileri</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      <span className="font-medium">Yetkili:</span> {formData.authorizedPerson}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      <span className="font-medium">Telefon:</span> {formData.authorizedPersonPhone}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      <span className="font-medium">E-posta:</span> {formData.authorizedPersonEmail}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Detay Bilgileri</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      <span className="font-medium">Çalışan Sayısı:</span> {formData.employeeCount}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      <span className="font-medium">Sektör:</span> {formData.sector}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      <span className="font-medium">Adres:</span> {formData.address}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Durum</h3>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, status: 'active' })}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-semibold text-sm transition-all ${
                          formData.status === 'active'
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                            : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <CheckCircle2 size={14} />
                        Aktif
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, status: 'inactive' })}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-semibold text-sm transition-all ${
                          formData.status === 'inactive'
                            ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                            : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <XCircle size={14} />
                        Pasif
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-6">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handlePrevious}
                  className="flex-1"
                >
                  Geri
                </Button>
              )}
              {currentStep < 4 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!isStepValid(currentStep)}
                  className="flex-1"
                >
                  İleri
                  <ChevronRight size={16} className="ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex-1"
                  onClick={() => console.log('Firma Ekle button clicked')}
                >
                  Firma Ekle
                </Button>
              )}
            </div>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
}
