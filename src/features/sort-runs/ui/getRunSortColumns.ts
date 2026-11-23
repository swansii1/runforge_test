import type { ColumnHeader } from "../../../shared/ui/column-headers/ColumnHeaders";
import { runSortColumns, type RunSort, type RunSortControl } from "../model/runSort";

function directionOf(value: RunSort) {
  return value.endsWith("-asc") ? "ascending" : "descending";
}

export function getRunSortColumns(sorting?: RunSortControl): ColumnHeader[] {
  return runSortColumns.map(({ label, initial, reverse }) => {
    const column = { id: initial.value, label };
    if (!sorting) return column;

    const active = sorting.value === initial.value || sorting.value === reverse.value;
    const next = sorting.value === initial.value ? reverse.value : initial.value;
    return {
      ...column,
      sort: {
        direction: active ? directionOf(sorting.value) : undefined,
        nextDirection: directionOf(next),
        onToggle: () => sorting.onChange(next),
      },
    };
  });
}
