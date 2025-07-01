import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Helper to wait for element to appear
export const waitForElement = async (text: string | RegExp) => {
  return await waitFor(() => screen.getByText(text))
}

// Helper to wait for element to disappear
export const waitForElementToBeRemoved = async (text: string | RegExp) => {
  const element = screen.queryByText(text)
  if (element) {
    await waitFor(() => expect(screen.queryByText(text)).not.toBeInTheDocument())
  }
}

// Helper for user interactions
export const user = userEvent.setup()

// Helper to mock fetch responses
export const mockFetch = (response: any, ok = true, delay = 0, status = 200) => {
  ;(global.fetch as jest.Mock).mockResolvedValueOnce(
    new Promise(resolve => 
      setTimeout(() => resolve({
        ok,
        json: async () => response,
        status: ok ? status : 400,
      }), delay)
    )
  )
}

// Helper to mock fetch errors
export const mockFetchError = (error = 'Network error') => {
  ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error(error))
}

// Helper to clear all mocks
export const clearAllMocks = () => {
  jest.clearAllMocks()
  localStorage.clear()
  sessionStorage.clear()
}

// Helper for testing component loading states
export const expectLoadingState = () => {
  expect(screen.getByText(/loading/i)).toBeInTheDocument()
}

// Helper for testing error states
export const expectErrorState = (error?: string) => {
  if (error) {
    expect(screen.getByText(error)).toBeInTheDocument()
  } else {
    expect(screen.getByText(/error|failed|something went wrong/i)).toBeInTheDocument()
  }
}