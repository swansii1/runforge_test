import type { ComponentProps } from "react";
import { RunStatusFilter } from "../../../features/filter-runs-by-status";
import { RunSearchField } from "../../../features/search-runs";
import { getRunSortColumns, SortSelect, type RunSortControl } from "../../../features/sort-runs";
import { ColumnHeaders } from "../../../shared/ui/column-headers/ColumnHeaders";
import type { RunsRequest } from "../model/useRuns";
import styles from "./RunsPanelHeader.module.css";

type RunsPanelHeaderProps = {
  requestStatus: RunsRequest["status"];
  searchField: ComponentProps<typeof RunSearchField>;
  statusFilter: ComponentProps<typeof RunStatusFilter>;
  sorting: RunSortControl;
};

export function RunsPanelHeader({
  requestStatus,
  searchField,
  statusFilter,
  sorting,
}: RunsPanelHeaderProps) {
  const isError = requestStatus === "error";
  const columns = [
    { id: "run", label: "Run" },
    { id: "status", label: "Status" },
    ...getRunSortColumns(isError ? undefined : sorting),
  ];

  return (
    <div
      className={isError ? styles.headerOnly : undefined}
      inert={requestStatus === "loading"}
      aria-hidden={requestStatus !== "success"}
    >
      {!isError && (
        <div className={styles.toolbar}>
          <RunSearchField {...searchField} />
          <RunStatusFilter {...statusFilter} />
          <div className={styles.mobileSort}>
            <SortSelect {...sorting} />
          </div>
        </div>
      )}
      <ColumnHeaders columns={columns} label="Sort runs" className={styles.columns} />
    </div>
  );
}
