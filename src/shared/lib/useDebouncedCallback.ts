import { useCallback, useLayoutEffect, useRef } from "react";

export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delayMs: number,
) {
  const timerRef = useRef<number | undefined>(undefined);
  const callbackRef = useRef(callback);

  useLayoutEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const cancel = useCallback(() => {
    window.clearTimeout(timerRef.current);
    timerRef.current = undefined;
  }, []);

  useLayoutEffect(() => cancel, [cancel]);

  function schedule(...args: Args) {
    cancel();
    timerRef.current = window.setTimeout(() => {
      timerRef.current = undefined;
      callbackRef.current(...args);
    }, delayMs);
  }

  return { schedule, cancel };
}
