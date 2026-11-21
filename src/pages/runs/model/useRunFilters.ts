import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { parseStatusFilter, type StatusFilter } from "./statusFilter";

const searchDelayMs = 300;

export function useRunFilters() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const searchTimer = useRef<number | undefined>(undefined);

  const [searchParams, setSearchParams] = useSearchParams();
  const status = parseStatusFilter(searchParams.get("status"));

  useEffect(() => () => window.clearTimeout(searchTimer.current), []);

  function updateSearchQuery(query: string) {
    window.clearTimeout(searchTimer.current);
    setSearchQuery(query);

    if (query === "") {
      setDebouncedSearchQuery("");
      return;
    }

    searchTimer.current = window.setTimeout(
      () => setDebouncedSearchQuery(query),
      searchDelayMs,
    );
  }

  function setStatus(nextStatus: StatusFilter) {
    const nextParams = new URLSearchParams(searchParams);
    if (nextStatus === "all") {
      nextParams.delete("status");
    } else {
      nextParams.set("status", nextStatus);
    }

    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams);
    }
  }

  function resetFilters() {
    updateSearchQuery("");
    setStatus("all");
  }

  return {
    searchQuery,
    debouncedSearchQuery,
    updateSearchQuery,
    status,
    setStatus,
    resetFilters,
  };
}
