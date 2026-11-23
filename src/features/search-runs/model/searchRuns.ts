import type { Run } from "../../../entities/run";

export function searchRuns(runs: readonly Run[], query: string): readonly Run[] {
  const text = query.trim().toLowerCase();
  if (!text) return runs;

  return runs.filter(
    (run) => run.name.toLowerCase().includes(text) || run.repository.toLowerCase().includes(text),
  );
}
