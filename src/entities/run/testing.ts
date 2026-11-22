import type { Run } from "./model/run";

export { createMockRuns } from "./api/createMockRuns";

export function createPendingRunsRequest() {
  let resolve!: (runs: Run[]) => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<Run[]>((resolveRequest, rejectRequest) => {
    resolve = resolveRequest;
    reject = rejectRequest;
  });
  return { promise, resolve, reject };
}
