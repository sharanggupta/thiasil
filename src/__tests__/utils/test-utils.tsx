import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { CouponProvider } from '@/contexts/CouponContext'

// Mock providers for testing
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <CouponProvider enablePersistence={false}>
      {children}
    </CouponProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }