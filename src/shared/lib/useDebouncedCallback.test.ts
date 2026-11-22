import { renderHook } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { useDebouncedCallback } from "./useDebouncedCallback";

afterEach(() => {
  vi.useRealTimers();
});

it("runs only the last scheduled value using the current callback", () => {
  vi.useFakeTimers();
  const firstCallback = vi.fn<(query: string) => void>();
  const currentCallback = vi.fn<(query: string) => void>();
  const { result, rerender, unmount } = renderHook(
    (callback) => useDebouncedCallback(callback, 300),
    {
      initialProps: firstCallback,
    },
  );

  result.current.schedule("p");
  result.current.schedule("payments");
  rerender(currentCallback);
  vi.advanceTimersByTime(300);

  expect(firstCallback).not.toHaveBeenCalled();
  expect(currentCallback.mock.calls).toEqual([["payments"]]);
  unmount();
});

it("cancels pending calls explicitly and on unmount", () => {
  vi.useFakeTimers();
  const callback = vi.fn();
  const { result, unmount } = renderHook(() => useDebouncedCallback(callback, 300));

  result.current.schedule();
  result.current.cancel();
  vi.advanceTimersByTime(300);
  expect(callback).not.toHaveBeenCalled();

  result.current.schedule();
  unmount();
  vi.advanceTimersByTime(300);
  expect(callback).not.toHaveBeenCalled();
});
