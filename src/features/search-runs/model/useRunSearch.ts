import { useLayoutEffect, useState } from "react";
import { useDebouncedCallback } from "../../../shared/lib/useDebouncedCallback";

const searchDelayMs = 300;

export function useRunSearch(
  appliedQuery: string,
  navigationKey: string,
  onCommit: (query: string) => void,
) {
  const [value, setValue] = useState(appliedQuery);
  const { schedule, cancel: cancelPending } = useDebouncedCallback(onCommit, searchDelayMs);

  useLayoutEffect(() => {
    cancelPending();
    setValue(appliedQuery);
  }, [navigationKey, appliedQuery, cancelPending]);

  function onChange(query: string) {
    setValue(query);
    if (query.trim()) {
      schedule(query);
    } else {
      cancelPending();
      onCommit("");
    }
  }

  function clearDraft() {
    cancelPending();
    setValue("");
  }

  return { value, onChange, cancelPending, clearDraft };
}
