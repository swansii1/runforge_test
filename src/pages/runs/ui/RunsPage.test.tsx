import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'
import { RunsPage } from './RunsPage'

afterEach(cleanup)

it('renders the Runs page heading', () => {
  render(<RunsPage />)

  expect(screen.getByRole('heading', { name: 'Runs', level: 1 })).toBeDefined()
})
