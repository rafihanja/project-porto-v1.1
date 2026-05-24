export function parseCurrencyInput(input: string): number {
  const normalized = input.replace(/[^\d]/g, "");
  return normalized ? Number(normalized) : 0;
}

export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatNumberInput(value: string): string {
  const parsed = parseCurrencyInput(value);

  if (!parsed) {
    return "";
  }

  return new Intl.NumberFormat("id-ID").format(parsed);
}
