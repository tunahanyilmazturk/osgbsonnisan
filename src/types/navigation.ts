import { ReactNode } from 'react';

export interface MenuItem {
  name: string;
  path: string;
  icon: ReactNode;
  badge?: string;
  badgeColor?: string;
}

export interface MenuGroup {
  title: string;
  items: MenuItem[];
}
