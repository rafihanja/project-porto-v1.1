import {
  GOLD_GRAM_NISAB,
  INCOME_NISAB_MONTHLY,
  INCOME_NISAB_YEARLY,
  ZAKAT_RATE
} from "./constants";
import { formatRupiah } from "./format";
import type { IncomePeriod, ZakatResult } from "@/types/zakat";

function getProgress(amount: number, nisab: number): number {
  if (nisab <= 0) {
    return 0;
  }

  return Math.min(Math.round((amount / nisab) * 100), 100);
}

export function calculateIncomeZakat(
  amount: number,
  period: IncomePeriod
): ZakatResult {
  const nisab =
    period === "monthly" ? INCOME_NISAB_MONTHLY : INCOME_NISAB_YEARLY;
  const isObligatory = amount >= nisab;
  const zakatAmount = isObligatory ? amount * ZAKAT_RATE : 0;
  const periodLabel = period === "monthly" ? "bulanan" : "tahunan";

  return {
    mode: "income",
    isObligatory,
    zakatAmount,
    nisabAmount: nisab,
    baseAmount: amount,
    progressToNisab: getProgress(amount, nisab),
    statusTitle: isObligatory
      ? "Sudah mencapai nisab"
      : "Belum mencapai nisab",
    headline: isObligatory
      ? `Penghasilan kamu sudah melewati nisab ${periodLabel}.`
      : `Penghasilan ini belum mencapai nisab ${periodLabel}.`,
    explanation: isObligatory
      ? "Estimasi zakat dihitung dari 2,5% nominal penghasilan yang kamu masukkan."
      : "Kamu belum wajib zakat dari nominal ini, tapi tetap bisa bersedekah sesuai kemampuan.",
    formula: isObligatory
      ? `2,5% x ${formatRupiah(amount)}`
      : `${formatRupiah(amount)} dibandingkan dengan nisab ${formatRupiah(
          nisab
        )}`,
    tone: isObligatory ? "success" : "neutral",
    details: [
      {
        label: "Nominal dicek",
        value: formatRupiah(amount)
      },
      {
        label: "Nisab yang dipakai",
        value: formatRupiah(nisab)
      },
      {
        label: "Periode",
        value: period === "monthly" ? "Bulanan" : "Tahunan"
      }
    ]
  };
}

export function calculateSavingsZakat(
  amount: number,
  goldPricePerGram: number,
  hasHaul: boolean
): ZakatResult {
  const nisab = goldPricePerGram * GOLD_GRAM_NISAB;
  const reachesNisab = amount >= nisab;
  const isObligatory = reachesNisab && hasHaul;
  const zakatAmount = isObligatory ? amount * ZAKAT_RATE : 0;

  let statusTitle = "Belum mencapai nisab";
  let headline = "Saldo ini belum mencapai nisab tabungan.";
  let explanation =
    "Nisab tabungan dihitung dari harga emas per gram dikali 85 gram.";
  let tone: ZakatResult["tone"] = "neutral";

  if (reachesNisab && !hasHaul) {
    statusTitle = "Nisab tercapai, haul belum";
    headline = "Saldo sudah mencapai nisab, tapi belum tersimpan 1 tahun.";
    explanation =
      "Untuk zakat tabungan, saldo perlu mencapai nisab dan melewati haul sekitar 1 tahun.";
    tone = "warning";
  }

  if (isObligatory) {
    statusTitle = "Sudah memenuhi syarat";
    headline = "Saldo kamu sudah mencapai nisab dan melewati haul.";
    explanation =
      "Estimasi zakat tabungan dihitung dari 2,5% saldo yang kamu masukkan.";
    tone = "success";
  }

  return {
    mode: "savings",
    isObligatory,
    zakatAmount,
    nisabAmount: nisab,
    baseAmount: amount,
    progressToNisab: getProgress(amount, nisab),
    statusTitle,
    headline,
    explanation,
    formula: isObligatory
      ? `2,5% x ${formatRupiah(amount)}`
      : `${formatRupiah(amount)} dibandingkan dengan nisab ${formatRupiah(
          nisab
        )}`,
    tone,
    details: [
      {
        label: "Saldo dicek",
        value: formatRupiah(amount)
      },
      {
        label: "Harga emas/gram",
        value: formatRupiah(goldPricePerGram)
      },
      {
        label: "Nisab tabungan",
        value: formatRupiah(nisab)
      },
      {
        label: "Status haul",
        value: hasHaul ? "Sudah sekitar 1 tahun" : "Belum 1 tahun"
      }
    ]
  };
}
