import { runStatusLabels } from "../../../entities/run";
import { SegmentedControl } from "../../../shared/ui/segmented-control/SegmentedControl";
import { statusOptions, type StatusFilter } from "../model/statusFilter";

const filterOptions = statusOptions.map((value) => ({
  value,
  label: value === "all" ? "All" : runStatusLabels[value],
}));

type RunStatusFilterProps = {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
};

export function RunStatusFilter({ value, onChange }: RunStatusFilterProps) {
  return (
    <SegmentedControl
      label="Filter by status"
      options={filterOptions}
      value={value}
      onChange={onChange}
    />
  );
}
