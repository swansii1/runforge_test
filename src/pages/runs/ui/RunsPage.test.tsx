import { StrictMode } from "react";
import { BrowserRouter } from "react-router";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import {
  afterAll,
  afterEach,
  assert,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import * as runApi from "../../../entities/run";
import { createMockRuns, createPendingRunsRequest } from "../../../entities/run/testing";
import { RunsPage } from "./RunsPage";

beforeEach(() => {
  vi.spyOn(runApi, "getRuns").mockResolvedValue(createMockRuns());
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
  window.history.replaceState(null, "", "/");
});

function renderRunsPage() {
  return render(
    <BrowserRouter>
      <RunsPage />
    </BrowserRouter>,
  );
}

it("shows loading and renders all six runs with distinct zero and missing durations", async () => {
  const request = createPendingRunsRequest();
  vi.mocked(runApi.getRuns).mockReturnValue(request.promise);
  renderRunsPage();

  expect(screen.getByRole("heading", { name: "Runs", level: 1 })).toBeDefined();
  expect(screen.getByText("Loading runs…")).toBeDefined();
  await act(async () => {
    request.resolve(createMockRuns());
  });
  const list = screen.getByRole("list", { name: "Runs" });
  expect(within(list).getAllByRole("listitem")).toHaveLength(6);

  const checksumRow = within(list).getByText("Check migration checksum").closest("li");
  const dependenciesRow = within(list).getByText("Update dashboard dependencies").closest("li");
  assert.isNotNull(checksumRow);
  assert.isNotNull(dependenciesRow);
  expect(within(checksumRow).getByText("0s")).toBeDefined();
  expect(within(dependenciesRow).getByText("—")).toBeDefined();
});

it("recovers from a failed request when Retry is pressed", async () => {
  const initialRequest = createPendingRunsRequest();
  const retryRequest = createPendingRunsRequest();
  vi.mocked(runApi.getRuns).mockImplementation(({ simulateError } = {}) =>
    simulateError ? initialRequest.promise : retryRequest.promise,
  );
  window.history.replaceState(null, "", "/?mockError=once");
  render(
    <StrictMode>
      <BrowserRouter>
        <RunsPage />
      </BrowserRouter>
    </StrictMode>,
  );

  screen.getByText("Loading runs…");
  await act(async () => {
    initialRequest.reject(new Error("First request failed"));
  });
  screen.getByRole("alert");
  expect(window.location.search).toBe("?mockError=once");
  fireEvent.click(screen.getByRole("button", { name: "Retry" }));
  expect(screen.getByText("Loading runs…")).toBeDefined();
  await act(async () => {
    retryRequest.resolve(createMockRuns());
  });
  const list = screen.getByRole("list", { name: "Runs" });
  expect(within(list).getAllByRole("listitem")).toHaveLength(6);
  expect(screen.queryByRole("alert")).toBeNull();
  expect(window.location.search).toBe("?mockError=once");
});

it("shows typed text immediately and filters only after a pause following the last change", async () => {
  renderRunsPage();
  const search = await screen.findByRole<HTMLInputElement>("searchbox");
  vi.useFakeTimers();

  fireEvent.change(search, { target: { value: "web" } });
  act(() => {
    vi.advanceTimersByTime(200);
  });
  fireEvent.change(search, { target: { value: "checkout" } });
  expect(search.value).toBe("checkout");
  expect(screen.getAllByRole("listitem")).toHaveLength(6);

  fireEvent.click(screen.getByRole("button", { name: "Failed" }));
  act(() => {
    vi.advanceTimersByTime(299);
  });
  expect(screen.getAllByRole("listitem")).toHaveLength(2);
  act(() => {
    vi.advanceTimersByTime(1);
  });
  expect(within(screen.getByRole("listitem")).getByText("Verify checkout totals")).toBeDefined();
  expect(window.location.search).toBe("?status=failed");

  fireEvent.change(search, { target: { value: "" } });
  expect(screen.getAllByRole("listitem")).toHaveLength(2);
});

it("combines repository and name searches with the status filter and resets both controls", async () => {
  renderRunsPage();

  const search = await screen.findByRole<HTMLInputElement>("searchbox", { name: "Search runs" });
  fireEvent.change(search, { target: { value: "  WEB-plat  " } });
  await waitFor(() => expect(screen.getAllByRole("listitem")).toHaveLength(3));

  fireEvent.click(screen.getByRole("button", { name: "Failed" }));
  expect(screen.getAllByRole("listitem")).toHaveLength(1);
  expect(within(screen.getByRole("listitem")).getByText("Check keyboard navigation")).toBeDefined();

  fireEvent.change(search, { target: { value: "checkout" } });
  await screen.findByRole("button", { name: "Verify checkout totals" });

  fireEvent.click(screen.getByRole("button", { name: "Succeeded" }));
  expect(screen.getByText("No matching runs")).toBeDefined();
  expect(screen.queryByRole("listitem")).toBeNull();
  vi.useFakeTimers();
  fireEvent.change(search, { target: { value: "payments" } });
  fireEvent.click(screen.getByRole("button", { name: "Reset filters" }));
  expect(search.value).toBe("");
  expect(screen.getByRole("button", { name: "All", pressed: true })).toBeDefined();
  expect(screen.getAllByRole("listitem")).toHaveLength(6);
  act(() => {
    vi.advanceTimersByTime(300);
  });
  expect(screen.getAllByRole("listitem")).toHaveLength(6);
});

it("restores the linked status and follows browser back and forward with a local search", async () => {
  window.history.replaceState(null, "", "/?source=review&status=failed");
  renderRunsPage();

  const search = await screen.findByRole<HTMLInputElement>("searchbox");
  expect(screen.getByRole("button", { name: "Failed", pressed: true })).toBeDefined();
  expect(screen.getAllByRole("listitem")).toHaveLength(2);

  fireEvent.change(search, { target: { value: "web-platform" } });
  await waitFor(() => expect(screen.getAllByRole("listitem")).toHaveLength(1));
  expect(window.location.search).toBe("?source=review&status=failed");
  expect(within(screen.getByRole("listitem")).getByText("Check keyboard navigation")).toBeDefined();

  fireEvent.click(screen.getByRole("button", { name: "Running" }));
  expect(window.location.search).toBe("?source=review&status=running");
  expect(within(screen.getByRole("listitem")).getByText("Refactor sign-in form")).toBeDefined();

  window.history.back();
  await screen.findByRole("button", { name: "Failed", pressed: true });
  expect(within(screen.getByRole("listitem")).getByText("Check keyboard navigation")).toBeDefined();
  window.history.forward();
  await screen.findByRole("button", { name: "Running", pressed: true });
  expect(within(screen.getByRole("listitem")).getByText("Refactor sign-in form")).toBeDefined();
  expect(search.value).toBe("web-platform");

  fireEvent.click(screen.getByRole("button", { name: "All" }));
  expect(window.location.search).toBe("?source=review");
  expect(screen.getAllByRole("listitem")).toHaveLength(3);
});

it("shows all runs for an unknown status", async () => {
  window.history.replaceState(null, "", "/?status=unknown");
  renderRunsPage();

  await screen.findByRole("button", { name: "All", pressed: true });
  expect(screen.getAllByRole("listitem")).toHaveLength(6);
});

describe("run details dialog", () => {
  beforeAll(() => {
    // jsdom exposes the dialog element but does not implement showModal().
    HTMLDialogElement.prototype.showModal = function () {
      this.open = true;
    };
    HTMLDialogElement.prototype.close = function () {
      this.open = false;
      this.dispatchEvent(new Event("close"));
    };
  });

  afterAll(() => {
    Reflect.deleteProperty(HTMLDialogElement.prototype, "showModal");
    Reflect.deleteProperty(HTMLDialogElement.prototype, "close");
  });

  it("opens the selected run and keeps the filtered list after the dialog closes", async () => {
    window.history.replaceState(null, "", "/?status=failed");
    renderRunsPage();
    const search = await screen.findByRole<HTMLInputElement>("searchbox");
    fireEvent.change(search, { target: { value: "payments" } });
    await waitFor(() => expect(screen.getAllByRole("listitem")).toHaveLength(1));
    fireEvent.click(screen.getByRole("button", { name: "Verify checkout totals" }));

    const dialog = screen.getByRole("dialog", { name: "Verify checkout totals" });
    expect(
      within(dialog).getByText("Loaded checkout fixtures.", { exact: false }).textContent,
    ).toBe("Loaded checkout fixtures.\nExpected total 19.99, received 20.00.\nOne test failed.");
    expect(
      within(dialog).getByText("Checkout rounds the discounted total incorrectly."),
    ).toBeDefined();
    fireEvent.click(within(dialog).getByRole("button", { name: "Close" }));

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(dialog.isConnected).toBe(false);
    expect(search.value).toBe("payments");
    expect(window.location.search).toBe("?status=failed");
    expect(screen.getByRole("button", { name: "Failed", pressed: true })).toBeDefined();
    expect(within(screen.getByRole("listitem")).getByText("Verify checkout totals")).toBeDefined();
    fireEvent.click(screen.getByRole("button", { name: "Verify checkout totals" }));
    screen.getByRole("dialog", { name: "Verify checkout totals" });
  });

  it("keeps details open when a pending search hides the row and restores filter focus on close", async () => {
    renderRunsPage();
    const search = await screen.findByRole("searchbox");
    const runName = "Update dashboard dependencies";
    vi.useFakeTimers();
    fireEvent.change(search, { target: { value: "payments" } });
    fireEvent.click(screen.getByRole("button", { name: runName }));
    const dialog = screen.getByRole("dialog", { name: runName });
    const closeButton = within(dialog).getByRole("button", { name: "Close" });
    closeButton.focus();

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.queryByRole("button", { name: runName })).toBeNull();
    expect(screen.getByRole("dialog", { name: runName })).toBe(dialog);
    expect(document.activeElement).toBe(closeButton);

    fireEvent.click(closeButton);
    expect(dialog.isConnected).toBe(false);
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "All", pressed: true }));
  });

  it.each(["row", "searchbox"])(
    "handles a row disappearing after close with focus on the %s",
    async (focusedElement) => {
      window.history.replaceState(null, "", "/?status=failed");
      renderRunsPage();
      const search = await screen.findByRole("searchbox");
      const trigger = screen.getByRole("button", { name: "Check keyboard navigation" });
      const activeFilter = screen.getByRole("button", { name: "Failed", pressed: true });
      vi.useFakeTimers();
      fireEvent.change(search, { target: { value: "payments" } });
      fireEvent.click(trigger);
      const dialog = screen.getByRole<HTMLDialogElement>("dialog");
      act(() => {
        dialog.close();
      });
      expect(document.activeElement).toBe(trigger);

      if (focusedElement === "searchbox") search.focus();
      act(() => {
        vi.advanceTimersByTime(300);
      });
      expect(trigger.isConnected).toBe(false);
      expect(document.activeElement).toBe(focusedElement === "row" ? activeFilter : search);
    },
  );

  it("focuses the restored status filter when Back removes the row after Close", async () => {
    window.history.replaceState(null, "", "/?status=running");
    renderRunsPage();
    fireEvent.click(await screen.findByRole("button", { name: "Failed" }));
    const trigger = screen.getByRole("button", { name: "Verify checkout totals" });
    fireEvent.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "Verify checkout totals" });
    fireEvent.click(within(dialog).getByRole("button", { name: "Close" }));
    expect(dialog.isConnected).toBe(false);
    expect(document.activeElement).toBe(trigger);

    window.history.back();
    const runningFilter = await screen.findByRole("button", { name: "Running", pressed: true });
    expect(trigger.isConnected).toBe(false);
    expect(document.activeElement).toBe(runningFilter);
  });

  it("closes details and restores row focus on back to All and forward to Failed", async () => {
    renderRunsPage();
    fireEvent.click(await screen.findByRole("button", { name: "Failed" }));
    const runName = "Verify checkout totals";

    function openDetails() {
      fireEvent.click(screen.getByRole("button", { name: runName }));
      const dialog = screen.getByRole("dialog", { name: runName });
      within(dialog).getByRole("button", { name: "Close" }).focus();
    }

    openDetails();
    window.history.back();
    await screen.findByRole("button", { name: "All", pressed: true });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: runName }));

    openDetails();
    window.history.forward();
    await screen.findByRole("button", { name: "Failed", pressed: true });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: runName }));
  });

  it.each(["", "payments"])(
    'restores filter focus and keeps details closed across history with search "%s"',
    async (query) => {
      window.history.replaceState(null, "", "/?status=running");
      renderRunsPage();
      const failedFilter = await screen.findByRole("button", { name: "Failed" });
      fireEvent.click(failedFilter);
      fireEvent.change(screen.getByRole("searchbox"), { target: { value: query } });
      const runButton = { name: "Verify checkout totals" };
      fireEvent.click(screen.getByRole("button", runButton));
      screen.getByRole("dialog", runButton);

      window.history.back();
      const activeFilter = await screen.findByRole("button", { name: "Running", pressed: true });
      expect(document.activeElement).toBe(activeFilter);
      if (query) await screen.findByText("No matching runs");
      expect(screen.queryByRole("button", runButton)).toBeNull();
      expect(screen.queryByRole("dialog")).toBeNull();

      window.history.forward();
      await screen.findByRole("button", { name: "Failed", pressed: true });
      const restoredRun = screen.getByRole("button", runButton);
      expect(screen.queryByRole("dialog")).toBeNull();
      fireEvent.click(restoredRun);
      screen.getByRole("dialog", runButton);
    },
  );
});
