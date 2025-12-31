/* @vitest-environment jsdom */

import React from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { createRoot } from 'react-dom/client'
import { act } from 'react-dom/test-utils'
import { CartProvider, useCart } from './useCart'

describe('CartProvider', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    // fresh DOM container per test
    container = document.createElement('div')
    document.body.appendChild(container)
    // ensure localStorage clean state
    try {
      localStorage.clear()
    } catch {}
  })

  it('provides clearCart (alias of clear) to consumers', async () => {
    let receivedClear: (() => void) | undefined

    function Consumer() {
      const ctx = useCart()
      React.useEffect(() => {
        receivedClear = ctx.clearCart
      }, [ctx])
      return null
    }

    const root = createRoot(container)
    await act(async () => {
      root.render(React.createElement(CartProvider, null, React.createElement(Consumer)))
      // allow effects to flush
      await Promise.resolve()
    })

    expect(typeof receivedClear).toBe('function')

    // call it and expect no throw (it will no-op in test environment)
    expect(() => receivedClear!()).not.toThrow()

    root.unmount()
  })
})
