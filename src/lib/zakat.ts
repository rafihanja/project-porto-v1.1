import {
  GOLD_GRAM_NISAB,
  FITRAH_RICE_KG_PER_PERSON,
  FITRAH_STAPLE_LITER_PER_PERSON,
  INCOME_NISAB_MONTHLY,
  INCOME_NISAB_YEARLY,
  ZAKAT_RATE
} from "./constants";
import { formatPlainNumber, formatRupiah } from "./format";
import type { FitrahBasis, IncomePeriod, ZakatResult } from "@/types/zakat";

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

export function calculateGoldZakat(
  grams: number,
  goldPricePerGram: number,
  hasHaul: boolean
): ZakatResult {
  const goldValue = grams * goldPricePerGram;
  const nisab = goldPricePerGram * GOLD_GRAM_NISAB;
  const reachesNisab = grams >= GOLD_GRAM_NISAB;
  const isObligatory = reachesNisab && hasHaul;
  const zakatAmount = isObligatory ? goldValue * ZAKAT_RATE : 0;

  let statusTitle = "Belum mencapai nisab";
  let headline = "Jumlah emas ini belum mencapai nisab.";
  let explanation = "Nisab emas yang dipakai adalah 85 gram emas.";
  let tone: ZakatResult["tone"] = "neutral";

  if (reachesNisab && !hasHaul) {
    statusTitle = "Nisab tercapai, haul belum";
    headline = "Emas sudah mencapai nisab, tapi belum tersimpan 1 tahun.";
    explanation =
      "Untuk zakat emas, kepemilikan perlu mencapai nisab dan melewati haul sekitar 1 tahun.";
    tone = "warning";
  }

  if (isObligatory) {
    statusTitle = "Sudah memenuhi syarat";
    headline = "Emas kamu sudah mencapai nisab dan melewati haul.";
    explanation = "Estimasi zakat emas dihitung dari 2,5% nilai emas.";
    tone = "success";
  }

  return {
    mode: "gold",
    isObligatory,
    zakatAmount,
    nisabAmount: nisab,
    baseAmount: goldValue,
    progressToNisab: getProgress(goldValue, nisab),
    statusTitle,
    headline,
    explanation,
    formula: isObligatory
      ? `2,5% x (${formatPlainNumber(grams)} gram x ${formatRupiah(
          goldPricePerGram
        )})`
      : `${formatPlainNumber(
          grams
        )} gram dibandingkan dengan nisab ${GOLD_GRAM_NISAB} gram`,
    tone,
    details: [
      {
        label: "Jumlah emas",
        value: `${formatPlainNumber(grams)} gram`
      },
      {
        label: "Harga emas/gram",
        value: formatRupiah(goldPricePerGram)
      },
      {
        label: "Nilai emas",
        value: formatRupiah(goldValue)
      },
      {
        label: "Status haul",
        value: hasHaul ? "Sudah sekitar 1 tahun" : "Belum 1 tahun"
      }
    ]
  };
}

