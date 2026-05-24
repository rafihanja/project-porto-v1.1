import {
  BAZNAS_INCOME_PAGE_URL,
  BAZNAS_INCOME_SOURCE_URL
} from "@/lib/constants";

const notes = [
  {
    label: "Nisab penghasilan",
    text: "Angka yang dipakai mengikuti ketetapan BAZNAS RI tahun 2026: Rp7.640.144 per bulan atau Rp91.681.728 per tahun."
  },
  {
    label: "Nisab tabungan",
    text: "Menggunakan acuan 85 gram emas. Harga emas dimasukkan manual karena nilainya bisa berubah."
  },
  {
    label: "Kadar zakat",
    text: "Perhitungan awal ini memakai kadar 2,5% untuk penghasilan dan tabungan."
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
