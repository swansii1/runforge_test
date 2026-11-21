import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, assert, expect, it } from 'vitest'
import { RunsPage } from './RunsPage'

afterEach(() => {
  cleanup()
  window.history.replaceState(null, '', '/')
})

function renderRunsPage() {
  return render(<BrowserRouter><RunsPage /></BrowserRouter>)
}

it('shows loading and renders all six runs with distinct zero and missing durations', async () => {
  renderRunsPage()

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
  render(<StrictMode><BrowserRouter><RunsPage /></BrowserRouter></StrictMode>)

  await screen.findByRole('alert')
  expect(window.location.search).toBe('?mockError=once')
  fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
  expect(screen.getByText('Loading runs…')).toBeDefined()
  await screen.findByRole('list', { name: 'Runs' })
  expect(screen.queryByRole('alert')).toBeNull()
  expect(window.location.search).toBe('?mockError=once')
})

it('combines repository and name searches with the status filter and resets both controls', async () => {
  renderRunsPage()

  const search = await screen.findByRole<HTMLInputElement>('searchbox', { name: 'Search runs' })
  fireEvent.change(search, { target: { value: '  WEB-plat  ' } })
  expect(screen.getAllByRole('listitem')).toHaveLength(3)

  fireEvent.click(screen.getByRole('button', { name: 'Failed' }))
  expect(screen.getAllByRole('listitem')).toHaveLength(1)
  expect(within(screen.getByRole('listitem')).getByText('Check keyboard navigation')).toBeDefined()

  fireEvent.change(search, { target: { value: 'checkout' } })
  expect(within(screen.getByRole('listitem')).getByText('Verify checkout totals')).toBeDefined()

  fireEvent.click(screen.getByRole('button', { name: 'Succeeded' }))
  expect(screen.getByText('No matching runs')).toBeDefined()
  expect(screen.queryByRole('listitem')).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: 'Reset filters' }))
  expect(search.value).toBe('')
  expect(screen.getByRole('button', { name: 'All', pressed: true })).toBeDefined()
  expect(screen.getAllByRole('listitem')).toHaveLength(6)
})

it('restores the linked status and follows browser back and forward with a local search', async () => {
  window.history.replaceState(null, '', '/?source=review&status=failed')
  renderRunsPage()

  const search = await screen.findByRole<HTMLInputElement>('searchbox')
  expect(screen.getByRole('button', { name: 'Failed', pressed: true })).toBeDefined()
  expect(screen.getAllByRole('listitem')).toHaveLength(2)

  fireEvent.change(search, { target: { value: 'web-platform' } })
  expect(window.location.search).toBe('?source=review&status=failed')
  expect(within(screen.getByRole('listitem')).getByText('Check keyboard navigation')).toBeDefined()

  fireEvent.click(screen.getByRole('button', { name: 'Running' }))
  expect(window.location.search).toBe('?source=review&status=running')
  expect(within(screen.getByRole('listitem')).getByText('Refactor sign-in form')).toBeDefined()

  window.history.back()
  await screen.findByRole('button', { name: 'Failed', pressed: true })
  expect(within(screen.getByRole('listitem')).getByText('Check keyboard navigation')).toBeDefined()
  window.history.forward()
  await screen.findByRole('button', { name: 'Running', pressed: true })
  expect(within(screen.getByRole('listitem')).getByText('Refactor sign-in form')).toBeDefined()
  expect(search.value).toBe('web-platform')

  fireEvent.click(screen.getByRole('button', { name: 'All' }))
  expect(window.location.search).toBe('?source=review')
  expect(screen.getAllByRole('listitem')).toHaveLength(3)
})

it('shows all runs for an unknown status', async () => {
  window.history.replaceState(null, '', '/?status=unknown')
  renderRunsPage()

  await screen.findByRole('button', { name: 'All', pressed: true })
  expect(screen.getAllByRole('listitem')).toHaveLength(6)
})

it('opens the selected run and keeps the filtered list after the dialog closes', async () => {
  // jsdom exposes the dialog element but does not implement showModal().
  HTMLDialogElement.prototype.showModal = function () { this.open = true }
  try {
    window.history.replaceState(null, '', '/?status=failed')
    renderRunsPage()
    const search = await screen.findByRole<HTMLInputElement>('searchbox')
    fireEvent.change(search, { target: { value: 'payments' } })
    fireEvent.click(screen.getByRole('button', { name: 'Verify checkout totals' }))

    const dialog = screen.getByRole('dialog', { name: 'Verify checkout totals' })
    expect(within(dialog).getByText('Loaded checkout fixtures.', { exact: false }).textContent)
      .toBe('Loaded checkout fixtures.\nExpected total 19.99, received 20.00.\nOne test failed.')
    expect(within(dialog).getByText('Checkout rounds the discounted total incorrectly.')).toBeDefined()
    fireEvent(dialog, new Event('close'))

    expect(screen.queryByRole('dialog')).toBeNull()
    expect(search.value).toBe('payments')
    expect(window.location.search).toBe('?status=failed')
    expect(screen.getByRole('button', { name: 'Failed', pressed: true })).toBeDefined()
    expect(within(screen.getByRole('listitem')).getByText('Verify checkout totals')).toBeDefined()
  } finally {
    Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal')
  }
})
