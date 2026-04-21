export enum Status {
  TEMIZ = 'Temiz',
  INCELEMEDE = 'İncelemede',
  SEVK_EDILDI = 'Sevk Edildi',
  BEKLENIYOR = 'Bekleniyor',
  TAMAMLANDI = 'Tamamlandı',
}

export enum ScreeningType {
  ISE_GIRIS = 'İşe Giriş',
  PERIYODIK = 'Periyodik',
  RETURNE = 'Returne',
  YILLIK = 'Yıllık',
}

export enum UserRole {
  ISYERI_HEKIMI = 'İşyeri Hekimi',
  ISGUVENLIK_UZMANI = 'İş Güvenliği Uzmanı',
  LABORANT = 'Laborant',
  ADMIN = 'Admin',
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
  initials: string;
}

export interface Company {
  id: string;
  name: string;
  sector?: string;
  employeeCount?: number;
  contractStatus?: 'active' | 'inactive' | 'pending';
}

export interface Personnel {
  id: string;
  name: string;
  companyId: string;
  companyName: string;
  screeningType: ScreeningType;
  status: Status;
  recordNumber: string;
  lastScreeningDate?: Date;
  nextScreeningDate?: Date;
}
