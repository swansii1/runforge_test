import { useMemo, useRef } from "react";
import { useLocation, useSearchParams } from "react-router";
import type { Run } from "../../../entities/run";
import {
  filterRunsByStatus,
  parseStatusFilter,
  type StatusFilter,
} from "../../../features/filter-runs-by-status";
import { searchRuns, useRunSearch } from "../../../features/search-runs";
import { parseRunSort, sortRuns, type RunSort } from "../../../features/sort-runs";

type SelectionChange = { param: "status"; value: StatusFilter } | { param: "sort"; value: RunSort };

export function useRunsView(runs: readonly Run[] | undefined) {
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const query = params.get("search") ?? "";
  const status = parseStatusFilter(params.get("status"));
  const sort = parseRunSort(params.get("sort"));
  const inputRef = useRef<HTMLInputElement>(null);
  const search = useRunSearch(query, location.key, writeParams);

  const visibleRuns = useMemo(() => {
    if (!runs) return [];
    const matchingStatus = filterRunsByStatus(runs, status);
    return sortRuns(searchRuns(matchingStatus, query), sort);
  }, [runs, status, query, sort]);

  function writeParams(text: string, change?: SelectionChange) {
    const next = new URLSearchParams(params);
    if (text.trim()) next.set("search", text);
    else next.delete("search");

    if (change) {
      if (change.param === "status" && change.value === "all") next.delete("status");
      else next.set(change.param, change.value);
    }

    if (next.toString() !== params.toString()) {
      setParams(next, { replace: change === undefined });
    }
  }

  function applySelection(change: SelectionChange) {
    search.cancelPending();
    writeParams(search.value, change);
  }

  function resetFilters() {
    search.clearDraft();
    writeParams("", { param: "status", value: "all" });
    inputRef.current?.focus();
  }

  return {
    visibleRuns,
    searchField: { value: search.value, onChange: search.onChange, inputRef },
    statusFilter: {
      value: status,
      onChange: (value: StatusFilter) => applySelection({ param: "status", value }),
    },
    sorting: {
      value: sort,
      onChange: (value: RunSort) => applySelection({ param: "sort", value }),
    },
    resetFilters,
  };
}
