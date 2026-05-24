# Cek Zakat

Cek Zakat adalah web kalkulator sederhana untuk menghitung estimasi zakat penghasilan dan zakat tabungan.

## Fokus MVP

- Zakat penghasilan untuk gaji, honor, upah, jasa, dan freelance.
- Zakat tabungan dengan acuan 85 gram emas dan status haul.
- Semua perhitungan berjalan di browser tanpa backend, database, atau login.

## Dasar Perhitungan

- Nisab zakat penghasilan 2026: Rp7.640.144 per bulan atau Rp91.681.728 per tahun.
- Kadar zakat: 2,5%.
- Nisab tabungan: harga emas per gram x 85.

Sumber:

- https://baznas.go.id/news-show/BAZNAS_RI_Tetapkan_Nisab_Zakat_Penghasilan_dan_Jasa_2026_Rp7.640.144_per_bulan/3777
- https://baznas.go.id/index.php/zakatpenghasilan

## Menjalankan Lokal

```bash
npm install
npm run dev
```

Lalu buka `http://localhost:3000`.

## Disclaimer

Hasil perhitungan bersifat simulasi edukatif dan bukan fatwa final.
