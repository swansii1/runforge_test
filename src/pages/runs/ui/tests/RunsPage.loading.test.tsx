import { act, fireEvent, screen, within } from "@testing-library/react";
import { assert, expect, it, vi } from "vitest";
import * as runApi from "../../../../entities/run";
import { createMockRuns, createPendingRunsRequest } from "../../../../entities/run/testing";
import { getRunSearchParams, renderRunsPage, setupRunsPageTests } from "./renderRunsPage";

setupRunsPageTests();

it("shows loading and renders all runs with distinct zero and missing durations", async () => {
  const runs = createMockRuns();
  const request = createPendingRunsRequest();
  vi.mocked(runApi.getRuns).mockReturnValue(request.promise);
  renderRunsPage();

  expect(screen.getByRole("heading", { name: "Runs", level: 1 })).toBeDefined();
  expect(screen.getByText("Loading runs…")).toBeDefined();
  await act(async () => {
    request.resolve(runs);
  });
  const list = screen.getByRole("list", { name: "Runs" });
  expect(within(list).getAllByRole("listitem")).toHaveLength(runs.length);
  expect(document.activeElement).not.toBe(screen.getByRole("searchbox"));

  const checksumRow = within(list).getByText("Check migration checksum").closest("li");
  const dependenciesRow = within(list).getByText("Update dashboard dependencies").closest("li");
  assert.isNotNull(checksumRow);
  assert.isNotNull(dependenciesRow);
  expect(within(checksumRow).getByText("0s")).toBeDefined();
  expect(within(dependenciesRow).getByText("—")).toBeDefined();
});

it("fills the visible list area with decorative rows while the request is pending", () => {
  vi.mocked(runApi.getRuns).mockReturnValue(createPendingRunsRequest().promise);
  vi.stubGlobal("innerHeight", 481);
  vi.spyOn(HTMLLIElement.prototype, "getBoundingClientRect").mockReturnValue(
    new DOMRect(0, 160, 900, 80),
  );
  renderRunsPage();

  const placeholders = screen.getByRole("list", { hidden: true });
  expect(placeholders.children).toHaveLength(5);
  expect(screen.queryByRole("list")).toBeNull();
  expect(screen.getByRole("status").textContent).toBe("Loading runs…");

  vi.stubGlobal("innerHeight", 800);
  fireEvent(window, new Event("resize"));
  expect(placeholders.children).toHaveLength(8);
});

it("removes only mockError from the current history entry after Retry succeeds", async () => {
  vi.mocked(runApi.getRuns).mockRestore();
  const getRuns = vi.spyOn(runApi, "getRuns");
  vi.useFakeTimers();
  const filters = { status: "failed", search: "check", sort: "duration-asc", source: "review" };
  const params = new URLSearchParams({ mockError: "once", ...filters });
  window.history.replaceState(null, "", `/?${params}#runs`);
  const historyLength = window.history.length;
  renderRunsPage({ reactStrictMode: true });

  expect(screen.getByRole("status").textContent).toBe("Loading runs…");
  await act(() => vi.runOnlyPendingTimersAsync());
  const errorPanel = within(screen.getByRole("alert"));
  errorPanel.getByRole("heading", { name: "Run list unavailable" });
  const retryButton = errorPanel.getByRole("button", { name: "Retry" });
  expect(screen.queryByRole("group", { name: "Sort runs" })).toBeNull();
  expect(screen.queryByRole("list", { hidden: true })).toBeNull();
  getRuns.mockClear();
  retryButton.focus();
  fireEvent.click(retryButton);
  expect(screen.getByRole("status").textContent).toBe("Loading runs…");
  const skeleton = screen.getByRole("list", { hidden: true });
  expect(skeleton.children.length).toBeGreaterThan(0);
  expect(skeleton.getAttribute("aria-hidden")).toBe("true");
  expect(getRunSearchParams().mockError).toBe("once");
  await act(() => vi.runOnlyPendingTimersAsync());

  const list = screen.getByRole("list", { name: "Runs" });
  expect(within(list).getAllByRole("listitem")).toHaveLength(2);
  expect(screen.getByRole("button", { name: "Failed", pressed: true })).toBeDefined();
  expect(document.activeElement).toBe(screen.getByRole("searchbox"));
  expect(screen.queryByRole("alert")).toBeNull();
  expect(getRunSearchParams()).toEqual(filters);
  expect(window.location.hash).toBe("#runs");
  expect(window.history.length).toBe(historyLength);
  expect(getRuns).toHaveBeenCalledTimes(1);
});
