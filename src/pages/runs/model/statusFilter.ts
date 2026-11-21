import type { RunStatus } from "../../../entities/run";

export type StatusFilter = "all" | RunStatus;

export const statusOptions: readonly StatusFilter[] = ["all", "queued", "running", "succeeded", "failed"];

export function parseStatusFilter(value: string | null): StatusFilter {
  return statusOptions.find((option) => option === value) ?? "all";
}
