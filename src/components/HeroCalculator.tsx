"use client";

import { useMemo, useState } from "react";
import {
  BAZNAS_REGIONAL_PAGE_URL,
  FITRAH_RICE_KG_PER_PERSON,
  FITRAH_STAPLE_LITER_PER_PERSON,
  GOLD_GRAM_NISAB,
  INCOME_NISAB_MONTHLY,
  INCOME_NISAB_YEARLY,
  ZAKAT_RATE
} from "@/lib/constants";
import {
  formatNumberInput,
  formatPlainNumber,
  formatRupiah,
  parseCurrencyInput
} from "@/lib/format";
import { validateMoneyInput, validateNumberInput } from "@/lib/validation";
import {
  calculateBusinessZakat,
  calculateFitrahZakat,
  calculateGoldZakat,
  calculateIncomeZakat,
  calculateSavingsZakat
} from "@/lib/zakat";
import type {
  CalculatorMode,
  FitrahBasis,
  IncomePeriod,
  ZakatResult
} from "@/types/zakat";
import { CurrencyInput } from "./CurrencyInput";
import { NumberInput } from "./NumberInput";
import { ResultPanel } from "./ResultPanel";
import { TotalSummary } from "./TotalSummary";

type ResultMap = Partial<Record<CalculatorMode, ZakatResult>>;

const modeOptions: Array<{
  mode: CalculatorMode;
  label: string;
  title: string;
}> = [
  { mode: "income", label: "Penghasilan", title: "Gaji / honor" },
  { mode: "savings", label: "Tabungan", title: "Saldo 1 tahun" },
  { mode: "gold", label: "Emas", title: "Gram emas" },
  { mode: "business", label: "Usaha", title: "Aset bersih" },
  { mode: "fitrah", label: "Fitrah", title: "Per jiwa" }
];

const modeCopy: Record<CalculatorMode, string> = {
  income: "Gaji, honor, bonus, atau invoice freelance.",
  savings: "Saldo tabungan, harga emas, dan status haul.",
  gold: "Jumlah emas, harga per gram, dan status kepemilikan 1 tahun.",
  business: "Aset lancar usaha dikurangi hutang jangka pendek.",
  fitrah: "Jumlah jiwa dikali uang, beras 2,5 kg, atau makanan pokok 3,5 liter."
};

const modeHeading: Record<CalculatorMode, string> = {
  income: "Cek pemasukan",
  savings: "Cek tabungan",
  gold: "Cek emas",
  business: "Cek usaha",
  fitrah: "Cek fitrah"
};

