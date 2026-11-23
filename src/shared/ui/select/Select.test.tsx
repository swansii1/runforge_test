import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { Select } from "./Select";

afterEach(cleanup);

it("renders the supplied choices and follows the value set by its parent", () => {
  const options = [
    { value: "compact", label: "Compact" },
    { value: "roomy", label: "Comfortable" },
  ] as const;
  const onChange = vi.fn();
  const props = { label: "Density", options, onChange };
  const { rerender } = render(<Select {...props} value="compact" />);

  const select = screen.getByRole<HTMLSelectElement>("combobox", { name: "Density" });
  expect(Array.from(select.options, (option) => option.label)).toEqual(["Compact", "Comfortable"]);
  fireEvent.change(select, { target: { value: "roomy" } });
  expect(onChange).toHaveBeenCalledWith("roomy");
  expect(select.value).toBe("compact");

  rerender(<Select {...props} value="roomy" />);
  expect(select.value).toBe("roomy");
  screen.getByText("Density: Comfortable");
});
