// @vitest-environment node
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { getRuns } from "./getRuns";

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

it("returns the six mock runs", async () => {
  const response = getRuns();
  await vi.runAllTimersAsync();
  expect(await response).toHaveLength(6);
});

it("rejects when a request error is simulated", async () => {
  const failure = expect(getRuns({ simulateError: true })).rejects.toThrow(
    "Simulated runs request failure",
  );
  await vi.runAllTimersAsync();
  await failure;
});
