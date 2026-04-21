import React from 'react';
import { motion } from 'motion/react';
import { User as UserIcon, CheckCircle } from 'lucide-react';
import { containerVariants, itemVariants } from '../lib/animations';
import { SettingsSection } from '../components/settings';
import { ProfileSettings } from '../components/settings/ProfileSettings';

export default function ProfilePage() {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4 pb-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 dark:from-white dark:via-indigo-200 dark:to-purple-200">
            Profil
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 flex items-center gap-2">
            Kişisel bilgilerinizi ve profil ayarlarınızı yönetin
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
              <CheckCircle size={12} />
              Otomatik kaydediliyor
            </span>
          </p>
        </div>
      </motion.div>

      {/* Content */}
      <SettingsSection
        title="Profil Ayarları"
        description="Kişisel bilgilerinizi ve profil ayarlarınızı yönetin"
        icon={<UserIcon size={24} />}
        delay={0.1}
      >
        <ProfileSettings />
      </SettingsSection>
    </motion.div>
  );
}
