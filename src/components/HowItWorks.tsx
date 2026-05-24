const steps = [
  {
    number: "01",
    title: "Pilih yang mau dicek",
    text: "Mulai dari penghasilan dulu, atau langsung cek tabungan kalau saldonya sudah lama mengendap."
  },
  {
    number: "02",
    title: "Isi angka seadanya",
    text: "Tidak perlu bikin akun. Masukkan nominal, lalu tambahkan harga emas dan status 1 tahun kalau memilih tabungan."
  },
  {
    number: "03",
    title: "Baca alasannya",
    text: "Hasil tidak cuma angka. Ada pembanding nisab, rumus, dan catatan kenapa wajib atau belum wajib."
  }
];

export function HowItWorks() {
  return (
    <section className="how-section" id="panduan" aria-labelledby="how-title">
      <div className="section-shell">
        <div className="center-heading">
          <span className="section-kicker">Cara pakai</span>
          <h2 id="how-title">Tidak dibuat ribet.</h2>
          <p>
            Web ini sengaja pendek karena yang dibutuhkan user biasanya cuma
            jawaban awal sebelum mereka membayar lewat lembaga resmi.
          </p>
        </div>

        <div className="timeline">
          {steps.map((step) => (
            <article className="timeline-item" key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
