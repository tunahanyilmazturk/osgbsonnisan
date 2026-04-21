import React, { useState, useEffect } from 'react';
import { Building2, Mail, Phone, MapPin, Globe, FileText, Upload } from 'lucide-react';
import { Input } from '../ui/Input';
import { Toggle } from '../ui/Toggle';

const STORAGE_KEY = 'organization_settings';

export function OrganizationSettings() {
  const [organization, setOrganization] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {
          name: 'Sağlık Test Merkezi A.Ş.',
          taxNumber: '1234567890',
          email: 'info@sagliktestmerkezi.com',
          phone: '+90 212 123 4567',
          address: 'İstanbul, Türkiye',
          website: 'https://www.sagliktestmerkezi.com',
          logo: '',
          publicProfile: true,
          showContactInfo: true
        };
      }
    }
    return {
      name: 'Sağlık Test Merkezi A.Ş.',
      taxNumber: '1234567890',
      email: 'info@sagliktestmerkezi.com',
      phone: '+90 212 123 4567',
      address: 'İstanbul, Türkiye',
      website: 'https://www.sagliktestmerkezi.com',
      logo: '',
      publicProfile: true,
      showContactInfo: true
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(organization));
  }, [organization]);

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4 pb-6 border-b border-slate-200 dark:border-slate-700">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Building2 size={16} />
          Temel Bilgiler
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Kurum Adı"
            leftIcon={<Building2 size={18} />}
            value={organization.name}
            onChange={(e) => setOrganization({ ...organization, name: e.target.value })}
            className="md:col-span-2"
          />
          
          <Input
            label="Vergi Numarası"
            leftIcon={<FileText size={18} />}
            value={organization.taxNumber}
            onChange={(e) => setOrganization({ ...organization, taxNumber: e.target.value })}
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4 pb-6 border-b border-slate-200 dark:border-slate-700">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Mail size={16} />
          İletişim Bilgileri
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="E-posta"
            type="email"
            leftIcon={<Mail size={18} />}
            value={organization.email}
            onChange={(e) => setOrganization({ ...organization, email: e.target.value })}
          />
          
          <Input
            label="Telefon"
            type="tel"
            leftIcon={<Phone size={18} />}
            value={organization.phone}
            onChange={(e) => setOrganization({ ...organization, phone: e.target.value })}
          />
          
          <Input
            label="Adres"
            leftIcon={<MapPin size={18} />}
            value={organization.address}
            onChange={(e) => setOrganization({ ...organization, address: e.target.value })}
            className="md:col-span-2"
          />
          
          <Input
            label="Web Sitesi"
            type="url"
            leftIcon={<Globe size={18} />}
            value={organization.website}
            onChange={(e) => setOrganization({ ...organization, website: e.target.value })}
            className="md:col-span-2"
          />
        </div>
      </div>

      {/* Logo Upload */}
      <div className="space-y-4 pb-6 border-b border-slate-200 dark:border-slate-700">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Upload size={16} />
          Kurum Logosu
        </h4>
        
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors cursor-pointer">
          <Upload size={32} className="mx-auto text-slate-400 dark:text-slate-500 mb-3" />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Logo yüklemek için tıklayın veya sürükleyin
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
            PNG, JPG veya SVG (max 2MB)
          </p>
        </div>
      </div>

      {/* Visibility Settings */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Building2 size={16} />
          Görünürlük Ayarları
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Toggle
            checked={organization.publicProfile}
            onChange={(checked) => setOrganization({ ...organization, publicProfile: checked })}
            label="Herkese Açık Profil"
            description="Kurum bilgilerinizi diğer kullanıcılar görebilir"
          />
          
          <Toggle
            checked={organization.showContactInfo}
            onChange={(checked) => setOrganization({ ...organization, showContactInfo: checked })}
            label="İletişim Bilgilerini Göster"
            description="E-posta ve telefon numaranız görüntülenebilir"
          />
        </div>
      </div>
    </div>
  );
}
