import type { Run } from "../model/run";
import { createMockRuns } from "./createMockRuns";

const responseDelayMs = 500;

type GetRunsOptions = {
  signal?: AbortSignal;
  simulateError?: boolean;
};

export async function getRuns({
  signal,
  simulateError = false,
}: GetRunsOptions = {}): Promise<Run[]> {
  await new Promise<void>((resolve) => setTimeout(resolve, responseDelayMs));
  signal?.throwIfAborted();

  if (simulateError) {
    throw new Error("Simulated runs request failure");
  }

  return createMockRuns();
}