export function calculateBusinessZakat(
  liquidAssets: number,
  shortTermDebt: number,
  goldPricePerGram: number,
  hasHaul: boolean
): ZakatResult {
  const netAssets = Math.max(liquidAssets - shortTermDebt, 0);
  const nisab = goldPricePerGram * GOLD_GRAM_NISAB;
  const reachesNisab = netAssets >= nisab;
  const isObligatory = reachesNisab && hasHaul;
  const zakatAmount = isObligatory ? netAssets * ZAKAT_RATE : 0;

  let statusTitle = "Belum mencapai nisab";
  let headline = "Aset bersih usaha belum mencapai nisab.";
  let explanation =
    "Zakat usaha dihitung dari aset lancar dikurangi hutang jangka pendek.";
  let tone: ZakatResult["tone"] = "neutral";

  if (reachesNisab && !hasHaul) {
    statusTitle = "Nisab tercapai, haul belum";
    headline = "Aset bersih sudah mencapai nisab, tapi usaha belum haul.";
    explanation =
      "Untuk zakat perdagangan, aset usaha perlu mencapai nisab dan berjalan sekitar 1 tahun.";
    tone = "warning";
  }

  if (isObligatory) {
    statusTitle = "Sudah memenuhi syarat";
    headline = "Aset bersih usaha sudah mencapai nisab dan melewati haul.";
    explanation =
      "Estimasi zakat usaha dihitung dari 2,5% aset lancar dikurangi hutang jangka pendek.";
    tone = "success";
  }

  return {
    mode: "business",
    isObligatory,
    zakatAmount,
    nisabAmount: nisab,
    baseAmount: netAssets,
    progressToNisab: getProgress(netAssets, nisab),
    statusTitle,
    headline,
    explanation,
    formula: isObligatory
      ? `2,5% x (${formatRupiah(liquidAssets)} - ${formatRupiah(
          shortTermDebt
        )})`
      : `${formatRupiah(netAssets)} dibandingkan dengan nisab ${formatRupiah(
          nisab
        )}`,
    tone,
    details: [
      {
        label: "Aset lancar",
        value: formatRupiah(liquidAssets)
      },
      {
        label: "Hutang pendek",
        value: formatRupiah(shortTermDebt)
      },
      {
        label: "Aset bersih",
        value: formatRupiah(netAssets)
      },
      {
        label: "Nisab usaha",
        value: formatRupiah(nisab)
      },
      {
        label: "Status haul",
        value: hasHaul ? "Sudah sekitar 1 tahun" : "Belum 1 tahun"
      }
    ]
  };
}

export function calculateFitrahZakat(
  peopleCount: number,
  amountOrMarketPrice: number,
  basis: FitrahBasis
): ZakatResult {
  const amountPerPerson =
    basis === "money"
      ? amountOrMarketPrice
      : basis === "riceKg"
        ? FITRAH_RICE_KG_PER_PERSON * amountOrMarketPrice
        : FITRAH_STAPLE_LITER_PER_PERSON * amountOrMarketPrice;
  const zakatAmount = peopleCount * amountPerPerson;
  const basisLabel =
    basis === "money"
      ? "Uang per jiwa"
      : basis === "riceKg"
        ? "Beras 2,5 kg per jiwa"
        : "Makanan pokok 3,5 liter per jiwa";
  const formula =
    basis === "money"
      ? `${formatPlainNumber(peopleCount)} jiwa x ${formatRupiah(amountPerPerson)}`
      : basis === "riceKg"
        ? `${formatPlainNumber(
            peopleCount
          )} jiwa x ${formatPlainNumber(
            FITRAH_RICE_KG_PER_PERSON
          )} kg x ${formatRupiah(amountOrMarketPrice)}`
        : `${formatPlainNumber(
            peopleCount
          )} jiwa x ${formatPlainNumber(
            FITRAH_STAPLE_LITER_PER_PERSON
          )} liter x ${formatRupiah(amountOrMarketPrice)}`;

  return {
    mode: "fitrah",
    isObligatory: true,
    zakatAmount,
    nisabAmount: amountPerPerson,
    baseAmount: peopleCount,
    progressToNisab: 100,
    statusTitle: "Siap ditunaikan",
    headline: "Estimasi zakat fitrah sudah dihitung per jiwa.",
    explanation:
      "Zakat fitrah dapat berupa makanan pokok atau nilai uang yang mengikuti harga pasar dan ketentuan wilayah setempat.",
    formula,
    tone: "success",
    details: [
      {
        label: "Jumlah jiwa",
        value: `${formatPlainNumber(peopleCount)} orang`
      },
      {
        label: "Acuan",
        value: basisLabel
      },
      {
        label: basis === "money" ? "Nominal per jiwa" : "Harga pasar",
        value: formatRupiah(amountOrMarketPrice)
      },
      {
        label: "Nilai per jiwa",
        value: formatRupiah(amountPerPerson)
      },
      {
        label: "Total fitrah",
        value: formatRupiah(zakatAmount)
      }
    ]
  };
}
