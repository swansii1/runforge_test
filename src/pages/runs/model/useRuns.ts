import { useEffect, useState } from 'react'
import { getRuns, type Run } from '../../../entities/run'

type RunsRequest =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'success'; runs: Run[] }

export function useRuns({ failFirstRequest }: { failFirstRequest: boolean }) {
  const [request, setRequest] = useState<RunsRequest>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadRuns() {
      try {
        const runs = await getRuns({
          signal: controller.signal,
          simulateError: failFirstRequest && attempt === 0,
        })
        if (!controller.signal.aborted) setRequest({ status: 'success', runs })
      } catch {
        if (!controller.signal.aborted) setRequest({ status: 'error' })
      }
    }

    void loadRuns()
    return () => controller.abort()
  }, [attempt, failFirstRequest])

  function retry() {
    setRequest({ status: 'loading' })
    setAttempt(previous => previous + 1)
  }

  return { request, retry }
}
