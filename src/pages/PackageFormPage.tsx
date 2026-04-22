import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Package, Beaker, X, Search, Scan, Heart, Wind, Stethoscope, Eye, Syringe, Check, ChevronRight, Circle, CheckCircle2 } from 'lucide-react';
import { Button, Input } from '../components/ui';
import { TestPackage, initialTests } from '../constants/mockData';
import { Test } from '../constants/mockData';

type Step = 'details' | 'tests' | 'review';

export default function PackageFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState<Step>('details');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [tests, setTests] = useState<Test[]>(initialTests);
  const [formData, setFormData] = useState({
    name: '',
    selectedTestIds: new Set<string>(),
    testPrices: {} as { [testId: string]: number },
    discountPercentage: 0,
  });

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

  // Load package data if editing
  useEffect(() => {
    if (location.state?.package) {
      const pkg = location.state.package;
      setFormData({
        name: pkg.name,
        selectedTestIds: new Set(pkg.testIds),
        testPrices: pkg.testPrices,
        discountPercentage: pkg.discountPercentage,
      });
    }
  }, [location.state]);

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

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         test.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Tümü' || test.category === selectedCategory;
    const notSelected = !formData.selectedTestIds.has(test.id);
    return matchesSearch && matchesCategory && notSelected;
  });

  const categories = ['Tümü', ...new Set(tests.map(test => test.category))];

  const handleTestSelection = (testId: string) => {
    const newSelected = new Set(formData.selectedTestIds);
    const newPrices = { ...formData.testPrices };
    const test = tests.find(t => t.id === testId);

    if (newSelected.has(testId)) {
      newSelected.delete(testId);
      delete newPrices[testId];
    } else {
      newSelected.add(testId);
      if (test) {
        newPrices[testId] = test.price;
      }
    }
    setFormData({ ...formData, selectedTestIds: newSelected, testPrices: newPrices });
  };

  const handlePriceChange = (testId: string, price: string) => {
    setFormData({
      ...formData,
      testPrices: { ...formData.testPrices, [testId]: parseFloat(price) || 0 },
    });
  };

  const handleRemoveTest = (testId: string) => {
    const newSelected = new Set(formData.selectedTestIds);
    newSelected.delete(testId);
    const newPrices = { ...formData.testPrices };
    delete newPrices[testId];
    setFormData({ ...formData, selectedTestIds: newSelected, testPrices: newPrices });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.selectedTestIds.size === 0) {
      alert('Lütfen paket adı girin ve en az bir test seçin.');
      return;
    }

    const originalPrice = Array.from(formData.selectedTestIds)
      .reduce((sum, testId) => {
        const customPrice = formData.testPrices[testId];
        return sum + (customPrice || 0);
      }, 0);

    const discountPercentage = formData.discountPercentage || 0;
    const totalPrice = originalPrice * (1 - discountPercentage / 100);

    const newPackage: TestPackage = {
      id: location.state?.package?.id || `PKG-${Date.now()}`,
      name: formData.name,
      testIds: Array.from(formData.selectedTestIds),
      testPrices: formData.testPrices,
      originalPrice,
      discountPercentage,
      totalPrice,
    };

    // Save to localStorage
    const existingPackages = JSON.parse(localStorage.getItem('packages') || '[]');
    if (location.state?.package) {
      const updatedPackages = existingPackages.map((pkg: TestPackage) =>
        pkg.id === newPackage.id ? newPackage : pkg
      );
      localStorage.setItem('packages', JSON.stringify(updatedPackages));
    } else {
      localStorage.setItem('packages', JSON.stringify([...existingPackages, newPackage]));
    }

    navigate('/packages');
  };

  const handleNextStep = () => {
    if (currentStep === 'details') setCurrentStep('tests');
    else if (currentStep === 'tests') setCurrentStep('review');
  };

  const handlePreviousStep = () => {
    if (currentStep === 'tests') setCurrentStep('details');
    else if (currentStep === 'review') setCurrentStep('tests');
  };

  const steps = [
    { id: 'details', title: 'Paket Bilgileri', icon: Package },
    { id: 'tests', title: 'Test Seçimi', icon: Beaker },
    { id: 'review', title: 'Önizleme', icon: Check },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <button
            onClick={() => navigate('/packages')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:shadow-md transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Package size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Yeni Paket Oluştur</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Adım adım paket oluşturun</p>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 p-6 min-h-[calc(100vh-80px)]">
            <nav className="space-y-2">
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
                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-2 border-indigo-500 dark:border-indigo-400'
                        : isCompleted
                        ? 'bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600'
                        : 'bg-slate-50 dark:bg-slate-700/30 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-600 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isCurrent
                        ? 'bg-indigo-500 text-white'
                        : isCompleted
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-400'
                    }`}>
                      {isCompleted ? <CheckCircle2 size={16} /> : <StepIcon size={16} />}
                    </div>
                    <div className="flex-1 text-left">
                      <span className="text-sm font-semibold">{step.title}</span>
                    </div>
                    {isCurrent && <ChevronRight size={16} className="text-indigo-500" />}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Details */}
              {currentStep === 'details' && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Paket Bilgileri</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Paket Adı</label>
                      <Input
                        placeholder="Örn: Temel Sağlık Paketi"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, discountPercentage: parseFloat(e.target.value) || 0 })}
                        min="0"
                        max="100"
                        step="1"
                        className="text-base h-10"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Tests */}
              {currentStep === 'tests' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Sol: Mevcut Testler */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Mevcut Testler</h2>
                      <div className="flex items-center gap-2">
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <div className="relative">
                          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-40"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 max-h-[calc(100vh-350px)] overflow-y-auto pr-2">
                      {filteredTests.map((test) => (
                        <label key={test.id} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                          'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-sm'
                        }`}>
                          <input
                            type="checkbox"
                            checked={false}
                            onChange={() => handleTestSelection(test.id)}
                            className="w-4 h-4 rounded border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-0"
                          />
                          <div className="flex items-center gap-3 flex-1">
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
                      {filteredTests.length === 0 && (
                        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                          <Search size={32} className="mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Sonuç bulunamadı</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sağ: Seçilen Testler */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Seçilen Testler</h2>
                    {formData.selectedTestIds.size === 0 ? (
                      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                        <Beaker size={48} className="mx-auto mb-3 opacity-50" />
                        <p className="text-base">Henüz test seçilmedi</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                        {Array.from(formData.selectedTestIds).map((testId) => {
                          const test = tests.find(t => t.id === testId);
                          const customPrice = formData.testPrices[testId] || test?.price || 0;
                          return test ? (
                            <div key={testId} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm">
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
                                      onChange={(e) => handlePriceChange(testId, e.target.value)}
                                      className="w-20 px-2 py-1 text-xs border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                                    />
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">₺</span>
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemoveTest(testId)}
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
              )}

              {/* Step 3: Review */}
              {currentStep === 'review' && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Paket Önizleme</h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Paket Adı</span>
                        <span className="text-base font-bold text-slate-900 dark:text-white">{formData.name}</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Test Sayısı</span>
                        <span className="text-base font-bold text-slate-900 dark:text-white">{formData.selectedTestIds.size}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">İndirim</span>
                        <span className="text-base font-bold text-slate-900 dark:text-white">%{formData.discountPercentage}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Seçilen Testler</h3>
                      {Array.from(formData.selectedTestIds).map((testId) => {
                        const test = initialTests.find(t => t.id === testId);
                        return test ? (
                          <div key={testId} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg ${categoryColors[test.category]?.bg} ${categoryColors[test.category]?.darkBg} flex items-center justify-center ${categoryColors[test.category]?.icon} ${categoryColors[test.category]?.darkIcon}`}>
                                {categoryIcons[test.category] || <Beaker size={16} />}
                              </div>
                              <div>
                                <span className="font-semibold text-slate-900 dark:text-white text-sm">{test.name}</span>
                                <div className="text-xs text-slate-500 dark:text-slate-400">{test.category}</div>
                              </div>
                            </div>
                            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{formData.testPrices[testId] || test.price} ₺</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                    <div className="flex items-center justify-between bg-indigo-50 dark:bg-indigo-500/10 p-4 rounded-lg">
                      <span className="text-base font-semibold text-slate-700 dark:text-slate-300">Toplam Fiyat</span>
                      <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                        {(Array.from(formData.selectedTestIds).reduce((sum, testId) => {
                          const customPrice = formData.testPrices[testId] || 0;
                          return sum + customPrice;
                        }, 0) * (1 - formData.discountPercentage / 100)).toFixed(2)} ₺
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/packages')}
                  className="flex-1 h-12 text-base font-semibold"
                >
                  İptal
                </Button>
                {currentStep !== 'details' && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handlePreviousStep}
                    className="flex-1 h-12 text-base font-semibold"
                  >
                    Geri
                  </Button>
                )}
                {currentStep !== 'review' ? (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleNextStep}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/20 h-12 text-base font-semibold"
                  >
                    İleri
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/20 h-12 text-base font-semibold"
                  >
                    Paket Oluştur
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
