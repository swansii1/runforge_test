import type { Run } from "../../../entities/run";
import type { RunSort } from "./runSort";

export function sortRuns(runs: readonly Run[], sort: RunSort): Run[] {
  const sortedRuns = [...runs];
  if (sort === "created-asc" || sort === "created-desc") {
    const direction = sort === "created-asc" ? 1 : -1;
    return sortedRuns.sort(
      (first, second) => direction * (Date.parse(first.createdAt) - Date.parse(second.createdAt)),
    );
  }

  const direction = sort === "duration-asc" ? 1 : -1;
  return sortedRuns.sort(
    ({ durationSeconds: firstDuration }, { durationSeconds: secondDuration }) => {
      if (firstDuration !== undefined && secondDuration !== undefined) {
        return direction * (firstDuration - secondDuration);
      }

      if (firstDuration === secondDuration) return 0;
      return firstDuration === undefined ? 1 : -1;
    },
  );
}
