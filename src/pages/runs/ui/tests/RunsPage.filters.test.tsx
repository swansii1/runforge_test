import { act, fireEvent, screen, waitFor, within } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import * as runApi from "../../../../entities/run";
import { createMockRuns } from "../../../../entities/run/testing";
import { getRunSearchParams, renderRunsPage, setupRunsPageTests } from "./renderRunsPage";

setupRunsPageTests();

const allRunCount = createMockRuns().length;

it("shows typed text immediately and filters only after a pause following the last change", async () => {
  renderRunsPage();
  const search = await screen.findByRole<HTMLInputElement>("searchbox");
  const historyLength = window.history.length;
  vi.useFakeTimers();

  fireEvent.change(search, { target: { value: "web" } });
  act(() => {
    vi.advanceTimersByTime(200);
  });
  fireEvent.change(search, { target: { value: "checkout" } });
  expect(search.value).toBe("checkout");

  act(() => {
    vi.advanceTimersByTime(299);
  });
  expect(getRunSearchParams()).toEqual({});
  expect(screen.getAllByRole("listitem")).toHaveLength(allRunCount);
  act(() => {
    vi.advanceTimersByTime(1);
  });
  expect(within(screen.getByRole("listitem")).getByText("Verify checkout totals")).toBeDefined();
  expect(getRunSearchParams()).toEqual({ search: "checkout" });
  expect(window.history.length).toBe(historyLength);

  fireEvent.change(search, { target: { value: "" } });
  expect(getRunSearchParams()).toEqual({});
  expect(screen.getAllByRole("listitem")).toHaveLength(allRunCount);
});

it("keeps the full list when the search is cleared before its first update", async () => {
  renderRunsPage();
  const search = await screen.findByRole<HTMLInputElement>("searchbox");
  vi.useFakeTimers();

  fireEvent.change(search, { target: { value: "checkout" } });
  fireEvent.change(search, { target: { value: "" } });
  act(() => {
    vi.advanceTimersByTime(300);
  });

  expect(search.value).toBe("");
  expect(getRunSearchParams()).toEqual({});
  expect(screen.getAllByRole("listitem")).toHaveLength(allRunCount);
});

it("combines repository and name searches with the status filter and resets both controls", async () => {
  window.history.replaceState(null, "", "/?source=review&sort=duration-asc");
  renderRunsPage();

  const search = await screen.findByRole<HTMLInputElement>("searchbox", { name: "Search runs" });
  fireEvent.change(search, { target: { value: "  WEB-plat  " } });
  await waitFor(() => expect(screen.getAllByRole("listitem")).toHaveLength(3));

  fireEvent.click(screen.getByRole("button", { name: "Failed" }));
  expect(within(screen.getByRole("listitem")).getByText("Check keyboard navigation")).toBeDefined();
  screen.getByText(`1 of ${allRunCount}`);

  fireEvent.change(search, { target: { value: "checkout" } });
  await screen.findByRole("button", { name: "Verify checkout totals" });

  fireEvent.click(screen.getByRole("button", { name: "Succeeded" }));
  expect(screen.getByText("No matching runs")).toBeDefined();
  screen.getByText(`0 of ${allRunCount}`);
  expect(screen.queryByRole("listitem")).toBeNull();
  vi.useFakeTimers();
  fireEvent.change(search, { target: { value: "payments" } });
  const resetButton = screen.getByRole("button", { name: "Reset filters" });
  resetButton.focus();
  fireEvent.click(resetButton);
  expect(document.activeElement).toBe(search);
  expect(search.value).toBe("");
  expect(screen.getByRole("button", { name: "All", pressed: true })).toBeDefined();
  expect(screen.getAllByRole("listitem")).toHaveLength(allRunCount);
  act(() => {
    vi.advanceTimersByTime(300);
  });
  screen.getByText(`${allRunCount} of ${allRunCount}`);
  expect(getRunSearchParams()).toEqual({ source: "review", sort: "duration-asc" });
  expect(screen.getByRole<HTMLSelectElement>("combobox", { name: "Sort by" }).value).toBe(
    "duration-asc",
  );
});

it("opens a shared search and restores the query, status and results on Back and Forward", async () => {
  const sharedParams = { source: "review", status: "failed", search: "payments" };
  window.history.replaceState(null, "", `/?${new URLSearchParams(sharedParams)}`);
  renderRunsPage();

  const search = await screen.findByRole<HTMLInputElement>("searchbox");
  expect(search.value).toBe("payments");
  expect(screen.getByRole("button", { name: "Failed", pressed: true })).toBeDefined();
  expect(within(screen.getByRole("listitem")).getByText("Verify checkout totals")).toBeDefined();

  fireEvent.change(search, { target: { value: "web-platform" } });
  fireEvent.click(screen.getByRole("button", { name: "Running" }));
  const runningParams = { ...sharedParams, status: "running", search: "web-platform" };
  expect(getRunSearchParams()).toEqual(runningParams);
  expect(within(screen.getByRole("listitem")).getByText("Refactor sign-in form")).toBeDefined();

  window.history.back();
  await screen.findByRole("button", { name: "Failed", pressed: true });
  expect(search.value).toBe("payments");
  expect(getRunSearchParams()).toEqual(sharedParams);
  expect(within(screen.getByRole("listitem")).getByText("Verify checkout totals")).toBeDefined();
  window.history.forward();
  await screen.findByRole("button", { name: "Running", pressed: true });
  expect(within(screen.getByRole("listitem")).getByText("Refactor sign-in form")).toBeDefined();
  expect(search.value).toBe("web-platform");

  fireEvent.change(search, { target: { value: "   " } });
  expect(getRunSearchParams()).toEqual({ source: "review", status: "running" });
});

