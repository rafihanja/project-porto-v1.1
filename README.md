# Cek Zakat

Cek Zakat adalah web kalkulator sederhana untuk menghitung estimasi zakat penghasilan, tabungan, emas, usaha, dan fitrah.

## Fokus MVP

- Zakat penghasilan untuk gaji, honor, upah, jasa, dan freelance.
- Zakat tabungan dengan acuan 85 gram emas dan status haul.
- Zakat emas berdasarkan jumlah gram, harga emas, dan status haul.
- Zakat perdagangan/usaha berdasarkan aset lancar dikurangi hutang jangka pendek.
- Zakat fitrah berdasarkan jumlah jiwa dan pilihan uang atau makanan pokok setara 2,5 kg / 3,5 liter.
- Semua perhitungan berjalan di browser tanpa backend, database, atau login.

## Dasar Perhitungan

- Nisab zakat penghasilan 2026: Rp7.640.144 per bulan atau Rp91.681.728 per tahun.
- Kadar zakat: 2,5%.
- Nisab tabungan: harga emas per gram x 85.
- Nisab emas: 85 gram.
- Nisab perdagangan/usaha: harga emas per gram x 85.
- Zakat fitrah: jumlah jiwa x nominal per jiwa, atau jumlah jiwa x nilai makanan pokok setara 2,5 kg / 3,5 liter per jiwa.

Sumber:

- https://baznas.go.id/news-show/BAZNAS_RI_Tetapkan_Nisab_Zakat_Penghasilan_dan_Jasa_2026_Rp7.640.144_per_bulan/3777
- https://baznas.go.id/index.php/zakatpenghasilan
- https://baznas.go.id/zakatperdagangan
- https://baznas.go.id/index.php/zakatfitrah
- https://baznas.go.id/baznas-daerah
- https://baznas.go.id/artikel-show/Begini-Cara-Hitung-Zakat-yang-Mudah-dan-Sesuai-Syariat/2262

## Menjalankan Lokal

```bash
npm install
npm run dev
```

Lalu buka `http://localhost:3000`.

## Disclaimer

Hasil perhitungan bersifat simulasi edukatif dan bukan fatwa final.
