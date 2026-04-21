import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Palette, Shield, Building2, CheckCircle, ChevronRight } from 'lucide-react';
import { containerVariants, itemVariants } from '../lib/animations';
import { SettingsSection, NotificationSettings, AppearanceSettings, SecuritySettings, OrganizationSettings } from '../components/settings';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'notifications' | 'appearance' | 'security' | 'organization'>('notifications');

  const sidebarItems = [
    { id: 'notifications' as const, label: 'Bildirimler', icon: <Bell size={18} />, description: 'Bildirim tercihleri', color: 'bg-blue-500' },
    { id: 'appearance' as const, label: 'Görünüm', icon: <Palette size={18} />, description: 'Tema ve renkler', color: 'bg-purple-500' },
    { id: 'security' as const, label: 'Güvenlik', icon: <Shield size={18} />, description: 'Şifre ve güvenlik', color: 'bg-rose-500' },
    { id: 'organization' as const, label: 'Kurum Bilgileri', icon: <Building2 size={18} />, description: 'Kurum ayarları', color: 'bg-emerald-500' },
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between pb-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 dark:from-white dark:via-indigo-200 dark:to-purple-200">
            Ayarlar
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 flex items-center gap-2">
            Sistem ayarlarınızı yönetin
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
              <CheckCircle size={12} />
              Otomatik kaydediliyor
            </span>
          </p>
        </div>
      </motion.div>

      {/* Sidebar + Content Layout */}
      <div className="flex gap-6">
        {/* Sidebar */}
        <motion.div 
          variants={itemVariants}
          className="w-72 shrink-0 hidden lg:block"
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-2 sticky top-24 shadow-lg shadow-slate-200/50 dark:shadow-black/20">
            <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-2">
              Ayarlar
            </h3>
            {sidebarItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all relative overflow-hidden group ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-500/20 dark:to-purple-500/20 text-indigo-700 dark:text-indigo-300 font-semibold shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                {activeTab === item.id && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                  activeTab === item.id
                    ? item.color
                    : 'bg-slate-100 dark:bg-slate-700 group-hover:bg-slate-200 dark:group-hover:bg-slate-600'
                }`}>
                  <div className={activeTab === item.id ? 'text-white' : 'text-slate-600 dark:text-slate-400'}>
                    {item.icon}
                  </div>
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs opacity-70">{item.description}</p>
                </div>
                <AnimatePresence>
                  {activeTab === item.id && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-indigo-600 dark:text-indigo-400"
                    >
                      <ChevronRight size={16} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Mobile Tabs */}
        <motion.div 
          variants={itemVariants}
          className="lg:hidden w-full"
        >
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap shrink-0 ${
                  activeTab === item.id
                    ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === 'notifications' && (
            <SettingsSection
              title="Bildirim Ayarları"
              description="Bildirim tercihlerinizi ve bildirim kanallarını yapılandırın"
              icon={<Bell size={24} />}
              delay={0.1}
            >
              <NotificationSettings />
            </SettingsSection>
          )}

          {activeTab === 'appearance' && (
            <SettingsSection
              title="Görünüm Ayarları"
              description="Tema, renkler ve arayüz tercihlerinizi ayarlayın"
              icon={<Palette size={24} />}
              delay={0.1}
            >
              <AppearanceSettings />
            </SettingsSection>
          )}

          {activeTab === 'security' && (
            <SettingsSection
              title="Güvenlik Ayarları"
              description="Şifrenizi ve güvenlik ayarlarınızı yönetin"
              icon={<Shield size={24} />}
              delay={0.1}
            >
              <SecuritySettings />
            </SettingsSection>
          )}

          {activeTab === 'organization' && (
            <SettingsSection
              title="Kurum Bilgileri"
              description="Kurum bilgilerinizi ve ayarlarınızı yönetin"
              icon={<Building2 size={24} />}
              delay={0.1}
            >
              <OrganizationSettings />
            </SettingsSection>
          )}
        </div>
      </div>
    </motion.div>
  );
}
