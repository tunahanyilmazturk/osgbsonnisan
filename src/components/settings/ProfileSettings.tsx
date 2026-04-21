import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Camera } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Toggle } from '../ui/Toggle';

const STORAGE_KEY = 'profile_settings';

export function ProfileSettings() {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {
          firstName: 'Ahmet',
          lastName: 'Yılmaz',
          email: 'ahmet.yilmaz@example.com',
          phone: '+90 555 123 4567',
          location: 'İstanbul, Türkiye',
          title: 'Dr. - İş Sağlığı Uzmanı',
          bio: 'İş sağlığı ve güvenliği alanında 10 yıllık deneyime sahip uzman doktor.',
          profileVisibility: true,
          showContactInfo: false
        };
      }
    }
    return {
      firstName: 'Ahmet',
      lastName: 'Yılmaz',
      email: 'ahmet.yilmaz@example.com',
      phone: '+90 555 123 4567',
      location: 'İstanbul, Türkiye',
      title: 'Dr. - İş Sağlığı Uzmanı',
      bio: 'İş sağlığı ve güvenliği alanında 10 yıllık deneyime sahip uzman doktor.',
      profileVisibility: true,
      showContactInfo: false
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Picture */}
      <div className="flex items-center gap-6 pb-6 border-b border-slate-200 dark:border-slate-700">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {profile.firstName[0]}{profile.lastName[0]}
          </div>
          <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shadow-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors">
            <Camera size={14} />
          </button>
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">
            {profile.firstName} {profile.lastName}
          </h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">{profile.title}</p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="space-y-4 pb-6 border-b border-slate-200 dark:border-slate-700">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <User size={16} />
          Kişisel Bilgiler
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Ad"
            leftIcon={<User size={18} />}
            value={profile.firstName}
            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
            disabled={!isEditing}
          />
          <Input
            label="Soyad"
            leftIcon={<User size={18} />}
            value={profile.lastName}
            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
            disabled={!isEditing}
          />
          <Input
            label="E-posta"
            type="email"
            leftIcon={<Mail size={18} />}
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            disabled={!isEditing}
          />
          <Input
            label="Telefon"
            type="tel"
            leftIcon={<Phone size={18} />}
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            disabled={!isEditing}
          />
          <Input
            label="Konum"
            leftIcon={<MapPin size={18} />}
            value={profile.location}
            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
            disabled={!isEditing}
            className="md:col-span-2"
          />
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-4 pb-6 border-b border-slate-200 dark:border-slate-700">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <User size={16} />
          Biyografi
        </h4>
        
        <textarea
          value={profile.bio}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          disabled={!isEditing}
          rows={3}
          className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Visibility Settings */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <User size={16} />
          Görünürlük Ayarları
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Toggle
            checked={profile.profileVisibility}
            onChange={(checked) => setProfile({ ...profile, profileVisibility: checked })}
            label="Profili Herkese Açık"
            description="Profil bilgilerinizi diğer kullanıcılar görebilir"
          />
          <Toggle
            checked={profile.showContactInfo}
            onChange={(checked) => setProfile({ ...profile, showContactInfo: checked })}
            label="İletişim Bilgilerini Göster"
            description="E-posta ve telefon numaranız görüntülenebilir"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        {isEditing ? (
          <>
            <Button onClick={handleSave}>Değişiklikleri Kaydet</Button>
            <Button variant="secondary" onClick={() => setIsEditing(false)}>İptal</Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Profili Düzenle</Button>
        )}
      </div>
    </div>
  );
}
