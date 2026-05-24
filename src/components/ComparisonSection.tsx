const comparisons = [
  {
    title: "Kalau kamu baru gajian",
    eyebrow: "Penghasilan",
    description:
      "Pakai mode ini untuk cek gaji, honor, upah, atau invoice freelance yang baru masuk.",
    facts: [
      "Nisab 2026: Rp7.640.144/bulan",
      "Bisa juga dicek tahunan",
      "Kadar zakat: 2,5%"
    ]
  },
  {
    title: "Kalau saldo sudah mengendap",
    eyebrow: "Tabungan",
    description:
      "Pakai mode ini untuk saldo yang memang tersimpan, bukan uang yang cuma lewat sebentar.",
    facts: [
      "Nisab: 85 gram emas",
      "Harga emas diisi sendiri",
      "Perlu tersimpan sekitar 1 tahun"
    ]
  }
];

export function ComparisonSection() {
  return (
    <section className="comparison-section" aria-labelledby="comparison-title">
      <div className="section-shell split-heading">
        <div>
          <span className="section-kicker">Kasus paling umum</span>
          <h2 id="comparison-title">Dibuat dari pertanyaan yang biasanya muncul.</h2>
        </div>
        <p>
          Orang biasanya tidak mulai dari istilah fikih. Mereka mulai dari
          pertanyaan sederhana: gaji ini sudah kena zakat atau tabungan ini
          sudah wajib dizakati?
        </p>
      </div>

      <div className="section-shell comparison-grid">
        {comparisons.map((item) => (
          <article className="comparison-card" key={item.title}>
            <span>{item.eyebrow}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <ul>
              {item.facts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
