import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  GOLD_GRAM_NISAB,
  INCOME_NISAB_MONTHLY,
  INCOME_NISAB_YEARLY
} from "./constants";
import {
  calculateBusinessZakat,
  calculateFitrahZakat,
  calculateGoldZakat,
  calculateIncomeZakat,
  calculateSavingsZakat
} from "./zakat";

describe("calculateIncomeZakat", () => {
  it("marks monthly income above nisab as obligatory", () => {
    const result = calculateIncomeZakat(10_000_000, "monthly");

    assert.equal(result.isObligatory, true);
    assert.equal(result.zakatAmount, 250_000);
    assert.equal(result.nisabAmount, INCOME_NISAB_MONTHLY);
  });

  it("marks monthly income below nisab as not obligatory", () => {
    const result = calculateIncomeZakat(5_000_000, "monthly");

    assert.equal(result.isObligatory, false);
    assert.equal(result.zakatAmount, 0);
  });

  it("treats income exactly equal to nisab as obligatory", () => {
    const monthly = calculateIncomeZakat(INCOME_NISAB_MONTHLY, "monthly");
    const yearly = calculateIncomeZakat(INCOME_NISAB_YEARLY, "yearly");

    assert.equal(monthly.isObligatory, true);
    assert.equal(yearly.isObligatory, true);
  });
});

describe("calculateSavingsZakat", () => {
  it("marks savings above nisab and with haul as obligatory", () => {
    const result = calculateSavingsZakat(120_000_000, 1_200_000, true);

    assert.equal(result.isObligatory, true);
    assert.equal(result.nisabAmount, 102_000_000);
    assert.equal(result.zakatAmount, 3_000_000);
  });

  it("does not mark savings as obligatory when haul is not met", () => {
    const result = calculateSavingsZakat(120_000_000, 1_200_000, false);

    assert.equal(result.isObligatory, false);
    assert.equal(result.zakatAmount, 0);
    assert.equal(result.tone, "warning");
  });
});

describe("calculateGoldZakat", () => {
  it("marks gold above 85 grams with haul as obligatory", () => {
    const result = calculateGoldZakat(90, 1_200_000, true);

    assert.equal(result.isObligatory, true);
    assert.equal(result.nisabAmount, GOLD_GRAM_NISAB * 1_200_000);
    assert.equal(result.zakatAmount, 2_700_000);
  });

  it("does not mark gold below nisab as obligatory", () => {
    const result = calculateGoldZakat(40, 1_200_000, true);

    assert.equal(result.isObligatory, false);
    assert.equal(result.zakatAmount, 0);
  });
});

describe("calculateBusinessZakat", () => {
  it("calculates zakat from assets minus short-term debt", () => {
    const result = calculateBusinessZakat(
      200_000_000,
      50_000_000,
      1_200_000,
      true
    );

    assert.equal(result.isObligatory, true);
    assert.equal(result.baseAmount, 150_000_000);
    assert.equal(result.zakatAmount, 3_750_000);
  });

  it("does not mark business as obligatory when haul is not met", () => {
    const result = calculateBusinessZakat(
      200_000_000,
      50_000_000,
      1_200_000,
      false
    );

    assert.equal(result.isObligatory, false);
    assert.equal(result.zakatAmount, 0);
    assert.equal(result.tone, "warning");
  });
});

describe("calculateFitrahZakat", () => {
  it("multiplies people count by amount per person", () => {
    const result = calculateFitrahZakat(4, 50_000, "money");

    assert.equal(result.isObligatory, true);
    assert.equal(result.zakatAmount, 200_000);
    assert.match(result.formula, /4 jiwa x Rp/);
  });

  it("converts rice fitrah from 2.5 kg per person", () => {
    const result = calculateFitrahZakat(4, 16_000, "riceKg");

    assert.equal(result.zakatAmount, 160_000);
    assert.match(result.formula, /2,5 kg/);
  });

  it("converts staple fitrah from 3.5 liter per person", () => {
    const result = calculateFitrahZakat(4, 12_000, "stapleLiter");

    assert.equal(result.zakatAmount, 168_000);
    assert.match(result.formula, /3,5 liter/);
  });
});
