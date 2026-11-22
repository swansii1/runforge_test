import { cleanup, render, type RenderOptions } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { afterEach, beforeEach, vi } from "vitest";
import * as runApi from "../../../../entities/run";
import { createMockRuns } from "../../../../entities/run/testing";
import { RunsPage } from "../RunsPage";

export function setupRunsPageTests() {
  beforeEach(() => {
    vi.spyOn(runApi, "getRuns").mockResolvedValue(createMockRuns());
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.useRealTimers();
    window.history.replaceState(null, "", "/");
  });
}

export function renderRunsPage(options?: Pick<RenderOptions, "reactStrictMode">) {
  return render(<RunsPage />, { wrapper: BrowserRouter, ...options });
}

export function getRunSearchParams() {
  return Object.fromEntries(new URLSearchParams(window.location.search));
}
