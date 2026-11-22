/** @vitest-environment jsdom */
import { createRoot } from 'react-dom/client'
import { afterEach, expect, it, vi } from 'vitest'
import App from './App.jsx'

afterEach(() => { vi.unstubAllGlobals() })

it('renders the app shell when sentiment data loads', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }))
  vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} })
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)
  root.render(<App />)
  await new Promise((resolve) => setTimeout(resolve, 20))
  expect(container.textContent).toContain('Sentiment Analysis')
  root.unmount()
  container.remove()
})
