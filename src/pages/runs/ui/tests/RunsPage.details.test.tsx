import { act, fireEvent, screen, within } from "@testing-library/react";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { getRunSearchParams, renderRunsPage, setupRunsPageTests } from "./renderRunsPage";

setupRunsPageTests();

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
    window.history.replaceState(null, "", "/?status=failed&search=payments");
    renderRunsPage();
    const run = { name: "Verify checkout totals" };
    fireEvent.click(await screen.findByRole("button", run));

    const dialog = screen.getByRole("dialog", run);
    expect(
      within(dialog).getByText("Loaded checkout fixtures.", { exact: false }).textContent,
    ).toBe("Loaded checkout fixtures.\nExpected total 19.99, received 20.00.\nOne test failed.");
    expect(
      within(dialog).getByText("Checkout rounds the discounted total incorrectly."),
    ).toBeDefined();
    fireEvent.click(within(dialog).getByRole("button", { name: "Close" }));

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByRole<HTMLInputElement>("searchbox", { name: "Search runs" }).value).toBe(
      "payments",
    );
    expect(getRunSearchParams()).toEqual({ status: "failed", search: "payments" });
    expect(screen.getByRole("button", { name: "Failed", pressed: true })).toBeDefined();
    expect(within(screen.getByRole("listitem")).getByRole("button", run)).toBeDefined();
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

  it("restores filter focus on Back when the row disappears and keeps details closed on Forward", async () => {
    window.history.replaceState(null, "", "/?status=running");
    renderRunsPage();
    fireEvent.click(await screen.findByRole("button", { name: "Failed" }));
    const run = { name: "Verify checkout totals" };
    fireEvent.click(screen.getByRole("button", run));
    screen.getByRole("dialog", run);

    window.history.back();
    const activeFilter = await screen.findByRole("button", { name: "Running", pressed: true });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.queryByRole("button", run)).toBeNull();
    expect(document.activeElement).toBe(activeFilter);

    window.history.forward();
    await screen.findByRole("button", run);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
