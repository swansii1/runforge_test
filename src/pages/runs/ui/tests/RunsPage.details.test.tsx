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

  it("keeps the filtered list after Close and reopens the same run", async () => {
    window.history.replaceState(null, "", "/?status=failed&search=payments");
    renderRunsPage();
    const run = { name: "Verify checkout totals" };
    fireEvent.click(await screen.findByRole("button", run));

    const dialog = screen.getByRole("dialog", run);
    fireEvent.click(within(dialog).getByRole("button", { name: "Close" }));

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByRole<HTMLInputElement>("searchbox", { name: "Search runs" }).value).toBe(
      "payments",
    );
    expect(getRunSearchParams()).toEqual({ status: "failed", search: "payments" });
    expect(screen.getByRole("button", { name: "Failed", pressed: true })).toBeDefined();

    fireEvent.click(within(screen.getByRole("listitem")).getByRole("button", run));
    expect(screen.getByRole<HTMLDialogElement>("dialog", run).open).toBe(true);
  });

  it("shows the result before the numbered log lines", async () => {
    renderRunsPage();
    const run = { name: "Verify checkout totals" };
    fireEvent.click(await screen.findByRole("button", run));

    const dialog = within(screen.getByRole("dialog", run));
    const headings = dialog.getAllByRole("heading", { level: 3 });
    expect(headings.map((heading) => heading.textContent)).toEqual(["Result", "Logs"]);
    dialog.getByText("Checkout rounds the discounted total incorrectly.");

    const logRows = within(dialog.getByRole("list", { name: "Logs" })).getAllByRole("listitem");
    const expectedLogs = [
      ["01", "Loaded checkout fixtures."],
      ["02", "Expected total 19.99, received 20.00."],
      ["03", "One test failed."],
    ];
    expect(logRows).toHaveLength(expectedLogs.length);
    expectedLogs.forEach(([number, message], index) => {
      const row = within(logRows[index]);
      row.getByText(number);
      row.getByText(message);
    });
  });

  it("closes details when the search changes the URL, even if the run still matches", async () => {
    renderRunsPage();
    const search = await screen.findByRole("searchbox");
    const run = { name: "Update dashboard dependencies" };
    vi.useFakeTimers();
    fireEvent.change(search, { target: { value: "dashboard" } });
    fireEvent.click(screen.getByRole("button", run));

    const dialog = within(screen.getByRole("dialog", run));
    expect(dialog.queryByRole("heading", { name: "Result" })).toBeNull();
    dialog.getByText("Waiting for an available worker.");

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(getRunSearchParams()).toEqual({ search: "dashboard" });
    expect(screen.queryByRole("dialog")).toBeNull();
    fireEvent.click(screen.getByRole("button", run));
    screen.getByRole("dialog", run);
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
