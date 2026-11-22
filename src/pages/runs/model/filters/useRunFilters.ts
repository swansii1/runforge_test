import { useLayoutEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router";
import { useDebouncedCallback } from "../../../../shared/lib/useDebouncedCallback";
import { parseRunSort, type RunSort } from "../sorting/runSort";
import { parseStatusFilter, type StatusFilter } from "./statusFilter";

const searchDelayMs = 300;

type SelectionChange = { param: "status" | "sort"; value: string | null };

export function useRunFilters() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const appliedSearchQuery = searchParams.get("search") ?? "";
  const status = parseStatusFilter(searchParams.get("status"));
  const sort = parseRunSort(searchParams.get("sort"));
  const [draftSearchQuery, setDraftSearchQuery] = useState(appliedSearchQuery);
  const { schedule: scheduleSearch, cancel: cancelSearch } = useDebouncedCallback(
    writeFilters,
    searchDelayMs,
  );

  useLayoutEffect(() => {
    cancelSearch();
    setDraftSearchQuery(appliedSearchQuery);
  }, [location.key, appliedSearchQuery, cancelSearch]);

  function writeFilters(query: string, selection?: SelectionChange) {
    const nextParams = new URLSearchParams(searchParams);

    if (query.trim()) {
      nextParams.set("search", query);
    } else {
      nextParams.delete("search");
    }

    if (selection) {
      if (selection.value === null) {
        nextParams.delete(selection.param);
      } else {
        nextParams.set(selection.param, selection.value);
      }
    }

    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams, { replace: selection === undefined });
    }
  }

  function applyImmediately(query: string, selection?: SelectionChange) {
    cancelSearch();
    writeFilters(query, selection);
  }

  function updateSearchQuery(query: string) {
    setDraftSearchQuery(query);
    if (query.trim()) scheduleSearch(query);
    else applyImmediately("");
  }

  function setStatus(nextStatus: StatusFilter) {
    applyImmediately(draftSearchQuery, {
      param: "status",
      value: nextStatus === "all" ? null : nextStatus,
    });
  }

  function setSort(nextSort: RunSort) {
    applyImmediately(draftSearchQuery, { param: "sort", value: nextSort });
  }

  function resetFilters() {
    setDraftSearchQuery("");
    applyImmediately("", { param: "status", value: null });
  }

  return {
    draftSearchQuery,
    appliedSearchQuery,
    updateSearchQuery,
    status,
    setStatus,
    sort,
    setSort,
    resetFilters,
  };
}
