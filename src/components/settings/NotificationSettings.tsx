import React, { useState, useEffect } from 'react';
import { Bell, Mail, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
import { Toggle } from '../ui/Toggle';
import { Select } from '../ui/Select';

const STORAGE_KEY = 'notification_settings';

export function NotificationSettings() {
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {
          emailNotifications: true,
          pushNotifications: true,
          smsNotifications: false,
          screeningAlerts: true,
          appointmentReminders: true,
          systemUpdates: true,
          weeklyReport: true,
          digestFrequency: 'daily'
        };
      }
    }
    return {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      screeningAlerts: true,
      appointmentReminders: true,
      systemUpdates: true,
      weeklyReport: true,
      digestFrequency: 'daily'
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  return (
    <div className="space-y-6">
      {/* Notification Channels */}
      <div className="space-y-4 pb-6 border-b border-slate-200 dark:border-slate-700">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Bildirim Kanalları
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Toggle
            checked={notifications.emailNotifications}
            onChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
            label="E-posta Bildirimleri"
            description="Önemli güncellemeler e-posta ile gönderilir"
            icon={<Mail size={18} />}
          />
          
          <Toggle
            checked={notifications.pushNotifications}
            onChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })}
            label="Push Bildirimleri"
            description="Tarayıcı bildirimlerini aktif et"
            icon={<Bell size={18} />}
          />
          
          <div className="md:col-span-2">
            <Toggle
              checked={notifications.smsNotifications}
              onChange={(checked) => setNotifications({ ...notifications, smsNotifications: checked })}
              label="SMS Bildirimleri"
              description="Acil durumlar için SMS bildirimi al"
              icon={<MessageSquare size={18} />}
            />
          </div>
        </div>
      </div>

      {/* Alert Types */}
      <div className="space-y-4 pb-6 border-b border-slate-200 dark:border-slate-700">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Bildirim Türleri
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Toggle
            checked={notifications.screeningAlerts}
            onChange={(checked) => setNotifications({ ...notifications, screeningAlerts: checked })}
            label="Tarama Uyarıları"
            description="Yeni tarama sonuçları hakkında bildirim al"
            icon={<AlertCircle size={18} />}
          />
          
          <Toggle
            checked={notifications.appointmentReminders}
            onChange={(checked) => setNotifications({ ...notifications, appointmentReminders: checked })}
            label="Randevu Hatırlatıcıları"
            description="Yaklaşan randevular için hatırlatma al"
            icon={<CheckCircle size={18} />}
          />
          
          <div className="md:col-span-2">
            <Toggle
              checked={notifications.systemUpdates}
              onChange={(checked) => setNotifications({ ...notifications, systemUpdates: checked })}
              label="Sistem Güncellemeleri"
              description="Sistem bakım ve güncelleme bildirimleri"
              icon={<Bell size={18} />}
            />
          </div>
        </div>
      </div>

      {/* Report Frequency */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Rapor Sıklığı
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Toggle
            checked={notifications.weeklyReport}
            onChange={(checked) => setNotifications({ ...notifications, weeklyReport: checked })}
            label="Haftalık Özet Rapor"
            description="Haftalık aktivite özeti e-posta olarak gönderilir"
          />
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Özet Rapor Sıklığı
            </label>
            <Select
              value={notifications.digestFrequency}
              onChange={(e) => setNotifications({ ...notifications, digestFrequency: e.target.value })}
              options={[
                { value: 'daily', label: 'Günlük' },
                { value: 'weekly', label: 'Haftalık' },
                { value: 'monthly', label: 'Aylık' }
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
