import type { Run, RunStatus } from "../../../entities/run";

export type StatusFilter = "all" | RunStatus;

export function filterRuns(runs: Run[], searchQuery: string, status: StatusFilter) {
  const query = searchQuery.trim().toLowerCase();

  return runs.filter((run) => {
    if (status !== "all" && run.status !== status) return false;
    if (query === "") return true;

    return (
      run.name.toLowerCase().includes(query) ||
      run.repository.toLowerCase().includes(query)
    );
  });
}
