import { z } from 'zod';

// Company validation schema
export const companySchema = z.object({
  name: z.string().min(1, 'Firma adı zorunludur').max(100, 'Firma adı en fazla 100 karakter olabilir'),
  taxNumber: z.string().min(10, 'Vergi numarası 10 haneli olmalıdır').max(10, 'Vergi numarası 10 haneli olmalıdır'),
  taxOffice: z.string().min(1, 'Vergi dairesi zorunludur').max(50, 'Vergi dairesi en fazla 50 karakter olabilir'),
  authorizedPerson: z.string().min(1, 'Yetkili kişi zorunludur').max(100, 'Yetkili kişi en fazla 100 karakter olabilir'),
  authorizedPersonPhone: z.string().min(13, 'Telefon numarası geçersiz').max(13, 'Telefon numarası geçersiz'),
  authorizedPersonEmail: z.string().email('Geçerli bir e-posta adresi giriniz'),
  employeeCount: z.number().min(1, 'Çalışan sayısı en az 1 olmalıdır'),
  address: z.string().min(1, 'Adres zorunludur').max(500, 'Adres en fazla 500 karakter olabilir'),
  sector: z.string().min(1, 'Sektör zorunludur'),
  status: z.enum(['active', 'inactive']),
});

// Personnel validation schema
export const personnelSchema = z.object({
  firstName: z.string().min(1, 'Ad zorunludur').max(50, 'Ad en fazla 50 karakter olabilir'),
  lastName: z.string().min(1, 'Soyad zorunludur').max(50, 'Soyad en fazla 50 karakter olabilir'),
  phone: z.string().min(13, 'Telefon numarası geçersiz').max(13, 'Telefon numarası geçersiz'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  position: z.string().min(1, 'Pozisyon zorunludur'),
  startDate: z.string().min(1, 'Başlangıç tarihi zorunludur'),
  status: z.enum(['active', 'inactive']),
});

// Test validation schema
export const testSchema = z.object({
  name: z.string().min(1, 'Test adı zorunludur').max(100, 'Test adı en fazla 100 karakter olabilir'),
  category: z.string().min(1, 'Kategori zorunludur'),
  price: z.number().min(0, 'Fiyat negatif olamaz'),
  duration: z.number().min(1, 'Süre en az 1 dakika olmalıdır'),
});

// Package validation schema
export const packageSchema = z.object({
  name: z.string().min(1, 'Paket adı zorunludur').max(100, 'Paket adı en fazla 100 karakter olabilir'),
  tests: z.array(z.string()).min(1, 'En az bir test seçmelisiniz'),
  price: z.number().min(0, 'Fiyat negatif olamaz'),
  discount: z.number().min(0).max(100, 'İndirim 0-100 arasında olmalıdır').optional(),
});

export type CompanyFormData = z.infer<typeof companySchema>;
export type PersonnelFormData = z.infer<typeof personnelSchema>;
export type TestFormData = z.infer<typeof testSchema>;
export type PackageFormData = z.infer<typeof packageSchema>;
