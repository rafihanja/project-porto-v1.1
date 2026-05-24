import { formatRupiah } from "@/lib/format";
import type { ZakatResult } from "@/types/zakat";
import { NisabProgress } from "./NisabProgress";

type ResultPanelProps = {
  result: ZakatResult | null;
};

export function ResultPanel({ result }: ResultPanelProps) {
  if (!result) {
    return (
      <section className="result-panel result-empty" aria-live="polite">
        <span className="result-eyebrow">Belum ada hasil</span>
        <h2>Isi angkanya dulu, nanti hasilnya muncul di sini.</h2>
        <p>
          Kamu akan lihat status nisab, estimasi zakat, rumus singkat, dan
          alasan kenapa hasilnya seperti itu.
        </p>
        <dl className="empty-preview" aria-label="Preview hasil">
          <div>
            <dt>Status</dt>
            <dd>Menunggu nominal</dd>
          </div>
          <div>
            <dt>Estimasi zakat</dt>
            <dd>Rp0</dd>
          </div>
          <div>
            <dt>Rumus</dt>
            <dd>Muncul setelah dihitung</dd>
          </div>
        </dl>
      </section>
    );
  }

  return (
    <section
      className={`result-panel result-${result.tone}`}
      aria-live="polite"
    >
      <div className="result-topline">
        <span className="status-badge">{result.statusTitle}</span>
        <span>{result.mode === "income" ? "Mode penghasilan" : "Mode tabungan"}</span>
      </div>
      <div>
        <span className="result-eyebrow">Estimasi zakat</span>
        <h2>{formatRupiah(result.zakatAmount)}</h2>
      </div>
      <p className="result-headline">{result.headline}</p>
      <p>{result.explanation}</p>
      <NisabProgress progress={result.progressToNisab} />
      <dl className="result-details">
        {result.details.map((detail) => (
          <div key={detail.label}>
            <dt>{detail.label}</dt>
            <dd>{detail.value}</dd>
          </div>
        ))}
        <div>
          <dt>Rumus</dt>
          <dd>{result.formula}</dd>
        </div>
      </dl>
    </section>
  );
}
