import { Select } from "../../../shared/ui/select/Select";
import { runSortOptions, type RunSortControl } from "../model/runSort";

export function SortSelect({ value, onChange }: RunSortControl) {
  return <Select label="Sort by" options={runSortOptions} value={value} onChange={onChange} />;
}
