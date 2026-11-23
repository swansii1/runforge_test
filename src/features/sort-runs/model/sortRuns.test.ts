import { expect, it } from "vitest";
import { createMockRuns } from "../../../entities/run/testing";
import { sortRuns } from "./sortRuns";

const [baseRun] = createMockRuns();
const runs = Object.freeze([
  { ...baseRun, id: "pending", createdAt: "2026-11-19T10:00:00Z", durationSeconds: undefined },
  { ...baseRun, id: "first", createdAt: "2026-11-19T09:00:00Z", durationSeconds: 12 },
  { ...baseRun, id: "instant", createdAt: "2026-11-19T09:30:00+02:00", durationSeconds: 0 },
  { ...baseRun, id: "second", createdAt: "2026-11-19T09:00:00Z", durationSeconds: 12 },
  { ...baseRun, id: "queued", createdAt: "2026-11-19T08:00:00Z", durationSeconds: undefined },
]);

it.each([
  ["created-desc", ["pending", "first", "second", "queued", "instant"]],
  ["created-asc", ["instant", "queued", "first", "second", "pending"]],
  ["duration-desc", ["first", "second", "instant", "pending", "queued"]],
  ["duration-asc", ["instant", "first", "second", "pending", "queued"]],
] as const)("orders runs by %s and preserves the order of ties", (sort, expectedIds) => {
  expect(sortRuns(runs, sort).map((run) => run.id)).toEqual(expectedIds);
});
