import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { LoadError } from "./LoadError";

afterEach(cleanup);

it("displays the caller's message and retries through the supplied callback", () => {
  const onRetry = vi.fn();
  render(
    <LoadError
      title="Preview unavailable"
      description="Try opening the preview again."
      retryLabel="Reload preview"
      onRetry={onRetry}
    />,
  );

  const alert = within(screen.getByRole("alert"));
  alert.getByRole("heading", { name: "Preview unavailable" });
  alert.getByText("Try opening the preview again.");
  fireEvent.click(alert.getByRole("button", { name: "Reload preview" }));
  expect(onRetry).toHaveBeenCalledOnce();
});
