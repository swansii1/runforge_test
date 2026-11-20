import type { Run } from '../model/run'
import { createMockRuns } from './createMockRuns'

const responseDelayMs = 500

export async function getRuns(): Promise<Run[]> {
  await new Promise<void>((resolve) => setTimeout(resolve, responseDelayMs))
  return createMockRuns()
}
