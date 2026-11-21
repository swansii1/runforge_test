import { useState } from "react";
import { useSearchParams } from "react-router";
import { parseStatusFilter, type StatusFilter } from "./statusFilter";

export function useRunFilters() {
  const [searchQuery, setSearchQuery] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const status = parseStatusFilter(searchParams.get("status"));

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
    setSearchQuery("");
    setStatus("all");
  }

  return { searchQuery, setSearchQuery, status, setStatus, resetFilters };
}
