import { StrictMode } from 'react'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, assert, expect, it } from 'vitest'
import { RunsPage } from './RunsPage'

afterEach(() => {
  cleanup()
  window.history.replaceState(null, '', '/')
})

it('shows loading and renders all six runs with distinct zero and missing durations', async () => {
  render(<RunsPage />)

  expect(screen.getByRole('heading', { name: 'Runs', level: 1 })).toBeDefined()
  expect(screen.getByText('Loading runs…')).toBeDefined()
  const list = await screen.findByRole('list', { name: 'Runs' })
  expect(within(list).getAllByRole('listitem')).toHaveLength(6)

  const checksumRow = within(list).getByText('Check migration checksum').closest('li')
  const dependenciesRow = within(list).getByText('Update dashboard dependencies').closest('li')
  assert.isNotNull(checksumRow)
  assert.isNotNull(dependenciesRow)
  expect(within(checksumRow).getByText('0s')).toBeDefined()
  expect(within(dependenciesRow).getByText('—')).toBeDefined()
})

it('recovers from a failed request when Retry is pressed', async () => {
  window.history.replaceState(null, '', '/?mockError=once')
  render(<StrictMode><RunsPage /></StrictMode>)

  await screen.findByRole('alert')
  expect(window.location.search).toBe('?mockError=once')
  fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
  expect(screen.getByText('Loading runs…')).toBeDefined()
  await screen.findByRole('list', { name: 'Runs' })
  expect(screen.queryByRole('alert')).toBeNull()
  expect(window.location.search).toBe('?mockError=once')
})
