import { useLayoutEffect, useRef, useState } from "react";
import { useLocation, useSearchParams } from "react-router";
import { parseRunSort, type RunSort } from "./runSort";
import { parseStatusFilter, type StatusFilter } from "./statusFilter";

const searchDelayMs = 300;

type SelectionChange = { param: "status" | "sort"; value: string | null };

export function useRunFilters() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const appliedSearchQuery = searchParams.get("search") ?? "";
  const status = parseStatusFilter(searchParams.get("status"));
  const sort = parseRunSort(searchParams.get("sort"));
  const [searchQuery, setSearchQuery] = useState(appliedSearchQuery);
  const searchTimer = useRef<number | undefined>(undefined);

  useLayoutEffect(() => {
    setSearchQuery(appliedSearchQuery);
    return () => window.clearTimeout(searchTimer.current);
  }, [location.key, appliedSearchQuery]);

  function applyFilters(query: string, selection?: SelectionChange) {
    window.clearTimeout(searchTimer.current);
    const nextParams = new URLSearchParams(searchParams);
    if (query.trim()) nextParams.set("search", query);
    else nextParams.delete("search");

    if (selection) {
      if (selection.value === null) nextParams.delete(selection.param);
      else nextParams.set(selection.param, selection.value);
    }

    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams, { replace: selection === undefined });
    }
  }

  function updateSearchQuery(query: string) {
    setSearchQuery(query);

    if (!query.trim()) {
      applyFilters("");
      return;
    }

    window.clearTimeout(searchTimer.current);
    searchTimer.current = window.setTimeout(() => applyFilters(query), searchDelayMs);
  }

  function setStatus(nextStatus: StatusFilter) {
    applyFilters(searchQuery, { param: "status", value: nextStatus === "all" ? null : nextStatus });
  }

  function setSort(nextSort: RunSort) {
    applyFilters(searchQuery, { param: "sort", value: nextSort });
  }

  function resetFilters() {
    setSearchQuery("");
    applyFilters("", { param: "status", value: null });
  }

  return {
    searchQuery,
    appliedSearchQuery,
    updateSearchQuery,
    status,
    setStatus,
    sort,
    setSort,
    resetFilters,
  };
}
