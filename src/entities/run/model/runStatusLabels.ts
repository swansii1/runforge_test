import type { RunStatus } from "./run";

export const runStatusLabels: Record<RunStatus, string> = {
  queued: "Queued",
  running: "Running",
  succeeded: "Succeeded",
  failed: "Failed",
};
