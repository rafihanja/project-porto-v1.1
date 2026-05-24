import {
  BAZNAS_CALC_ARTICLE_URL,
  BAZNAS_FITRAH_PAGE_URL,
  BAZNAS_INCOME_PAGE_URL,
  BAZNAS_INCOME_SOURCE_URL,
  BAZNAS_REGIONAL_PAGE_URL,
  BAZNAS_TRADE_PAGE_URL
} from "@/lib/constants";

const notes = [
  {
    label: "Nisab penghasilan",
    text: "Angka yang dipakai mengikuti ketetapan BAZNAS RI tahun 2026: Rp7.640.144 per bulan atau Rp91.681.728 per tahun."
  },
  {
    label: "Tabungan dan emas",
    text: "Menggunakan acuan 85 gram emas. Harga emas dimasukkan manual karena nilainya bisa berubah."
  },
  {
    label: "Perdagangan/usaha",
    text: "Mengikuti rumus BAZNAS: 2,5% x aset lancar dikurangi hutang jangka pendek, jika mencapai nisab dan haul."
  },
  {
    label: "Zakat fitrah",
    text: "Bisa dihitung sebagai uang, 2,5 kg beras per jiwa, atau 3,5 liter makanan pokok per jiwa. Nominal uang dan harga pasar perlu mengikuti ketentuan daerah setempat."
  },
  {
    label: "Kadar zakat",
    text: "Perhitungan zakat mal di kalkulator ini memakai kadar 2,5%."
  }
];

export function SourceSection() {
  return (
    <section className="source-section" id="sumber" aria-labelledby="source-title">
      <div className="section-shell source-layout">
        <div>
          <span className="section-kicker">Catatan sumber</span>
          <h2 id="source-title">Angkanya bisa dicek ulang.</h2>
          <p>
            Bagian ini dibuat supaya user tahu batasan kalkulatornya. Kalau
            angka resmi berubah, nilai nisab di source perlu diperbarui.
          </p>
          <div className="source-actions">
            <a href={BAZNAS_INCOME_SOURCE_URL} target="_blank" rel="noreferrer">
              Berita BAZNAS 2026
            </a>
            <a href={BAZNAS_INCOME_PAGE_URL} target="_blank" rel="noreferrer">
              Halaman zakat penghasilan
            </a>
            <a href={BAZNAS_TRADE_PAGE_URL} target="_blank" rel="noreferrer">
              Zakat perdagangan
            </a>
            <a href={BAZNAS_FITRAH_PAGE_URL} target="_blank" rel="noreferrer">
              Zakat fitrah
            </a>
            <a href={BAZNAS_REGIONAL_PAGE_URL} target="_blank" rel="noreferrer">
              Ketentuan daerah
            </a>
            <a href={BAZNAS_CALC_ARTICLE_URL} target="_blank" rel="noreferrer">
              Panduan hitung zakat
            </a>
          </div>
        </div>

        <div className="source-notes">
          {notes.map((note) => (
            <article key={note.label}>
              <h3>{note.label}</h3>
              <p>{note.text}</p>
            </article>
          ))}
          <div className="disclaimer">
            Hasil ini hanya simulasi edukatif. Untuk kondisi yang lebih
            spesifik, tetap cek ke amil zakat atau lembaga resmi.
          </div>
        </div>
      </div>
    </section>
  );
}
