import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  INCOME_NISAB_MONTHLY,
  INCOME_NISAB_YEARLY
} from "./constants";
import {
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
