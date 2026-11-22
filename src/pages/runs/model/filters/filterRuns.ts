import type { Run } from "../../../../entities/run";
import type { StatusFilter } from "./statusFilter";

export function filterRuns(runs: Run[], searchQuery: string, status: StatusFilter) {
  const query = searchQuery.trim().toLowerCase();

  return runs.filter((run) => {
    if (status !== "all" && run.status !== status) return false;
    if (query === "") return true;

    return run.name.toLowerCase().includes(query) || run.repository.toLowerCase().includes(query);
  });
}
