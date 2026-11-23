import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { SegmentedControl } from "./SegmentedControl";

afterEach(cleanup);

it("reports the clicked value and updates the pressed button only when its value prop changes", () => {
  const options = [
    { value: "day", label: "Daily" },
    { value: "week", label: "Weekly" },
  ] as const;
  const onChange = vi.fn();
  const props = { label: "Time range", options, onChange };
  const { rerender } = render(<SegmentedControl {...props} value="day" />);
  const range = within(screen.getByRole("group", { name: "Time range" }));

  fireEvent.click(range.getByRole("button", { name: "Weekly", pressed: false }));
  expect(onChange).toHaveBeenCalledExactlyOnceWith("week");
  range.getByRole("button", { name: "Daily", pressed: true });
  range.getByRole("button", { name: "Weekly", pressed: false });

  rerender(<SegmentedControl {...props} value="week" />);
  range.getByRole("button", { name: "Daily", pressed: false });
  range.getByRole("button", { name: "Weekly", pressed: true });
});
