export const runSortColumns = [
  {
    label: "Created",
    initial: { value: "created-desc", label: "Newest first" },
    reverse: { value: "created-asc", label: "Oldest first" },
  },
  {
    label: "Duration",
    initial: { value: "duration-asc", label: "Shortest first" },
    reverse: { value: "duration-desc", label: "Longest first" },
  },
] as const;

export const runSortOptions = runSortColumns.flatMap(({ initial, reverse }) => [initial, reverse]);

export type RunSort = (typeof runSortOptions)[number]["value"];
export type RunSortControl = {
  value: RunSort;
  onChange: (value: RunSort) => void;
};

const defaultRunSort: RunSort = "created-desc";

export function parseRunSort(value: string | null): RunSort {
  return runSortOptions.find((option) => option.value === value)?.value ?? defaultRunSort;
}
