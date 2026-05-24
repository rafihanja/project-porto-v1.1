"use client";

import { useMemo, useState } from "react";
import { INCOME_NISAB_MONTHLY, ZAKAT_RATE } from "@/lib/constants";
import { formatNumberInput, formatRupiah, parseCurrencyInput } from "@/lib/format";
import { validateMoneyInput } from "@/lib/validation";
import {
  calculateIncomeZakat,
  calculateSavingsZakat
} from "@/lib/zakat";
import type { CalculatorMode, IncomePeriod, ZakatResult } from "@/types/zakat";
import { CurrencyInput } from "./CurrencyInput";
import { ResultPanel } from "./ResultPanel";

export function HeroCalculator() {
  const [mode, setMode] = useState<CalculatorMode>("income");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [incomePeriod, setIncomePeriod] = useState<IncomePeriod>("monthly");
  const [savingAmount, setSavingAmount] = useState("");
  const [goldPrice, setGoldPrice] = useState("");
  const [hasHaul, setHasHaul] = useState<boolean | null>(null);
  const [result, setResult] = useState<ZakatResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const modeCopy = useMemo(
    () =>
      mode === "income"
        ? "Gaji, honor, bonus, atau invoice freelance."
        : "Saldo tabungan, harga emas, dan status haul.",
    [mode]
  );

  function switchMode(nextMode: CalculatorMode) {
    setMode(nextMode);
    setError(null);
    setResult(null);
  }

  function resetCalculator() {
    setIncomeAmount("");
    setIncomePeriod("monthly");
    setSavingAmount("");
    setGoldPrice("");
    setHasHaul(null);
    setResult(null);
    setError(null);
  }

  function setIncomePreset(amount: number, period: IncomePeriod = "monthly") {
    setMode("income");
    setIncomeAmount(formatNumberInput(String(amount)));
    setIncomePeriod(period);
    setResult(null);
    setError(null);
  }

  function setSavingsPreset(amount: number, gold: number, haul: boolean) {
    setMode("savings");
    setSavingAmount(formatNumberInput(String(amount)));
    setGoldPrice(formatNumberInput(String(gold)));
    setHasHaul(haul);
    setResult(null);
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
        setResult(null);
        setError(validation.message);
        return;
      }

      setResult(calculateIncomeZakat(validation.value, incomePeriod));
      return;
    }

    const savingValidation = validateMoneyInput(
      savingAmount,
      "Saldo tabungan"
    );
    const goldValidation = validateMoneyInput(
      goldPrice,
      "Harga emas per gram"
    );

    if (!savingValidation.ok) {
      setResult(null);
      setError(savingValidation.message);
      return;
    }

    if (!goldValidation.ok) {
      setResult(null);
      setError(goldValidation.message);
      return;
    }

    if (hasHaul === null) {
      setResult(null);
      setError("Pilih dulu apakah saldo ini sudah tersimpan sekitar 1 tahun.");
      return;
    }

    setResult(
      calculateSavingsZakat(savingValidation.value, goldValidation.value, hasHaul)
    );
  }

  const previewNisab =
    mode === "income"
      ? INCOME_NISAB_MONTHLY
      : parseCurrencyInput(goldPrice) * 85;

  return (
    <section className="hero-section" id="top">
      <div className="section-shell hero-grid" id="kalkulator">
        <div className="hero-copy">
          <span className="section-kicker">Catatan hitung sederhana</span>
          <h1>Cek dulu, nominal ini sudah kena zakat atau belum?</h1>
          <p>
            Buat kamu yang ingin cek gaji, honor freelance, atau tabungan
            tanpa harus buka banyak artikel dulu. Angkanya tetap transparan,
            hasilnya tetap gampang dibaca.
          </p>
          <div className="daily-note" aria-label="Ringkasan aturan hitung">
            <div>
              <span>Nisab penghasilan 2026</span>
              <strong>{formatRupiah(INCOME_NISAB_MONTHLY)}/bulan</strong>
            </div>
            <div>
              <span>Yang dipakai</span>
              <strong>2,5% dan 85 gram emas</strong>
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
                  <h2>{mode === "income" ? "Cek pemasukan" : "Cek tabungan"}</h2>
                </div>
                <p>{modeCopy}</p>
              </div>

              <div className="mode-dock" role="tablist" aria-label="Jenis zakat">
                <button
                  className={mode === "income" ? "active" : ""}
                  type="button"
                  role="tab"
                  aria-selected={mode === "income"}
                  onClick={() => switchMode("income")}
                >
                  <span>Penghasilan</span>
                  <strong>Gaji / honor</strong>
                </button>
                <button
                  className={mode === "savings" ? "active" : ""}
                  type="button"
                  role="tab"
                  aria-selected={mode === "savings"}
                  onClick={() => switchMode("savings")}
                >
                  <span>Tabungan</span>
                  <strong>Saldo 1 tahun</strong>
                </button>
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
                    <button type="button" onClick={() => setIncomePreset(120_000_000, "yearly")}>
                      120 jt/tahun
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setSavingsPreset(75_000_000, 1_200_000, true)}
                    >
                      75 jt
                    </button>
                    <button
                      type="button"
                      onClick={() => setSavingsPreset(120_000_000, 1_200_000, true)}
                    >
                      120 jt
                    </button>
                    <button
                      type="button"
                      onClick={() => setSavingsPreset(120_000_000, 1_200_000, false)}
                    >
                      Belum haul
                    </button>
                  </>
                )}
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
                    onChange={setIncomeAmount}
                  />
                  <div className="input-card period-card">
                    <span className="field-label">Periode</span>
                    <div className="choice-row">
                      <button
                        className={incomePeriod === "monthly" ? "active" : ""}
                        type="button"
                        onClick={() => setIncomePeriod("monthly")}
                      >
                        Bulanan
                      </button>
                      <button
                        className={incomePeriod === "yearly" ? "active" : ""}
                        type="button"
                        onClick={() => setIncomePeriod("yearly")}
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
              ) : (
                <div className="input-board savings-board">
                  <CurrencyInput
                    id="savingAmount"
                    label="Saldo"
                    value={savingAmount}
                    placeholder="120.000.000"
                    helper="Saldo yang cukup stabil."
                    compactHelper
                    onChange={setSavingAmount}
                  />
                  <CurrencyInput
                    id="goldPrice"
                    label="Emas / gram"
                    value={goldPrice}
                    placeholder="1.200.000"
                    helper="Isi harga saat ini."
                    compactHelper
                    onChange={setGoldPrice}
                  />
                  <div className="input-card haul-card">
                    <span className="field-label">Haul</span>
                    <div className="choice-row">
                      <button
                        className={hasHaul === true ? "active" : ""}
                        type="button"
                        onClick={() => setHasHaul(true)}
                      >
                        Sudah
                      </button>
                      <button
                        className={hasHaul === false ? "active" : ""}
                        type="button"
                        onClick={() => setHasHaul(false)}
                      >
                        Belum
                      </button>
                    </div>
                    <small>Sekitar 1 tahun tersimpan.</small>
                  </div>
                </div>
              )}

              <div className="action-strip">
                <div className="calc-summary" aria-label="Ringkasan hitung">
                  <div>
                    <span>Nisab pembanding</span>
                    <strong>
                      {previewNisab > 0 ? formatRupiah(previewNisab) : "Isi harga emas"}
                    </strong>
                  </div>
                  <div>
                    <span>Kadar</span>
                    <strong>{ZAKAT_RATE * 100}%</strong>
                  </div>
                </div>
                <button className="primary-action" type="button" onClick={handleCalculate}>
                  Cek hasil
                </button>
              </div>

              {error ? <p className="form-error">{error}</p> : null}
            </div>

            <ResultPanel result={result} />
          </div>
        </div>
      </div>
    </section>
  );
}
