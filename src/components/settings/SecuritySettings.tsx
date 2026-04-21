import React, { useState, useEffect } from 'react';
import { Shield, Key, Lock, AlertTriangle, Smartphone } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Toggle } from '../ui/Toggle';

const STORAGE_KEY = 'security_settings';

export function SecuritySettings() {
  const [security, setSecurity] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };
      } catch {
        return {
          twoFactorAuth: false,
          loginNotifications: true,
          sessionTimeout: true,
          ipWhitelist: false,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };
      }
    }
    return {
      twoFactorAuth: false,
      loginNotifications: true,
      sessionTimeout: true,
      ipWhitelist: false,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  });

  useEffect(() => {
    const { currentPassword, newPassword, confirmPassword, ...toSave } = security;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }, [security]);

  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handlePasswordChange = () => {
    // Password change logic
    setShowPasswordForm(false);
    setSecurity({
      ...security,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Password Section */}
      <div className="space-y-4 pb-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Şifre
          </h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPasswordForm(!showPasswordForm)}
          >
            {showPasswordForm ? 'İptal' : 'Şifre Değiştir'}
          </Button>
        </div>
        
        {showPasswordForm && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <Input
              type="password"
              label="Mevcut Şifre"
              value={security.currentPassword}
              onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
              leftIcon={<Lock size={18} />}
              className="md:col-span-2"
            />
            <Input
              type="password"
              label="Yeni Şifre"
              value={security.newPassword}
              onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
              leftIcon={<Key size={18} />}
            />
            <Input
              type="password"
              label="Yeni Şifre (Tekrar)"
              value={security.confirmPassword}
              onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
              leftIcon={<Key size={18} />}
            />
            <Button onClick={handlePasswordChange} className="md:col-span-2">Şifreyi Güncelle</Button>
          </div>
        )}
        
        {!showPasswordForm && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Son şifre değişikliği: 3 ay önce
          </p>
        )}
      </div>

      {/* Two-Factor Authentication */}
      <div className="space-y-4 pb-6 border-b border-slate-200 dark:border-slate-700">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          İki Faktörlü Kimlik Doğrulama
        </h4>
        
        <Toggle
          checked={security.twoFactorAuth}
          onChange={(checked) => setSecurity({ ...security, twoFactorAuth: checked })}
          label="2FA'yı Etkinleştir"
          description="Hesabınıza ekstra güvenlik katın"
          icon={<Smartphone size={18} />}
        />
        
        {security.twoFactorAuth && (
          <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30">
            <div className="flex items-start gap-3">
              <Shield size={20} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-200 mb-1">
                  2FA Aktif
                </p>
                <p className="text-xs text-indigo-700 dark:text-indigo-300">
                  Hesabınız iki faktörlü kimlik doğrulama ile korunuyor.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Login Security */}
      <div className="space-y-4 pb-6 border-b border-slate-200 dark:border-slate-700">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Giriş Güvenliği
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Toggle
            checked={security.loginNotifications}
            onChange={(checked) => setSecurity({ ...security, loginNotifications: checked })}
            label="Giriş Bildirimleri"
            description="Her oturum açılışında bildirim al"
            icon={<AlertTriangle size={18} />}
          />
          
          <Toggle
            checked={security.sessionTimeout}
            onChange={(checked) => setSecurity({ ...security, sessionTimeout: checked })}
            label="Oturum Zaman Aşımı"
            description="30 dakika hareketsizlikten sonra otomatik çıkış"
            icon={<Lock size={18} />}
          />
          
          <div className="md:col-span-2">
            <Toggle
              checked={security.ipWhitelist}
              onChange={(checked) => setSecurity({ ...security, ipWhitelist: checked })}
              label="IP Beyaz Liste"
              description="Sadece izin verilen IP adreslerinden giriş"
              icon={<Shield size={18} />}
            />
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Aktif Oturumlar
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Bu Cihaz
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                İstanbul, Türkiye • Şu an aktif
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Aktif
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                MacBook Pro
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                İstanbul, Türkiye • 2 saat önce
              </p>
            </div>
            <Button variant="ghost" size="sm" className="text-rose-600 dark:text-rose-400">
              Çıkış Yap
            </Button>
          </div>
        </div>
        
        <Button variant="secondary" className="w-full">
          Tüm Diğer Oturumları Sonlandır
        </Button>
      </div>
    </div>
  );
}