it("discards pending input when going Back between entries with the same search", async () => {
  window.history.replaceState(null, "", "/?search=check");
  renderRunsPage();
  const search = await screen.findByRole<HTMLInputElement>("searchbox");
  fireEvent.click(screen.getByRole("button", { name: "Failed" }));
  vi.useFakeTimers();
  fireEvent.change(search, { target: { value: "stale" } });
  window.history.back();
  await act(async () => {
    await vi.advanceTimersByTimeAsync(10);
  });
  expect(search.value).toBe("check");
  act(() => {
    vi.advanceTimersByTime(300);
  });
  expect(getRunSearchParams()).toEqual({ search: "check" });
  expect(screen.getAllByRole("listitem")).toHaveLength(3);
});

it("shows all runs for an unknown status", async () => {
  window.history.replaceState(null, "", "/?status=unknown");
  renderRunsPage();

  await screen.findByRole("button", { name: "All", pressed: true });
  expect(screen.getAllByRole("listitem")).toHaveLength(allRunCount);
});

it("opens a sorted link and restores the sort and pending search together across history", async () => {
  const sharedParams = {
    status: "failed",
    search: "check",
    sort: "duration-asc",
    source: "review",
  };
  window.history.replaceState(null, "", `/?${new URLSearchParams(sharedParams)}`);
  renderRunsPage();
  const list = await screen.findByRole("list", { name: "Runs" });
  const sort = screen.getByRole<HTMLSelectElement>("combobox", { name: "Sort by" });
  const search = screen.getByRole<HTMLInputElement>("searchbox");
  const visibleNames = () =>
    within(list)
      .getAllByRole("button")
      .map((button) => button.textContent);

  expect(sort.value).toBe("duration-asc");
  expect(visibleNames()).toEqual(["Check keyboard navigation", "Verify checkout totals"]);

  fireEvent.change(search, { target: { value: "payments" } });
  fireEvent.change(sort, { target: { value: "duration-desc" } });
  const nextParams = { ...sharedParams, search: "payments", sort: "duration-desc" };
  expect(getRunSearchParams()).toEqual(nextParams);
  expect(visibleNames()).toEqual(["Verify checkout totals"]);

  window.history.back();
  await waitFor(() => expect(sort.value).toBe("duration-asc"));
  expect(getRunSearchParams()).toEqual(sharedParams);
  expect(search.value).toBe("check");
  expect(visibleNames()).toEqual(["Check keyboard navigation", "Verify checkout totals"]);
  window.history.forward();
  await waitFor(() => expect(sort.value).toBe("duration-desc"));
  expect(search.value).toBe("payments");
  expect(visibleNames()).toEqual(["Verify checkout totals"]);

  fireEvent.change(sort, { target: { value: "created-desc" } });
  expect(getRunSearchParams()).toEqual({ ...nextParams, sort: "created-desc" });
});

it("falls back to newest first for an unknown sort in a link", async () => {
  vi.mocked(runApi.getRuns).mockResolvedValue(createMockRuns().reverse());
  window.history.replaceState(null, "", "/?sort=unknown");
  renderRunsPage();
  const list = await screen.findByRole("list", { name: "Runs" });
  expect(screen.getByRole<HTMLSelectElement>("combobox", { name: "Sort by" }).value).toBe(
    "created-desc",
  );
  expect(within(list).getAllByRole("button")[0].textContent).toBe("Update dashboard dependencies");
});

it("toggles only Created and Duration in the list header and keeps the URL in sync", async () => {
  window.history.replaceState(null, "", "/?status=failed&search=check");
  renderRunsPage();
  const list = await screen.findByRole("list", { name: "Runs" });
  const header = within(screen.getByRole("group", { name: "Sort runs" }));
  const created = header.getByRole("button", { name: /^Created/ });
  const duration = header.getByRole("button", { name: /^Duration/ });
  expect(header.getAllByRole("button")).toHaveLength(2);

  function expectFirstRun(name: string, sort?: string) {
    expect(within(list).getAllByRole("button")[0].textContent).toBe(name);
    expect(getRunSearchParams().sort).toBe(sort);
  }

  expectFirstRun("Verify checkout totals");
  fireEvent.click(created);
  expectFirstRun("Check keyboard navigation", "created-asc");
  fireEvent.click(created);
  expectFirstRun("Verify checkout totals", "created-desc");
  fireEvent.click(duration);
  expectFirstRun("Check keyboard navigation", "duration-asc");
  fireEvent.click(duration);
  expectFirstRun("Verify checkout totals", "duration-desc");
  fireEvent.click(created);
  expectFirstRun("Verify checkout totals", "created-desc");
  expect(getRunSearchParams()).toMatchObject({ status: "failed", search: "check" });
});
