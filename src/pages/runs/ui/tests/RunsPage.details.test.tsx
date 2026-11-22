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

  it("keeps details open when a pending search hides the row", async () => {
    renderRunsPage();
    const search = await screen.findByRole("searchbox");
    const run = { name: "Update dashboard dependencies" };
    vi.useFakeTimers();
    fireEvent.change(search, { target: { value: "payments" } });
    fireEvent.click(screen.getByRole("button", run));

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.queryByRole("button", run)).toBeNull();
    const dialog = screen.getByRole("dialog", run);
    fireEvent.click(within(dialog).getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes details on Back and Forward and keeps them closed on return", async () => {
    renderRunsPage();
    fireEvent.click(await screen.findByRole("button", { name: "Failed" }));
    const run = { name: "Verify checkout totals" };

    function openDetails() {
      fireEvent.click(screen.getByRole("button", run));
      screen.getByRole("dialog", run);
    }

    openDetails();
    window.history.back();
    await screen.findByRole("button", { name: "All", pressed: true });
    expect(screen.queryByRole("dialog")).toBeNull();

    window.history.forward();
    await screen.findByRole("button", { name: "Failed", pressed: true });
    expect(screen.queryByRole("dialog")).toBeNull();

    window.history.back();
    await screen.findByRole("button", { name: "All", pressed: true });
    openDetails();
    window.history.forward();
    await screen.findByRole("button", { name: "Failed", pressed: true });
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
