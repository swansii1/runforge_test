export const runStatuses = ["queued", "running", "succeeded", "failed"] as const;
export type RunStatus = (typeof runStatuses)[number];

export interface Run {
  id: string;
  name: string;
  repository: string;
  branch: string;
  status: RunStatus;
  createdAt: string;
  durationSeconds?: number;
  logs: string[];
  result?: string;
}
