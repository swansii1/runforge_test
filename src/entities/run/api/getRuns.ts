import type { Run } from "../model/run";
import { createMockRuns } from "./createMockRuns";

const responseDelayMs = 500;

type GetRunsOptions = {
  simulateError?: boolean;
};

export async function getRuns({ simulateError = false }: GetRunsOptions = {}): Promise<Run[]> {
  await new Promise<void>((resolve) => setTimeout(resolve, responseDelayMs));

  if (simulateError) {
    throw new Error("Simulated runs request failure");
  }

  return createMockRuns();
}
