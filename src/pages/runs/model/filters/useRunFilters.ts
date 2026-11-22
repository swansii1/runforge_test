import { useLayoutEffect, useRef, useState } from "react";
import { useLocation, useSearchParams } from "react-router";
import { parseStatusFilter, type StatusFilter } from "./statusFilter";

const searchDelayMs = 300;

export function useRunFilters() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const appliedSearchQuery = searchParams.get("search") ?? "";
  const status = parseStatusFilter(searchParams.get("status"));
  const [searchQuery, setSearchQuery] = useState(appliedSearchQuery);
  const searchTimer = useRef<number | undefined>(undefined);

  useLayoutEffect(() => {
    setSearchQuery(appliedSearchQuery);
    return () => window.clearTimeout(searchTimer.current);
  }, [location.key, appliedSearchQuery]);

  function applyFilters(query: string, nextStatus?: StatusFilter) {
    const nextParams = new URLSearchParams(searchParams);
    if (query.trim()) nextParams.set("search", query);
    else nextParams.delete("search");

    if (nextStatus === "all") nextParams.delete("status");
    else if (nextStatus !== undefined) nextParams.set("status", nextStatus);

    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams, { replace: nextStatus === undefined });
    }
  }

  function updateSearchQuery(query: string) {
    window.clearTimeout(searchTimer.current);
    setSearchQuery(query);

    if (!query.trim()) {
      applyFilters("");
      return;
    }

    searchTimer.current = window.setTimeout(() => applyFilters(query), searchDelayMs);
  }

  function setStatus(nextStatus: StatusFilter) {
    window.clearTimeout(searchTimer.current);
    applyFilters(searchQuery, nextStatus);
  }

  function resetFilters() {
    window.clearTimeout(searchTimer.current);
    setSearchQuery("");
    applyFilters("", "all");
  }

  return {
    searchQuery,
    appliedSearchQuery,
    updateSearchQuery,
    status,
    setStatus,
    resetFilters,
  };
}
