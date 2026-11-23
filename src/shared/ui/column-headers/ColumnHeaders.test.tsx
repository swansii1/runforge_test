import { cleanup, fireEvent, isInaccessible, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { ColumnHeaders } from "./ColumnHeaders";

afterEach(cleanup);

it("shows the supplied columns and calls the selected column's sort action", () => {
  const onToggle = vi.fn();
  render(
    <ColumnHeaders
      label="Project columns"
      columns={[
        { id: "owner", label: "Owner" },
        {
          id: "name",
          label: "Project name",
          sort: { direction: "ascending", nextDirection: "descending", onToggle },
        },
      ]}
    />,
  );

  const headers = within(screen.getByRole("group", { name: "Project columns" }));
  expect(isInaccessible(headers.getByText("Owner"))).toBe(false);
  fireEvent.click(
    headers.getByRole("button", { name: "Project name, sorted ascending. Sort descending" }),
  );
  expect(onToggle).toHaveBeenCalledOnce();
});
