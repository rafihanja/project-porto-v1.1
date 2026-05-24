import { formatRupiah } from "@/lib/format";
import type { CalculatorMode, ZakatResult } from "@/types/zakat";

type TotalSummaryProps = {
  results: Partial<Record<CalculatorMode, ZakatResult>>;
};

const labels: Record<CalculatorMode, string> = {
  income: "Penghasilan",
  savings: "Tabungan",
  gold: "Emas",
  business: "Usaha",
  fitrah: "Fitrah"
};

export function TotalSummary({ results }: TotalSummaryProps) {
  const entries = Object.entries(results) as Array<[CalculatorMode, ZakatResult]>;
  const total = entries.reduce((sum, [, result]) => sum + result.zakatAmount, 0);

  return (
    <aside className="total-summary" aria-label="Ringkasan total">
      <div className="total-summary-head">
        <span>Total estimasi</span>
        <strong>{formatRupiah(total)}</strong>
      </div>
      {entries.length > 0 ? (
        <ul>
          {entries.map(([mode, result]) => (
            <li key={mode}>
              <span>{labels[mode]}</span>
              <strong>{formatRupiah(result.zakatAmount)}</strong>
            </li>
          ))}
        </ul>
      ) : (
        <p>Hitung salah satu mode dulu untuk mengisi ringkasan.</p>
      )}
    </aside>
  );
}
