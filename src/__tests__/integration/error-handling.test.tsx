import React from 'react'
import { render, screen, waitFor } from '../utils/test-utils'
import { user, mockFetch, clearAllMocks, simulateNetworkError } from '../utils/test-helpers'

// Mock fetch globally
const originalFetch = global.fetch
beforeAll(() => {
  global.fetch = jest.fn()
})

afterAll(() => {
  global.fetch = originalFetch
})

describe('Error Handling Integration', () => {
  beforeEach(() => {
    clearAllMocks()
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('API Error Recovery', () => {
    it('should show error message when API call fails', async () => {
      // Given: A component that fetches data
      const DataFetcher = () => {
        const [data, setData] = React.useState(null)
        const [error, setError] = React.useState('')
        const [loading, setLoading] = React.useState(false)

        const loadData = async () => {
          setLoading(true)
          setError('')
          
          try {
            const response = await fetch('/api/products')
            if (!response.ok) throw new Error('Failed to load data')
            
            const result = await response.json()
            setData(result)
          } catch (err) {
            setError('Unable to load products. Please try again.')
          } finally {
            setLoading(false)
          }
        }

        React.useEffect(() => { loadData() }, [])

        return (
          <div>
            {loading && <div data-testid="loading-indicator">Loading...</div>}
            {error && (
              <div data-testid="error-message">{error}</div>
            )}
            {data && (
              <div data-testid="success-content">Data loaded successfully</div>
            )}
            {error && (
              <button data-testid="retry-button" onClick={loadData}>
                Try Again
              </button>
            )}
          </div>
        )
      }

      // When: The API call fails
      simulateNetworkError()
      render(<DataFetcher />)

      // Then: User sees an error message
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveTextContent(
          'Unable to load products. Please try again.'
        )
      })

      // And: User can retry
      expect(screen.getByTestId('retry-button')).toBeInTheDocument()
    })

    it('should recover when retry succeeds after initial failure', async () => {
      // Given: A component that can retry failed API calls
      const DataFetcher = () => {
        const [status, setStatus] = React.useState('loading')
        
        const loadData = async () => {
          setStatus('loading')
          
          try {
            const response = await fetch('/api/products')
            if (!response.ok) throw new Error('API Error')
            
            await response.json()
            setStatus('success')
          } catch {
            setStatus('error')
          }
        }

        React.useEffect(() => { loadData() }, [])

        return (
          <div>
            {status === 'loading' && <div data-testid="loading">Loading...</div>}
            {status === 'error' && (
              <div>
                <div data-testid="error-state">Failed to load data</div>
                <button data-testid="retry-button" onClick={loadData}>
                  Retry
                </button>
              </div>
            )}
            {status === 'success' && (
              <div data-testid="success-state">Data loaded</div>
            )}
          </div>
        )
      }

      // When: Initial API call fails
      simulateNetworkError()
      render(<DataFetcher />)

      await waitFor(() => {
        expect(screen.getByTestId('error-state')).toBeInTheDocument()
      })

      // And: User clicks retry with a working API
      mockFetch({ data: ['item1', 'item2'] })
      await user.click(screen.getByTestId('retry-button'))

      // Then: User sees success state
      await waitFor(() => {
        expect(screen.getByTestId('success-state')).toBeInTheDocument()
      })

      expect(screen.queryByTestId('error-state')).not.toBeInTheDocument()
    })

    it('should handle different HTTP error statuses appropriately', async () => {
      // Given: A component that shows specific error messages for different HTTP errors
      const ApiCaller = () => {
        const [message, setMessage] = React.useState('')
        
        const callApi = async (endpoint: string) => {
          try {
            const response = await fetch(endpoint)
            
            if (response.status === 401) {
              setMessage('Please log in to continue')
            } else if (response.status === 404) {
              setMessage('Resource not found')
            } else if (response.status >= 500) {
              setMessage('Server error - please try again later')
            } else if (!response.ok) {
              setMessage('Request failed')
            } else {
              setMessage('Success')
            }
          } catch {
            setMessage('Network error')
          }
        }

        return (
          <div>
            <button 
              data-testid="call-unauthorized"
              onClick={() => callApi('/api/unauthorized')}
            >
              Call Unauthorized Endpoint
            </button>
            <button 
              data-testid="call-not-found"
              onClick={() => callApi('/api/not-found')}
            >
              Call Missing Endpoint
            </button>
            <button 
              data-testid="call-server-error"
              onClick={() => callApi('/api/server-error')}
            >
              Call Broken Endpoint
            </button>
            {message && <div data-testid="api-message">{message}</div>}
          </div>
        )
      }

      render(<ApiCaller />)

      // When: User tries unauthorized endpoint
      mockFetch({}, false, 0, 401)
      await user.click(screen.getByTestId('call-unauthorized'))

      // Then: Shows login message
      await waitFor(() => {
        expect(screen.getByTestId('api-message')).toHaveTextContent('Please log in to continue')
      })

      // When: User tries missing endpoint  
      mockFetch({}, false, 0, 404)
      await user.click(screen.getByTestId('call-not-found'))

      // Then: Shows not found message
      await waitFor(() => {
        expect(screen.getByTestId('api-message')).toHaveTextContent('Resource not found')
      })

      // When: User tries broken endpoint
      mockFetch({}, false, 0, 500)
      await user.click(screen.getByTestId('call-server-error'))

      // Then: Shows server error message
      await waitFor(() => {
        expect(screen.getByTestId('api-message')).toHaveTextContent('Server error - please try again later')
      })
    })
  })

  describe('Form Validation Errors', () => {
    it('should prevent submission when form has validation errors', async () => {
      // Given: A form with validation rules
      const ContactForm = () => {
        const [formData, setFormData] = React.useState({ name: '', email: '' })
        const [errors, setErrors] = React.useState<Record<string, string>>({})
        const [submitted, setSubmitted] = React.useState(false)

        const validate = () => {
          const newErrors: Record<string, string> = {}
          
          if (!formData.name.trim()) {
            newErrors.name = 'Name is required'
          }
          
          if (!formData.email.trim()) {
            newErrors.email = 'Email is required' 
          } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email'
          }

          setErrors(newErrors)
          return Object.keys(newErrors).length === 0
        }

        const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault()
          
          if (!validate()) {
            return // Don't submit if validation fails
          }

          // Simulate API call
          try {
            await fetch('/api/contact', {
              method: 'POST',
              body: JSON.stringify(formData)
            })
            setSubmitted(true)
          } catch {
            setErrors({ submit: 'Failed to send message' })
          }
        }

        if (submitted) {
          return <div data-testid="success-message">Thank you! Message sent.</div>
        }

        return (
          <form onSubmit={handleSubmit}>
            <input
              data-testid="name-input"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Name"
            />
            {errors.name && <div data-testid="name-error">{errors.name}</div>}
            
            <input
              data-testid="email-input"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Email"
            />
            {errors.email && <div data-testid="email-error">{errors.email}</div>}
            
            {errors.submit && <div data-testid="submit-error">{errors.submit}</div>}
            
            <button type="submit" data-testid="submit-button">Send</button>
          </form>
        )
      }

      render(<ContactForm />)

      // When: User submits empty form
      await user.click(screen.getByTestId('submit-button'))

      // Then: Validation errors are shown
      await waitFor(() => {
        expect(screen.getByTestId('name-error')).toHaveTextContent('Name is required')
        expect(screen.getByTestId('email-error')).toHaveTextContent('Email is required')
      })

      // And: Form was not submitted
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('should submit successfully when all validation passes', async () => {
      // Given: A form with validation
      const ContactForm = () => {
        const [formData, setFormData] = React.useState({ name: '', email: '' })
        const [submitted, setSubmitted] = React.useState(false)

        const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault()
          
          // Simple validation - in real app this would be more robust
          if (formData.name.trim() && formData.email.includes('@')) {
            await fetch('/api/contact', {
              method: 'POST',
              body: JSON.stringify(formData)
            })
            setSubmitted(true)
          }
        }

        if (submitted) {
          return <div data-testid="success-message">Message sent successfully!</div>
        }

        return (
          <form onSubmit={handleSubmit}>
            <input
              data-testid="name-input"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Name"
            />
            <input
              data-testid="email-input"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Email"
            />
            <button type="submit" data-testid="submit-button">Send</button>
          </form>
        )
      }

      mockFetch({ success: true })
      render(<ContactForm />)

      // When: User fills valid data and submits
      await user.type(screen.getByTestId('name-input'), 'John Doe')
      await user.type(screen.getByTestId('email-input'), 'john@example.com')
      await user.click(screen.getByTestId('submit-button'))

      // Then: Form submits successfully
      await waitFor(() => {
        expect(screen.getByTestId('success-message')).toHaveTextContent('Message sent successfully!')
      })

      expect(global.fetch).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        body: JSON.stringify({ name: 'John Doe', email: 'john@example.com' })
      })
    })

    it('should handle server validation errors gracefully', async () => {
      // Given: A form that can receive server-side validation errors
      const ContactForm = () => {
        const [formData, setFormData] = React.useState({ name: '', email: '' })
        const [serverError, setServerError] = React.useState('')

        const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault()
          setServerError('')
          
          try {
            const response = await fetch('/api/contact', {
              method: 'POST',
              body: JSON.stringify(formData)
            })
            
            if (!response.ok) {
              const error = await response.json()
              setServerError(error.message || 'Submission failed')
            }
          } catch {
            setServerError('Network error - please try again')
          }
        }

        return (
          <form onSubmit={handleSubmit}>
            <input
              data-testid="name-input"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Name"
            />
            <input
              data-testid="email-input"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Email"
            />
            {serverError && <div data-testid="server-error">{serverError}</div>}
            <button type="submit" data-testid="submit-button">Send</button>
          </form>
        )
      }

      render(<ContactForm />)

      // When: User submits form but server returns error
      mockFetch({ message: 'Email address is already registered' }, false, 0, 400)
      
      await user.type(screen.getByTestId('name-input'), 'John')
      await user.type(screen.getByTestId('email-input'), 'john@example.com')
      await user.click(screen.getByTestId('submit-button'))

      // Then: Server error is displayed
      await waitFor(() => {
        expect(screen.getByTestId('server-error')).toHaveTextContent(
          'Email address is already registered'
        )
      })
    })
  })

  describe('Data Integrity Protection', () => {
    it('should reject invalid data to prevent corruption', async () => {
      // Given: A component that validates data before processing
      const DataProcessor = () => {
        const [items, setItems] = React.useState<Array<{id: string, name: string, price: number}>>([])
        const [rejectedCount, setRejectedCount] = React.useState(0)

        const addItem = (item: any) => {
          // Validate data structure
          if (!item.id || !item.name || typeof item.price !== 'number' || item.price <= 0) {
            setRejectedCount(prev => prev + 1)
            return
          }

          // Check for duplicates
          if (items.find(existing => existing.id === item.id)) {
            setRejectedCount(prev => prev + 1)
            return
          }

          setItems(prev => [...prev, item])
        }

        return (
          <div>
            <button 
              data-testid="add-valid-item"
              onClick={() => addItem({ id: 'valid1', name: 'Valid Item', price: 100 })}
            >
              Add Valid Item
            </button>
            <button 
              data-testid="add-invalid-item"
              onClick={() => addItem({ id: '', name: 'Invalid', price: -5 })}
            >
              Add Invalid Item
            </button>
            <button 
              data-testid="add-duplicate-item"
              onClick={() => addItem({ id: 'valid1', name: 'Duplicate', price: 200 })}
            >
              Add Duplicate Item
            </button>
            
            <div data-testid="valid-items-count">Valid items: {items.length}</div>
            <div data-testid="rejected-count">Rejected: {rejectedCount}</div>
          </div>
        )
      }

      render(<DataProcessor />)

      // When: User adds valid item
      await user.click(screen.getByTestId('add-valid-item'))

      // Then: Item is accepted
      expect(screen.getByTestId('valid-items-count')).toHaveTextContent('Valid items: 1')
      expect(screen.getByTestId('rejected-count')).toHaveTextContent('Rejected: 0')

      // When: User tries to add invalid item
      await user.click(screen.getByTestId('add-invalid-item'))

      // Then: Item is rejected
      expect(screen.getByTestId('valid-items-count')).toHaveTextContent('Valid items: 1')
      expect(screen.getByTestId('rejected-count')).toHaveTextContent('Rejected: 1')

      // When: User tries to add duplicate item
      await user.click(screen.getByTestId('add-duplicate-item'))

      // Then: Duplicate is rejected
      expect(screen.getByTestId('valid-items-count')).toHaveTextContent('Valid items: 1')
      expect(screen.getByTestId('rejected-count')).toHaveTextContent('Rejected: 2')
    })
  })
})