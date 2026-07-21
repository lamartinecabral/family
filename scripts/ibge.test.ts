import { describe, it } from "node:test";
import assert from "node:assert";
import { sobrenomeData, sobrenomeRanking, ufsData } from "./ibge.ts";

describe("IBGE API", () => {
  it("should fetch sobrenome ranking", async () => {
    const res = await sobrenomeRanking(1, 0);
    assert.ok(res);
  });

  it("should fetch sobrenome data", async () => {
    const res = await sobrenomeData("silva", 0);
    assert.ok(res);
  });

  it("should fetch ufs data", async () => {
    const res = await ufsData();
    assert.ok(res);
  });
});
