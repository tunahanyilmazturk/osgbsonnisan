import { ReactNode } from 'react';
import { Status } from './common';

export interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  trendDown?: boolean;
  trendLabel?: string;
  icon: ReactNode;
  color: string;
  chartColor: string;
}

export interface StatusBadgeProps {
  status: string;
}

export interface TimelineItemProps {
  time: string;
  title: string;
  desc: string;
  status: 'completed' | 'current' | 'upcoming';
}

export interface ChartData {
  name: string;
  tarama: number;
}
