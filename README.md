<div align="center">

# OSGB Sönisan

**OSGB (İş Sağlığı ve Güvenliği) Test Yönetim Sistemi**

Modüler yapıda geliştirilmiş, modern ve kullanıcı dostu bir test ve paket yönetim sistemi.

</div>

## ✨ Özellikler

- **Test Yönetimi**: Testlerin ekleme, düzenleme, silme ve kopyalama işlemleri
- **Test Paketleri**: Testleri gruplayarak paket oluşturma ve indirim uygulama
- **Kategori Filtreleme**: Laboratuvar, Görüntüleme, Kardiyoloji, SFT, Odyometri, Göz, Aşı kategorilerine göre filtreleme
- **Arama**: Test adına veya kategoriye göre hızlı arama
- **Sıralama**: İsim, kategori veya fiyata göre sıralama (A-Z / Z-A)
- **Sayfalama**: Büyük veri setleri için sayfalama desteği
- **Toplu İşlemler**: Çoklu seçim ve toplu silme
- **Dışa Aktarma**: Testleri CSV formatında dışa aktarma
- **Görünüm Modları**: Grid ve List görünüm seçenekleri
- **Responsive Tasarım**: Tüm cihazlarda mükemmel görünüm
- **Dark Mode**: Koyu tema desteği
- **Erişilebilirlik**: WCAG uyumlu erişilebilirlik özellikleri
- **Modern UI**: Framer Motion animasyonları ve TailwindCSS styling

## 🛠️ Teknoloji Yığını

- **Frontend**: React 19 + TypeScript
- **Styling**: TailwindCSS 4
- **Routing**: React Router DOM 7
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **Build Tool**: Vite 8
- **Backend**: Express.js (API için)

## 📦 Kurulum

**Gereksinimler:**
- Node.js 18 veya üzeri
- npm veya yarn

### Adımlar

1. Projeyi klonlayın:
```bash
git clone https://github.com/tunahanyilmazturk/osgbsonnisan.git
cd osgbsonnisan
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

## 🚀 Kullanım

### Test Yönetimi

1. **Test Ekleme**: "Yeni Test Ekle" butonuna tıklayın
2. **Test Düzenleme**: Test kartındaki düzenle ikonuna tıklayın
3. **Test Silme**: Test kartındaki sil ikonuna tıklayın
4. **Test Kopyalama**: Test kartındaki kopya ikonuna tıklayın
5. **Toplu Silme**: Birden fazla test seçin ve "Sil" butonuna tıklayın

### Paket Yönetimi

1. **Paket Oluşturma**: "Test Paketleri" sekmesine geçin ve "Yeni Paket Oluştur" butonuna tıklayın
2. **Test Seçimi**: Pakete eklemek istediğiniz testleri seçin
3. **İndirim Uygulama**: İndirim yüzdesi belirleyerek toplam fiyatı güncelleyin
4. **Paket Düzenleme**: Paket kartındaki düzenle ikonuna tıklayın
5. **Paket Silme**: Paket kartındaki sil ikonuna tıklayın

### Filtreleme ve Arama

- **Kategori Filtreleme**: Kategori butonlarına tıklayarak filtreleme yapın
- **Arama**: Arama kutusuna test adı veya kategori girin
- **Sıralama**: Sıralama seçeneklerinden istediğiniz kriteri seçin

## 📁 Proje Yapısı

```
osgbsonnisan/
├── src/
│   ├── components/
│   │   ├── tests/          # Test bileşenleri
│   │   │   ├── TestCard.tsx
│   │   │   ├── TestListItem.tsx
│   │   │   ├── TestFilters.tsx
│   │   │   ├── TestPagination.tsx
│   │   │   ├── TestModal.tsx
│   │   │   ├── PackageModal.tsx
│   │   │   ├── PackageCard.tsx
│   │   │   └── TestsHeader.tsx
│   │   ├── ui/              # UI bileşenleri
│   │   ├── dashboard/       # Dashboard bileşenleri
│   │   ├── layout/          # Layout bileşenleri
│   │   └── shared/          # Paylaşılan bileşenler
│   ├── pages/               # Sayfalar
│   │   ├── Tests.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Personnel.tsx
│   │   ├── Companies.tsx
│   │   └── ...
│   ├── constants/           # Sabit veriler
│   │   └── mockData.ts
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # Yardımcı kütüphaneler
│   ├── types/               # TypeScript tipleri
│   └── utils/               # Yardımcı fonksiyonlar
├── public/                  # Statik dosyalar
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🎨 Tasarım Özellikleri

- **Responsive Tasarım**: Tüm ekran boyutlarına uyumlu
- **Dark Mode**: Sistem tercihlerine göre otomatik tema değişimi
- **Modern Animasyonlar**: Framer Motion ile akıcı geçişler
- **Gradient Renkler**: Modern ve çekici renk paleti
- **Glass Morphism**: Yarı saydam arka plan efektleri
- **Accessibility**: ARIA etiketleri ve klavye navigasyonu

## 📝 Komutlar

```bash
# Geliştirme sunucusunu başlat
npm run dev

# Production build oluştur
npm run build

# Build önizle
npm run preview

# TypeScript kontrolü
npm run lint

# Temizlik (dist klasörünü sil)
npm run clean
```

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen:

1. Projeyi fork edin
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'inizi push edin (`git push origin feature/AmazingFeature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👥 İletişim

- **GitHub**: [tunahanyilmazturk](https://github.com/tunahanyilmazturk)
- **Proje**: [osgbsonnisan](https://github.com/tunahanyilmazturk/osgbsonnisan)

---

<div align="center">

⭐️ Eğer bu projeyi beğendiyseniz, lütfen yıldız bırakın!

</div>
