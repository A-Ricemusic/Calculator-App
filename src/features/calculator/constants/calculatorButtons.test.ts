import { describe, expect, it } from "vitest";

import { scientificFnButtons, scientificNumButtons } from "./calculatorButtons";

describe("calculatorButtons", () => {
  it("does not ship inert scientific buttons", () => {
    const scientificButtons = [...scientificFnButtons, ...scientificNumButtons].flat();

    expect(scientificButtons.map((button) => button.action)).not.toContain("noop");
  });
});