export function HeroCalculator() {
  const [mode, setMode] = useState<CalculatorMode>("income");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [incomePeriod, setIncomePeriod] = useState<IncomePeriod>("monthly");
  const [savingAmount, setSavingAmount] = useState("");
  const [savingsGoldPrice, setSavingsGoldPrice] = useState("");
  const [savingsHasHaul, setSavingsHasHaul] = useState<boolean | null>(null);
  const [goldGrams, setGoldGrams] = useState("");
  const [goldPrice, setGoldPrice] = useState("");
  const [goldHasHaul, setGoldHasHaul] = useState<boolean | null>(null);
  const [businessAssets, setBusinessAssets] = useState("");
  const [businessDebt, setBusinessDebt] = useState("");
  const [businessGoldPrice, setBusinessGoldPrice] = useState("");
  const [businessHasHaul, setBusinessHasHaul] = useState<boolean | null>(null);
  const [fitrahPeople, setFitrahPeople] = useState("");
  const [fitrahAmount, setFitrahAmount] = useState("");
  const [fitrahBasis, setFitrahBasis] = useState<FitrahBasis>("money");
  const [results, setResults] = useState<ResultMap>({});
  const [error, setError] = useState<string | null>(null);

  const activeResult = results[mode] ?? null;
  const activeMode = useMemo(
    () => modeOptions.find((option) => option.mode === mode) ?? modeOptions[0],
    [mode]
  );

  function clearResultFor(targetMode: CalculatorMode) {
    setResults((current) => {
      if (!current[targetMode]) {
        return current;
      }

      const next = { ...current };
      delete next[targetMode];
      return next;
    });
  }

  function switchMode(nextMode: CalculatorMode) {
    setMode(nextMode);
    setError(null);
  }

  function saveResult(result: ZakatResult) {
    setResults((current) => ({
      ...current,
      [result.mode]: result
    }));
  }

  function resetCalculator() {
    setIncomeAmount("");
    setIncomePeriod("monthly");
    setSavingAmount("");
    setSavingsGoldPrice("");
    setSavingsHasHaul(null);
    setGoldGrams("");
    setGoldPrice("");
    setGoldHasHaul(null);
    setBusinessAssets("");
    setBusinessDebt("");
    setBusinessGoldPrice("");
    setBusinessHasHaul(null);
    setFitrahPeople("");
    setFitrahAmount("");
    setFitrahBasis("money");
    setResults({});
    setError(null);
  }

  function setIncomePreset(amount: number, period: IncomePeriod = "monthly") {
    setMode("income");
    setIncomeAmount(formatNumberInput(String(amount)));
    setIncomePeriod(period);
    clearResultFor("income");
    setError(null);
  }

  function setSavingsPreset(amount: number, gold: number, haul: boolean) {
    setMode("savings");
    setSavingAmount(formatNumberInput(String(amount)));
    setSavingsGoldPrice(formatNumberInput(String(gold)));
    setSavingsHasHaul(haul);
    clearResultFor("savings");
    setError(null);
  }

  function setGoldPreset(grams: number, price: number, haul: boolean) {
    setMode("gold");
    setGoldGrams(String(grams));
    setGoldPrice(formatNumberInput(String(price)));
    setGoldHasHaul(haul);
    clearResultFor("gold");
    setError(null);
  }

  function setBusinessPreset(
    assets: number,
    debt: number,
    gold: number,
    haul: boolean
  ) {
    setMode("business");
    setBusinessAssets(formatNumberInput(String(assets)));
    setBusinessDebt(formatNumberInput(String(debt)));
    setBusinessGoldPrice(formatNumberInput(String(gold)));
    setBusinessHasHaul(haul);
    clearResultFor("business");
    setError(null);
  }

  function setFitrahPreset(
    people: number,
    amount: number,
    basis: FitrahBasis = "money"
  ) {
    setMode("fitrah");
    setFitrahBasis(basis);
    setFitrahPeople(String(people));
    setFitrahAmount(formatNumberInput(String(amount)));
    clearResultFor("fitrah");
    setError(null);
  }

  function handleCalculate() {
    setError(null);

    if (mode === "income") {
      const validation = validateMoneyInput(
        incomeAmount,
        "Nominal penghasilan"
      );

      if (!validation.ok) {
        setError(validation.message);
        clearResultFor("income");
        return;
      }

      saveResult(calculateIncomeZakat(validation.value, incomePeriod));
      return;
    }

    if (mode === "savings") {
      const savingValidation = validateMoneyInput(
        savingAmount,
        "Saldo tabungan"
      );
      const goldValidation = validateMoneyInput(
        savingsGoldPrice,
        "Harga emas per gram"
      );

      if (!savingValidation.ok) {
        setError(savingValidation.message);
        clearResultFor("savings");
        return;
      }

      if (!goldValidation.ok) {
        setError(goldValidation.message);
        clearResultFor("savings");
        return;
      }

      if (savingsHasHaul === null) {
        setError("Pilih dulu apakah saldo ini sudah tersimpan sekitar 1 tahun.");
        clearResultFor("savings");
        return;
      }

      saveResult(
        calculateSavingsZakat(
          savingValidation.value,
          goldValidation.value,
          savingsHasHaul
        )
      );
      return;
    }

    if (mode === "gold") {
      const gramsValidation = validateNumberInput(goldGrams, "Jumlah emas");
      const priceValidation = validateMoneyInput(goldPrice, "Harga emas per gram");

      if (!gramsValidation.ok) {
        setError(gramsValidation.message);
        clearResultFor("gold");
        return;
      }

      if (!priceValidation.ok) {
        setError(priceValidation.message);
        clearResultFor("gold");
        return;
      }

      if (goldHasHaul === null) {
        setError("Pilih dulu apakah emas ini sudah dimiliki sekitar 1 tahun.");
        clearResultFor("gold");
        return;
      }

      saveResult(
        calculateGoldZakat(
          gramsValidation.value,
          priceValidation.value,
          goldHasHaul
        )
      );
      return;
    }

    if (mode === "business") {
      const assetsValidation = validateMoneyInput(
        businessAssets,
        "Aset lancar usaha"
      );
      const goldValidation = validateMoneyInput(
        businessGoldPrice,
        "Harga emas per gram"
      );
      const debt = parseCurrencyInput(businessDebt);

      if (!assetsValidation.ok) {
        setError(assetsValidation.message);
        clearResultFor("business");
        return;
      }

      if (!goldValidation.ok) {
        setError(goldValidation.message);
        clearResultFor("business");
        return;
      }

      if (businessHasHaul === null) {
        setError("Pilih dulu apakah usaha ini sudah berjalan sekitar 1 tahun.");
        clearResultFor("business");
        return;
      }

      saveResult(
        calculateBusinessZakat(
          assetsValidation.value,
          debt,
          goldValidation.value,
          businessHasHaul
        )
      );
      return;
    }

    const peopleValidation = validateNumberInput(fitrahPeople, "Jumlah jiwa");
    const amountValidation = validateMoneyInput(
      fitrahAmount,
      fitrahBasis === "money"
        ? "Nominal fitrah per jiwa"
        : fitrahBasis === "riceKg"
          ? "Harga beras per kg"
          : "Harga makanan pokok per liter"
    );

    if (!peopleValidation.ok) {
      setError(peopleValidation.message);
      clearResultFor("fitrah");
      return;
    }

    if (!Number.isInteger(peopleValidation.value)) {
      setError("Jumlah jiwa perlu berupa angka bulat.");
      clearResultFor("fitrah");
      return;
    }

    if (!amountValidation.ok) {
      setError(amountValidation.message);
      clearResultFor("fitrah");
      return;
    }

    saveResult(
      calculateFitrahZakat(
        peopleValidation.value,
        amountValidation.value,
        fitrahBasis
      )
    );
  }

  const previewNisab = useMemo(() => {
    if (mode === "income") {
      return incomePeriod === "monthly"
        ? INCOME_NISAB_MONTHLY
        : INCOME_NISAB_YEARLY;
    }

    if (mode === "savings") {
      return parseCurrencyInput(savingsGoldPrice) * GOLD_GRAM_NISAB;
    }

    if (mode === "gold") {
      return parseCurrencyInput(goldPrice) * GOLD_GRAM_NISAB;
    }

    if (mode === "business") {
      return parseCurrencyInput(businessGoldPrice) * GOLD_GRAM_NISAB;
    }

    return parseCurrencyInput(fitrahAmount);
  }, [
    businessGoldPrice,
    fitrahBasis,
    fitrahAmount,
    goldPrice,
    incomePeriod,
    mode,
    savingsGoldPrice
  ]);

  const fitrahAmountPerPerson =
    fitrahBasis === "money"
      ? previewNisab
      : fitrahBasis === "riceKg"
        ? previewNisab * FITRAH_RICE_KG_PER_PERSON
        : previewNisab * FITRAH_STAPLE_LITER_PER_PERSON;
  const fitrahSummaryLabel =
    fitrahBasis === "money"
      ? "Uang per jiwa"
      : fitrahBasis === "riceKg"
        ? `${formatPlainNumber(FITRAH_RICE_KG_PER_PERSON)} kg/jiwa`
        : `${formatPlainNumber(FITRAH_STAPLE_LITER_PER_PERSON)} liter/jiwa`;
  const summaryLabel = mode === "fitrah" ? "Acuan fitrah" : "Nisab pembanding";
  const summaryValue =
    mode === "fitrah"
      ? previewNisab > 0
        ? `${fitrahSummaryLabel} = ${formatRupiah(fitrahAmountPerPerson)}`
        : "Isi nominal"
      : previewNisab > 0
        ? formatRupiah(previewNisab)
        : "Isi harga emas";
  const secondaryLabel = mode === "fitrah" ? "Jiwa" : "Kadar";
  const secondaryValue =
    mode === "fitrah" ? fitrahPeople || "Isi jumlah" : `${ZAKAT_RATE * 100}%`;

  return (
    <section className="hero-section" id="top">
      <div className="section-shell hero-grid" id="kalkulator">
        <div className="hero-copy">
          <span className="section-kicker">Catatan hitung sederhana</span>
          <h1>Cek dulu, nominal ini sudah kena zakat atau belum?</h1>
          <p>
            Buat kamu yang ingin cek penghasilan, tabungan, emas, usaha, atau
            fitrah tanpa harus buka banyak artikel dulu. Angkanya transparan,
            hasilnya tetap gampang dibaca.
          </p>
          <div className="daily-note" aria-label="Ringkasan aturan hitung">
            <div>
              <span>Nisab penghasilan 2026</span>
              <strong>{formatRupiah(INCOME_NISAB_MONTHLY)}/bulan</strong>
            </div>
            <div>
              <span>Mode sekarang</span>
              <strong>{activeMode.label}</strong>
            </div>
            <div>
              <span>Catatan</span>
              <strong>Hasilnya estimasi, bukan fatwa final</strong>
            </div>
          </div>
        </div>

        <div className="calculator-tool">
          <div className="tool-topbar">
            <div className="tool-title">
              <span className="window-dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <strong>Kalkulator</strong>
            </div>
            <button className="ghost-action" type="button" onClick={resetCalculator}>
              Reset
            </button>
          </div>

          <div className="tool-body">
            <div className="calc-workbench">
              <div className="calc-intro">
                <div>
                  <span className="section-kicker">Ruang hitung</span>
                  <h2>{modeHeading[mode]}</h2>
                </div>
                <p>{modeCopy[mode]}</p>
              </div>

              <div className="mode-dock" role="tablist" aria-label="Jenis zakat">
                {modeOptions.map((option) => (
                  <button
                    className={mode === option.mode ? "active" : ""}
                    type="button"
                    role="tab"
                    aria-selected={mode === option.mode}
                    onClick={() => switchMode(option.mode)}
                    key={option.mode}
                  >
                    <span>{option.label}</span>
                    <strong>{option.title}</strong>
                  </button>
                ))}
              </div>

              <div className="preset-row" aria-label="Contoh cepat">
                <span>Contoh cepat</span>
                {mode === "income" ? (
                  <>
                    <button type="button" onClick={() => setIncomePreset(5_000_000)}>
                      5 jt
                    </button>
                    <button type="button" onClick={() => setIncomePreset(10_000_000)}>
                      10 jt
                    </button>
                    <button
                      type="button"
                      onClick={() => setIncomePreset(120_000_000, "yearly")}
                    >
                      120 jt/tahun
                    </button>
                  </>
                ) : null}
                {mode === "savings" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setSavingsPreset(75_000_000, 1_200_000, true)}
                    >
                      75 jt
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSavingsPreset(120_000_000, 1_200_000, true)
                      }
                    >
                      120 jt
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSavingsPreset(120_000_000, 1_200_000, false)
                      }
                    >
                      Belum haul
                    </button>
                  </>
                ) : null}
                {mode === "gold" ? (
                  <>
                    <button type="button" onClick={() => setGoldPreset(40, 1_200_000, true)}>
                      40 gr
                    </button>
                    <button type="button" onClick={() => setGoldPreset(90, 1_200_000, true)}>
                      90 gr
                    </button>
                    <button type="button" onClick={() => setGoldPreset(90, 1_200_000, false)}>
                      Belum haul
                    </button>
                  </>
                ) : null}
                {mode === "business" ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setBusinessPreset(200_000_000, 50_000_000, 1_200_000, true)
                      }
                    >
                      Usaha 200 jt
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setBusinessPreset(90_000_000, 20_000_000, 1_200_000, true)
                      }
                    >
                      Belum nisab
                    </button>
                  </>
                ) : null}
                {mode === "fitrah" ? (
                  <>
                    <button type="button" onClick={() => setFitrahPreset(4, 50_000)}>
                      Uang 4 jiwa
                    </button>
                    <button
                      type="button"
                      onClick={() => setFitrahPreset(4, 16_000, "riceKg")}
                    >
                      Beras/kg
                    </button>
                    <button
                      type="button"
                      onClick={() => setFitrahPreset(4, 12_000, "stapleLiter")}
                    >
                      3,5 liter
                    </button>
                  </>
                ) : null}
              </div>

              {mode === "income" ? (
                <div className="input-board income-board">
                  <CurrencyInput
                    id="incomeAmount"
                    label="Nominal"
                    value={incomeAmount}
                    placeholder="10.000.000"
                    helper="Pemasukan yang mau dicek."
                    compactHelper
                    onChange={(value) => {
                      setIncomeAmount(value);
                      clearResultFor("income");
                    }}
                  />
                  <div className="input-card period-card">
                    <span className="field-label">Periode</span>
                    <div className="choice-row">
                      <button
                        className={incomePeriod === "monthly" ? "active" : ""}
                        type="button"
                        onClick={() => {
                          setIncomePeriod("monthly");
                          clearResultFor("income");
                        }}
                      >
                        Bulanan
                      </button>
                      <button
                        className={incomePeriod === "yearly" ? "active" : ""}
                        type="button"
                        onClick={() => {
                          setIncomePeriod("yearly");
                          clearResultFor("income");
                        }}
                      >
                        Tahunan
                      </button>
                    </div>
                    <small>
                      Bulanan untuk gaji atau honor bulan ini. Tahunan untuk
                      total penghasilan selama 1 tahun.
                    </small>
                  </div>
                </div>
              ) : null}

              {mode === "savings" ? (
                <div className="input-board savings-board">
                  <CurrencyInput
                    id="savingAmount"
                    label="Saldo"
                    value={savingAmount}
                    placeholder="120.000.000"
                    helper="Saldo yang cukup stabil."
                    compactHelper
                    onChange={(value) => {
                      setSavingAmount(value);
                      clearResultFor("savings");
                    }}
                  />
                  <CurrencyInput
                    id="savingsGoldPrice"
                    label="Emas / gram"
                    value={savingsGoldPrice}
                    placeholder="1.200.000"
                    helper="Isi harga saat ini."
                    compactHelper
                    onChange={(value) => {
                      setSavingsGoldPrice(value);
                      clearResultFor("savings");
                    }}
                  />
                  <div className="input-card haul-card">
                    <span className="field-label">Haul</span>
                    <div className="choice-row">
                      <button
                        className={savingsHasHaul === true ? "active" : ""}
                        type="button"
                        onClick={() => {
                          setSavingsHasHaul(true);
                          clearResultFor("savings");
                        }}
                      >
                        Sudah
                      </button>
                      <button
                        className={savingsHasHaul === false ? "active" : ""}
                        type="button"
                        onClick={() => {
                          setSavingsHasHaul(false);
                          clearResultFor("savings");
                        }}
                      >
                        Belum
                      </button>
                    </div>
                    <small>Sekitar 1 tahun tersimpan.</small>
                  </div>
                </div>
              ) : null}

              {mode === "gold" ? (
                <div className="input-board gold-board">
                  <NumberInput
                    id="goldGrams"
                    label="Jumlah emas"
                    value={goldGrams}
                    placeholder="90"
                    unit="gram"
                    helper="Bisa emas batangan atau perhiasan yang dihitung."
                    onChange={(value) => {
                      setGoldGrams(value);
                      clearResultFor("gold");
                    }}
                  />
                  <CurrencyInput
                    id="goldPrice"
                    label="Emas / gram"
                    value={goldPrice}
                    placeholder="1.200.000"
                    helper="Harga emas yang ingin dipakai."
                    compactHelper
                    onChange={(value) => {
                      setGoldPrice(value);
                      clearResultFor("gold");
                    }}
                  />
                  <div className="input-card haul-card">
                    <span className="field-label">Haul</span>
                    <div className="choice-row">
                      <button
                        className={goldHasHaul === true ? "active" : ""}
                        type="button"
                        onClick={() => {
                          setGoldHasHaul(true);
                          clearResultFor("gold");
                        }}
                      >
                        Sudah
                      </button>
                      <button
                        className={goldHasHaul === false ? "active" : ""}
                        type="button"
                        onClick={() => {
                          setGoldHasHaul(false);
                          clearResultFor("gold");
                        }}
                      >
                        Belum
                      </button>
                    </div>
                    <small>Nisab emas: 85 gram.</small>
                  </div>
                </div>
              ) : null}

              {mode === "business" ? (
                <div className="input-board business-board">
                  <CurrencyInput
                    id="businessAssets"
                    label="Aset lancar"
                    value={businessAssets}
                    placeholder="200.000.000"
                    helper="Kas, stok, piutang lancar."
                    compactHelper
                    onChange={(value) => {
                      setBusinessAssets(value);
                      clearResultFor("business");
                    }}
                  />
                  <CurrencyInput
                    id="businessDebt"
                    label="Hutang pendek"
                    value={businessDebt}
                    placeholder="50.000.000"
                    helper="Boleh dikosongkan kalau tidak ada."
                    compactHelper
                    onChange={(value) => {
                      setBusinessDebt(value);
                      clearResultFor("business");
                    }}
                  />
                  <CurrencyInput
                    id="businessGoldPrice"
                    label="Emas / gram"
                    value={businessGoldPrice}
                    placeholder="1.200.000"
                    helper="Untuk menentukan nisab usaha."
                    compactHelper
                    onChange={(value) => {
                      setBusinessGoldPrice(value);
                      clearResultFor("business");
                    }}
                  />
                  <div className="input-card haul-card">
                    <span className="field-label">Haul usaha</span>
                    <div className="choice-row">
                      <button
                        className={businessHasHaul === true ? "active" : ""}
                        type="button"
                        onClick={() => {
                          setBusinessHasHaul(true);
                          clearResultFor("business");
                        }}
                      >
                        Sudah
                      </button>
                      <button
                        className={businessHasHaul === false ? "active" : ""}
                        type="button"
                        onClick={() => {
                          setBusinessHasHaul(false);
                          clearResultFor("business");
                        }}
                      >
                        Belum
                      </button>
                    </div>
                    <small>Usaha berjalan sekitar 1 tahun.</small>
                  </div>
                </div>
              ) : null}

              {mode === "fitrah" ? (
                <div className="input-board fitrah-board">
                  <div className="input-card fitrah-basis-card">
                    <span className="field-label">Acuan fitrah</span>
                    <div className="choice-row fitrah-basis-row">
                      <button
                        className={fitrahBasis === "money" ? "active" : ""}
                        type="button"
                        onClick={() => {
                          setFitrahBasis("money");
                          clearResultFor("fitrah");
                        }}
                      >
                        Uang
                      </button>
                      <button
                        className={fitrahBasis === "riceKg" ? "active" : ""}
                        type="button"
                        onClick={() => {
                          setFitrahBasis("riceKg");
                          clearResultFor("fitrah");
                        }}
                      >
                        2,5 kg
                      </button>
                      <button
                        className={fitrahBasis === "stapleLiter" ? "active" : ""}
                        type="button"
                        onClick={() => {
                          setFitrahBasis("stapleLiter");
                          clearResultFor("fitrah");
                        }}
                      >
                        3,5 liter
                      </button>
                    </div>
                    <small>
                      Beras atau makanan pokok mengikuti harga pasaran dan
                      ketentuan wilayah setempat.
                    </small>
                  </div>
                  <NumberInput
                    id="fitrahPeople"
                    label="Jumlah jiwa"
                    value={fitrahPeople}
                    placeholder="4"
                    unit="orang"
                    helper="Jumlah orang yang ingin dihitung."
                    onChange={(value) => {
                      setFitrahPeople(value);
                      clearResultFor("fitrah");
                    }}
                  />
                  <CurrencyInput
                    id="fitrahAmount"
                    label={
                      fitrahBasis === "money"
                        ? "Nominal / jiwa"
                        : fitrahBasis === "riceKg"
                          ? "Harga beras / kg"
                          : "Harga makanan pokok / liter"
                    }
                    value={fitrahAmount}
                    placeholder={
                      fitrahBasis === "money"
                        ? "50.000"
                        : fitrahBasis === "riceKg"
                          ? "16.000"
                          : "12.000"
                    }
                    helper={
                      fitrahBasis === "money"
                        ? "Ikuti ketetapan daerah atau lembaga resmi."
                        : "Isi harga pasaran bahan pokok di daerah kamu."
                    }
                    compactHelper
                    onChange={(value) => {
                      setFitrahAmount(value);
                      clearResultFor("fitrah");
                    }}
                  />
                  <a
                    className="local-rule-link"
                    href={BAZNAS_REGIONAL_PAGE_URL}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Cek ketentuan wilayah daerah setempat
                  </a>
                </div>
              ) : null}

              <div className="action-strip">
                <div className="calc-summary" aria-label="Ringkasan hitung">
                  <div>
                    <span>{summaryLabel}</span>
                    <strong>{summaryValue}</strong>
                  </div>
                  <div>
                    <span>{secondaryLabel}</span>
                    <strong>{secondaryValue}</strong>
                  </div>
                </div>
                <button className="primary-action" type="button" onClick={handleCalculate}>
                  Cek hasil
                </button>
              </div>

              {error ? <p className="form-error">{error}</p> : null}
            </div>

            <div className="result-column">
              <ResultPanel result={activeResult} />
              <TotalSummary results={results} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
