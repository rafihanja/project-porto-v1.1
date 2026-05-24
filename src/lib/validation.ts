import type { ValidationResult } from "@/types/zakat";
import { parseCurrencyInput, parseNumberInput } from "./format";

export function validateMoneyInput(
  input: string,
  fieldLabel: string
): ValidationResult {
  const value = parseCurrencyInput(input);

  if (!input.trim() || value === 0) {
    return {
      ok: false,
      message: `${fieldLabel} perlu diisi dulu.`
    };
  }

  if (!Number.isFinite(value)) {
    return {
      ok: false,
      message: `${fieldLabel} belum terbaca sebagai angka yang valid.`
    };
  }

  if (value < 0) {
    return {
      ok: false,
      message: `${fieldLabel} tidak boleh bernilai negatif.`
    };
  }

  return {
    ok: true,
    value
  };
}

export function validateNumberInput(
  input: string,
  fieldLabel: string
): ValidationResult {
  const value = parseNumberInput(input);

  if (!input.trim() || value === 0) {
    return {
      ok: false,
      message: `${fieldLabel} perlu diisi dulu.`
    };
  }

  if (!Number.isFinite(value)) {
    return {
      ok: false,
      message: `${fieldLabel} belum terbaca sebagai angka yang valid.`
    };
  }

  if (value < 0) {
    return {
      ok: false,
      message: `${fieldLabel} tidak boleh bernilai negatif.`
    };
  }

  return {
    ok: true,
    value
  };
}
