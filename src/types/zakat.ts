export type CalculatorMode =
  | "income"
  | "savings"
  | "gold"
  | "business"
  | "fitrah";

export type IncomePeriod = "monthly" | "yearly";

export type FitrahBasis = "money" | "stapleFood";

export type ResultTone = "success" | "warning" | "neutral";

export type ZakatResult = {
  mode: CalculatorMode;
  isObligatory: boolean;
  zakatAmount: number;
  nisabAmount: number;
  baseAmount: number;
  progressToNisab: number;
  statusTitle: string;
  headline: string;
  explanation: string;
  formula: string;
  tone: ResultTone;
  details: Array<{
    label: string;
    value: string;
  }>;
};

export type ValidationResult =
  | {
      ok: true;
      value: number;
    }
  | {
      ok: false;
      message: string;
    };
