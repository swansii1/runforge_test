import { act, cleanup, renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, expect, it, vi } from "vitest";
import * as runApi from "../../../entities/run";
import { createMockRuns, createPendingRunsRequest } from "../../../entities/run/testing";
import { useRuns } from "./useRuns";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

it.each(["success", "error"])("ignores a late %s from the previous request", async (outcome) => {
  const firstRequest = createPendingRunsRequest();
  const retryRequest = createPendingRunsRequest();
  vi.spyOn(runApi, "getRuns")
    .mockReturnValueOnce(firstRequest.promise)
    .mockReturnValueOnce(retryRequest.promise);
  const { result } = renderHook(() => useRuns(), { wrapper: MemoryRouter });

  act(() => {
    result.current.retry();
  });
  await act(async () => {
    retryRequest.resolve([]);
  });
  const retryResult = { status: "success", runs: [] };
  expect(result.current.request).toEqual(retryResult);

  await act(async () => {
    if (outcome === "error") firstRequest.reject(new Error("Previous request failed"));
    else firstRequest.resolve(createMockRuns());
  });
  expect(result.current.request).toEqual(retryResult);
});
