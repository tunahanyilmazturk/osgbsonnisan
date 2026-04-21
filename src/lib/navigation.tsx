import { LayoutDashboard, Calendar, Stethoscope, FileText, Building2, Users, Settings, Beaker, FileCheck, User, Home, Workflow, MoreHorizontal } from 'lucide-react';
import React from 'react';

export const menuGroups = [
  {
    title: "ANA MENÜ",
    icon: <Home size={14} />,
    items: [
      { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
      { name: 'Takvim', path: '/calendar', icon: <Calendar size={20} />, badge: '3', badgeColor: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20' },
    ]
  },
  {
    title: "İŞLEMLER",
    icon: <Workflow size={14} />,
    items: [
      { name: 'Firmalar', path: '/companies', icon: <Building2 size={20} /> },
      { name: 'Teklifler', path: '/proposals', icon: <FileCheck size={20} /> },
      { name: 'Personeller', path: '/personnel', icon: <Users size={20} /> },
      { name: 'Testler', path: '/tests', icon: <Beaker size={20} /> },
      { name: 'Taramalar', path: '/screenings', icon: <Stethoscope size={20} />, badge: '45+', badgeColor: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' },
    ]
  },
  {
    title: "DİĞER",
    icon: <MoreHorizontal size={14} />,
    items: [
      { name: 'İstatistikler', path: '/statistics', icon: <FileText size={20} /> },
      { name: 'Profil', path: '/profile', icon: <User size={20} /> },
      { name: 'Ayarlar', path: '/settings', icon: <Settings size={20} /> },
    ]
  }
];

export function getRouteName(pathname: string) {
  for (const group of menuGroups) {
    for (const item of group.items) {
      if (item.path === pathname) return item.name;
    }
  }
  return 'Bilinmeyen Sayfa';
}
