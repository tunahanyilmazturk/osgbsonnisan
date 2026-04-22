import React, { useState } from 'react';
import { 
  Bell, X, Check, AlertTriangle, Info, CheckCircle2, 
  Clock, ChevronRight, Filter, MoreVertical, Trash2
} from 'lucide-react';

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  title: string;
  message: string;
  time: string;
  read: boolean;
  category: 'system' | 'screening' | 'report' | 'personnel';
}

interface NotificationPanelProps {
  notifications?: Notification[];
  onMarkAsRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onClearAll?: () => void;
}

const defaultNotifications: Notification[] = [
  {
    id: '1',
    type: 'alert',
    title: 'Kritik Uyarı',
    message: 'ABC Lojistik A.Ş. personelinde yüksek risk tespit edildi',
    time: '2 dakika önce',
    read: false,
    category: 'screening'
  },
  {
    id: '2',
    type: 'success',
    title: 'Rapor Hazır',
    message: 'Haziran 2024 sağlık tarama raporu tamamlandı',
    time: '15 dakika önce',
    read: false,
    category: 'report'
  },
  {
    id: '3',
    type: 'info',
    title: 'Sistem Güncellemesi',
    message: 'Yeni test paketleri eklendi',
    time: '1 saat önce',
    read: true,
    category: 'system'
  },
  {
    id: '4',
    type: 'warning',
    title: 'Planlama Hatırlatma',
    message: 'XYZ Fabrika ziyareti için 3 gün kaldı',
    time: '2 saat önce',
    read: true,
    category: 'screening'
  },
  {
    id: '5',
    type: 'info',
    title: 'Yeni Personel',
    message: 'Mühendislik bölümüne 5 yeni personel eklendi',
    time: '3 saat önce',
    read: true,
    category: 'personnel'
  },
  {
    id: '6',
    type: 'success',
    title: 'Tarama Tamamlandı',
    message: 'Günlük 45 taramanın tamamı başarıyla bitti',
    time: '5 saat önce',
    read: true,
    category: 'screening'
  }
];

const typeConfig = {
  alert: {
    icon: <AlertTriangle size={14} />,
    bgColor: 'bg-rose-50 dark:bg-rose-500/10',
    borderColor: 'border-rose-200 dark:border-rose-500/30',
    iconColor: 'text-rose-600 dark:text-rose-400'
  },
  warning: {
    icon: <AlertTriangle size={14} />,
    bgColor: 'bg-amber-50 dark:bg-amber-500/10',
    borderColor: 'border-amber-200 dark:border-amber-500/30',
    iconColor: 'text-amber-600 dark:text-amber-400'
  },
  success: {
    icon: <CheckCircle2 size={14} />,
    bgColor: 'bg-emerald-50 dark:bg-emerald-500/10',
    borderColor: 'border-emerald-200 dark:border-emerald-500/30',
    iconColor: 'text-emerald-600 dark:text-emerald-400'
  },
  info: {
    icon: <Info size={14} />,
    bgColor: 'bg-indigo-50 dark:bg-indigo-500/10',
    borderColor: 'border-indigo-200 dark:border-indigo-500/30',
    iconColor: 'text-indigo-600 dark:text-indigo-400'
  }
};

const categoryConfig = {
  system: { label: 'Sistem', color: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300' },
  screening: { label: 'Tarama', color: 'bg-indigo-100 dark:bg-indigo-700 text-indigo-600 dark:text-indigo-300' },
  report: { label: 'Rapor', color: 'bg-emerald-100 dark:bg-emerald-700 text-emerald-600 dark:text-emerald-300' },
  personnel: { label: 'Personel', color: 'bg-purple-100 dark:bg-purple-700 text-purple-600 dark:text-purple-300' }
};

export default function NotificationPanel({ 
  notifications = defaultNotifications,
  onMarkAsRead,
  onDismiss,
  onClearAll
}: NotificationPanelProps) {
  const [filter, setFilter] = useState<'all' | 'unread' | 'important'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread' && n.read) return false;
    if (filter === 'important' && n.type !== 'alert' && n.type !== 'warning') return false;
    if (selectedCategory !== 'all' && n.category !== selectedCategory) return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg">Bildirimler</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white text-xs font-bold rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <button
          onClick={onClearAll}
          className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 transition-colors hover:scale-105"
        >
          <Trash2 size={12} />
          Temizle
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        {(['all', 'unread', 'important'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all hover:scale-102 ${
              filter === f
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {f === 'all' ? 'Tümü' : f === 'unread' ? 'Okunmamış' : 'Önemli'}
          </button>
        ))}
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all hover:scale-102 ${
            selectedCategory === 'all'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          Tüm Kategoriler
        </button>
        {Object.entries(categoryConfig).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all hover:scale-102 ${
              selectedCategory === key
                ? config.color
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {config.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <Bell size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Bildirim bulunmuyor</p>
            </div>
          ) : (
            filteredNotifications.map((notification, index) => {
              const config = typeConfig[notification.type];
              const category = categoryConfig[notification.category];
              
              return (
                <div
                  key={notification.id}
                  className={`p-3 rounded-xl ${config.bgColor} ${config.borderColor} border ${!notification.read ? 'shadow-sm' : 'opacity-70'} transition-all group relative hover:translate-x-1`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg ${config.bgColor} ${config.borderColor} border flex items-center justify-center shrink-0 ${config.iconColor}`}>
                      {config.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
                          {category.label}
                        </span>
                        {!notification.read && (
                          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                        )}
                      </div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white mb-0.5">
                        {notification.title}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock size={10} className="text-slate-400" />
                        <span className="text-xs text-slate-500 dark:text-slate-400">{notification.time}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.read && (
                        <button
                          onClick={() => onMarkAsRead?.(notification.id)}
                          className="p-1.5 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-colors hover:scale-110"
                        >
                          <Check size={12} />
                        </button>
                      )}
                      <button
                        onClick={() => onDismiss?.(notification.id)}
                        className="p-1.5 rounded-lg bg-white dark:bg-slate-700 hover:bg-rose-50 dark:hover:bg-rose-500/20 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors hover:scale-110"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
      </div>

      {/* Footer */}
      {filteredNotifications.length > 0 && (
        <button
          className="w-full mt-4 py-2.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center justify-center gap-2 transition-all rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-500/20 dark:hover:to-purple-500/20 hover:scale-102"
        >
          Tümünü Gör
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}
