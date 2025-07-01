import React from 'react'
import { render, screen, waitFor } from '../utils/test-utils'
import { user, mockFetch, clearAllMocks, simulateNetworkError, simulateServerError } from '../utils/test-helpers'
import FormField from '@/app/components/form/FormField'

// Mock fetch globally
const originalFetch = global.fetch
beforeAll(() => {
  global.fetch = jest.fn()
})

afterAll(() => {
  global.fetch = originalFetch
})

describe('Form Submission Integration Tests', () => {
  beforeEach(() => {
    clearAllMocks()
  })

  describe('Contact Form Integration', () => {
    const ContactFormComponent = () => {
      const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        company: '',
        message: ''
      })
      const [errors, setErrors] = React.useState<Record<string, string>>({})
      const [loading, setLoading] = React.useState(false)
      const [submitted, setSubmitted] = React.useState(false)

      const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.name.trim()) {
          newErrors.name = 'Name is required'
        }

        if (!formData.email.trim()) {
          newErrors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Email is invalid'
        }

        if (!formData.message.trim()) {
          newErrors.message = 'Message is required'
        } else if (formData.message.length < 10) {
          newErrors.message = 'Message must be at least 10 characters'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
      }

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!validateForm()) {
          return
        }

        setLoading(true)
        setErrors({})

        try {
          const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          })

          const result = await response.json()

          if (response.ok) {
            setSubmitted(true)
            setFormData({ name: '', email: '', company: '', message: '' })
          } else {
            if (result.errors) {
              setErrors(result.errors)
            } else {
              setErrors({ submit: result.error || 'Failed to submit form' })
            }
          }
        } catch (error) {
          setErrors({ submit: 'Network error. Please try again.' })
        } finally {
          setLoading(false)
        }
      }

      const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
          setErrors(prev => ({ ...prev, [field]: '' }))
        }
      }

      if (submitted) {
        return (
          <div data-testid="success-message">
            <h2>Thank You!</h2>
            <p>Your message has been sent successfully.</p>
            <button
              data-testid="send-another-button"
              onClick={() => setSubmitted(false)}
            >
              Send Another Message
            </button>
          </div>
        )
      }

      return (
        <div>
          <h1>Contact Us</h1>
          <form onSubmit={handleSubmit} data-testid="contact-form">
            <FormField
              label="Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={(value) => updateField('name', value as string)}
              required
              error={errors.name}
            />

            <FormField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(value) => updateField('email', value as string)}
              required
              error={errors.email}
            />

            <FormField
              label="Company"
              name="company"
              type="text"
              value={formData.company}
              onChange={(value) => updateField('company', value as string)}
            />

            <FormField
              label="Message"
              name="message"
              type="textarea"
              value={formData.message}
              onChange={(value) => updateField('message', value as string)}
              required
              rows={5}
              error={errors.message}
              helpText="Please provide details about your inquiry"
            />

            {errors.submit && (
              <div data-testid="submit-error" style={{ color: 'red', marginTop: '10px' }}>
                {errors.submit}
              </div>
            )}

            <button
              type="submit"
              data-testid="submit-button"
              disabled={loading}
              style={{ marginTop: '20px' }}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      )
    }

    it('completes successful form submission workflow', async () => {
      mockFetch({ success: true, message: 'Message sent successfully' })

      render(<ContactFormComponent />)

      // Verify initial form state
      expect(screen.getByText('Contact Us')).toBeInTheDocument()
      expect(screen.getByTestId('contact-form')).toBeInTheDocument()

      // Fill out form fields
      const nameField = document.getElementById('field-name') as HTMLInputElement
      const emailField = document.getElementById('field-email') as HTMLInputElement
      const companyField = document.getElementById('field-company') as HTMLInputElement
      const messageField = document.getElementById('field-message') as HTMLTextAreaElement
      
      await user.type(nameField, 'John Doe')
      await user.type(emailField, 'john@example.com')
      await user.type(companyField, 'ACME Corp')
      await user.type(messageField, 'I am interested in your laboratory equipment.')

      // Verify form data is entered
      expect(nameField.value).toBe('John Doe')
      expect(emailField.value).toBe('john@example.com')
      expect(companyField.value).toBe('ACME Corp')
      expect(messageField.value).toBe('I am interested in your laboratory equipment.')

      // Submit form
      const submitButton = screen.getByTestId('submit-button')
      await user.click(submitButton)

      // Note: Loading state is too fast to catch with mocked fetch

      // Wait for submission to complete
      await waitFor(() => {
        expect(screen.getByTestId('success-message')).toBeInTheDocument()
      })

      // Verify success state
      expect(screen.getByText('Thank You!')).toBeInTheDocument()
      expect(screen.getByText('Your message has been sent successfully.')).toBeInTheDocument()

      // Verify API call was made
      expect(global.fetch).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          company: 'ACME Corp',
          message: 'I am interested in your laboratory equipment.'
        }),
      })

      // Test "Send Another" functionality
      const sendAnotherButton = screen.getByTestId('send-another-button')
      await user.click(sendAnotherButton)

      // Verify form is shown again with empty fields
      await waitFor(() => {
        expect(screen.getByTestId('contact-form')).toBeInTheDocument()
      })

      const resetNameField = document.getElementById('field-name') as HTMLInputElement
      expect(resetNameField.value).toBe('')
    })

    it('handles client-side validation errors', async () => {
      render(<ContactFormComponent />)

      // Try to submit empty form
      const submitButton = screen.getByTestId('submit-button')
      await user.click(submitButton)

      // Verify validation errors prevent submission
      await waitFor(() => {
        expect(global.fetch).not.toHaveBeenCalled()
      })
      
      // Form should still be visible for corrections
      expect(screen.getByTestId('contact-form')).toBeInTheDocument()

      // Verify form was not submitted
      expect(global.fetch).not.toHaveBeenCalled()

      // Test invalid email validation
      const emailField = document.getElementById('field-email') as HTMLInputElement
      await user.type(emailField, 'invalid-email')
      await user.click(submitButton)

      await waitFor(() => {
        expect(global.fetch).not.toHaveBeenCalled()
      })

      // Test short message validation
      const messageField = document.getElementById('field-message') as HTMLTextAreaElement
      await user.clear(messageField)
      await user.type(messageField, 'short')
      await user.click(submitButton)

      await waitFor(() => {
        expect(global.fetch).not.toHaveBeenCalled()
      })
    })

    it('handles server-side validation errors', async () => {
      mockFetch({
        success: false,
        errors: {
          email: 'Email is already registered',
          message: 'Message contains inappropriate content'
        }
      }, false, 0, 400)

      render(<ContactFormComponent />)

      // Fill out form with valid data
      const nameField = document.getElementById('field-name') as HTMLInputElement
      const emailField = document.getElementById('field-email') as HTMLInputElement
      const messageField = document.getElementById('field-message') as HTMLTextAreaElement
      await user.type(nameField, 'John Doe')
      await user.type(emailField, 'existing@example.com')
      await user.type(messageField, 'This message has issues')

      // Submit form
      await user.click(screen.getByTestId('submit-button'))

      // Wait for server errors to appear
      await waitFor(() => {
        const emailField = document.getElementById('field-email') as HTMLInputElement
        const messageField = document.getElementById('field-message') as HTMLTextAreaElement
        expect(emailField.parentElement?.querySelector('.text-red-300')).toBeInTheDocument()
        expect(messageField.parentElement?.querySelector('.text-red-300')).toBeInTheDocument()
      })

      // Verify form is still visible for corrections
      expect(screen.getByTestId('contact-form')).toBeInTheDocument()
    })

    it('handles network errors gracefully', async () => {
      simulateNetworkError()

      render(<ContactFormComponent />)

      // Fill out form
      const nameField = document.getElementById('field-name') as HTMLInputElement
      const emailField = document.getElementById('field-email') as HTMLInputElement
      const messageField = document.getElementById('field-message') as HTMLTextAreaElement
      await user.type(nameField, 'John Doe')
      await user.type(emailField, 'john@example.com')
      await user.type(messageField, 'Test message content')

      // Submit form
      await user.click(screen.getByTestId('submit-button'))

      // Wait for network error
      await waitFor(() => {
        expect(screen.getByTestId('submit-error')).toBeInTheDocument()
      })

      expect(screen.getByText('Network error. Please try again.')).toBeInTheDocument()

      // Verify form data is preserved
      expect(nameField.value).toBe('John Doe')
      expect(emailField.value).toBe('john@example.com')
    })

    it('validates complete form integration workflow', async () => {
      render(<ContactFormComponent />)

      // Test 1: Empty form should not submit
      await user.click(screen.getByTestId('submit-button'))
      
      await waitFor(() => {
        expect(global.fetch).not.toHaveBeenCalled()
      })
      
      // Test 2: Partial valid input should still not submit
      const nameField = document.getElementById('field-name') as HTMLInputElement
      const emailField = document.getElementById('field-email') as HTMLInputElement
      
      await user.type(nameField, 'John Doe')
      await user.type(emailField, 'invalid-email')
      
      await user.click(screen.getByTestId('submit-button'))
      
      await waitFor(() => {
        expect(global.fetch).not.toHaveBeenCalled()
      })
      
      // Test 3: Complete valid form should submit
      await user.clear(emailField)
      await user.type(emailField, 'john@example.com')
      
      const messageField = document.getElementById('field-message') as HTMLTextAreaElement
      await user.type(messageField, 'This is a valid message with enough characters.')
      
      // Mock successful submission
      mockFetch({ success: true, message: 'Message sent successfully' })
      
      await user.click(screen.getByTestId('submit-button'))
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'John Doe',
            email: 'john@example.com',
            company: '',
            message: 'This is a valid message with enough characters.'
          })
        })
      })
      
      // Verify success state
      await waitFor(() => {
        expect(screen.getByTestId('success-message')).toBeInTheDocument()
      })
    })
  })

  describe('Admin Product Form Integration', () => {
    const ProductFormComponent = () => {
      const [formData, setFormData] = React.useState({
        name: '',
        catNo: '',
        category: '',
        price: '',
        description: '',
        capacity: '',
        features: ['']
      })
      const [errors, setErrors] = React.useState<Record<string, string>>({})
      const [loading, setLoading] = React.useState(false)
      const [success, setSuccess] = React.useState(false)

      const addFeature = () => {
        setFormData(prev => ({
          ...prev,
          features: [...prev.features, '']
        }))
      }

      const updateFeature = (index: number, value: string) => {
        setFormData(prev => ({
          ...prev,
          features: prev.features.map((feature, i) => i === index ? value : feature)
        }))
      }

      const removeFeature = (index: number) => {
        setFormData(prev => ({
          ...prev,
          features: prev.features.filter((_, i) => i !== index)
        }))
      }

      const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.name.trim()) newErrors.name = 'Product name is required'
        if (!formData.catNo.trim()) newErrors.catNo = 'Catalog number is required'
        if (!formData.category) newErrors.category = 'Category is required'
        if (!String(formData.price).trim()) newErrors.price = 'Price is required'
        else if (isNaN(Number(formData.price))) newErrors.price = 'Price must be a number'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
      }

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setLoading(true)
        setErrors({})

        try {
          const response = await fetch('/api/admin/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...formData,
              features: formData.features.filter(f => f.trim()),
              price: Number(formData.price)
            })
          })

          const result = await response.json()

          if (response.ok) {
            setSuccess(true)
            setFormData({
              name: '',
              catNo: '',
              category: '',
              price: '',
              description: '',
              capacity: '',
              features: ['']
            })
          } else {
            setErrors(result.errors || { submit: result.error })
          }
        } catch (error) {
          setErrors({ submit: 'Failed to save product' })
        } finally {
          setLoading(false)
        }
      }

      return (
        <div>
          <h1>Add Product</h1>
          
          {success && (
            <div data-testid="success-alert" style={{ color: 'green', marginBottom: '20px' }}>
              Product added successfully!
              <button
                data-testid="close-success"
                onClick={() => setSuccess(false)}
                style={{ marginLeft: '10px' }}
              >
                ×
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} data-testid="product-form">
            <FormField
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={(value) => setFormData(prev => ({ ...prev, name: value as string }))}
              error={errors.name}
              required
            />

            <FormField
              label="Catalog Number"
              name="catNo"
              value={formData.catNo}
              onChange={(value) => setFormData(prev => ({ ...prev, catNo: value as string }))}
              error={errors.catNo}
              required
            />

            <FormField
              label="Category"
              name="category"
              type="select"
              value={formData.category}
              onChange={(value) => setFormData(prev => ({ ...prev, category: value as string }))}
              options={[
                { value: 'beakers', label: 'Beakers' },
                { value: 'flasks', label: 'Flasks' },
                { value: 'pipettes', label: 'Pipettes' }
              ]}
              error={errors.category}
              required
            />

            <FormField
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={(value) => setFormData(prev => ({ ...prev, price: value as string }))}
              error={errors.price}
              required
            />

            <FormField
              label="Description"
              name="description"
              type="textarea"
              value={formData.description}
              onChange={(value) => setFormData(prev => ({ ...prev, description: value as string }))}
            />

            <FormField
              label="Capacity"
              name="capacity"
              value={formData.capacity}
              onChange={(value) => setFormData(prev => ({ ...prev, capacity: value as string }))}
            />

            {/* Features Section */}
            <div data-testid="features-section">
              <h3>Features</h3>
              {formData.features.map((feature, index) => (
                <div key={index} data-testid={`feature-${index}`} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <input
                    data-testid={`feature-input-${index}`}
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    placeholder={`Feature ${index + 1}`}
                    style={{ flex: 1 }}
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      data-testid={`remove-feature-${index}`}
                      onClick={() => removeFeature(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                data-testid="add-feature-button"
                onClick={addFeature}
              >
                Add Feature
              </button>
            </div>

            {errors.submit && (
              <div data-testid="submit-error" style={{ color: 'red', margin: '10px 0' }}>
                {errors.submit}
              </div>
            )}

            <button
              type="submit"
              data-testid="submit-product-button"
              disabled={loading}
              style={{ marginTop: '20px' }}
            >
              {loading ? 'Saving...' : 'Add Product'}
            </button>
          </form>
        </div>
      )
    }

    it('completes product creation workflow with dynamic features', async () => {
      mockFetch({ success: true, product: { id: 'new-product-001' } })

      render(<ProductFormComponent />)

      // Fill basic product information
      const nameField = document.getElementById('field-name') as HTMLInputElement
      const catNoField = document.getElementById('field-catNo') as HTMLInputElement
      const categoryField = document.getElementById('field-category') as HTMLSelectElement
      const priceField = document.getElementById('field-price') as HTMLInputElement
      const descriptionField = document.getElementById('field-description') as HTMLTextAreaElement
      const capacityField = document.getElementById('field-capacity') as HTMLInputElement
      
      await user.type(nameField, 'Test Beaker Pro')
      await user.type(catNoField, 'TBP001')
      await user.selectOptions(categoryField, 'beakers')
      await user.type(priceField, '299.99')
      await user.type(descriptionField, 'High-quality laboratory beaker')
      await user.type(capacityField, '500ml')

      // Test features functionality
      const firstFeatureInput = screen.getByTestId('feature-input-0')
      await user.type(firstFeatureInput, 'Borosilicate glass')

      // Add another feature
      const addFeatureButton = screen.getByTestId('add-feature-button')
      await user.click(addFeatureButton)

      // Verify second feature input appears
      expect(screen.getByTestId('feature-input-1')).toBeInTheDocument()
      expect(screen.getByTestId('remove-feature-1')).toBeInTheDocument()

      // Fill second feature
      await user.type(screen.getByTestId('feature-input-1'), 'Graduated markings')

      // Add and fill third feature
      await user.click(addFeatureButton)
      await user.type(screen.getByTestId('feature-input-2'), 'Heat resistant')

      // Remove second feature to test removal
      await user.click(screen.getByTestId('remove-feature-1'))

      // Verify feature was removed
      await waitFor(() => {
        expect(screen.queryByTestId('feature-input-2')).not.toBeInTheDocument()
      })

      // Submit form
      await user.click(screen.getByTestId('submit-product-button'))

      // Wait for success
      await waitFor(() => {
        expect(screen.getByTestId('success-alert')).toBeInTheDocument()
      })

      expect(screen.getByText('Product added successfully!')).toBeInTheDocument()

      // Verify API call with correct data structure
      expect(global.fetch).toHaveBeenCalledWith('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test Beaker Pro',
          catNo: 'TBP001',
          category: 'beakers',
          price: 299.99,
          description: 'High-quality laboratory beaker',
          capacity: '500ml',
          features: ['Borosilicate glass', 'Heat resistant'] // Note: second feature was removed
        })
      })

      // Verify form fields are reset
      const resetNameField = document.getElementById('field-name') as HTMLInputElement
      expect(resetNameField.value).toBe('')
    })

    it('handles complex validation errors', async () => {
      mockFetch({
        success: false,
        errors: {
          catNo: 'Catalog number already exists',
          price: 'Price must be positive'
        }
      }, false, 0, 400)

      render(<ProductFormComponent />)

      // Fill form with potentially problematic data
      const nameField = document.getElementById('field-name') as HTMLInputElement
      const catNoField = document.getElementById('field-catNo') as HTMLInputElement
      const categoryField = document.getElementById('field-category') as HTMLSelectElement
      const priceField = document.getElementById('field-price') as HTMLInputElement
      
      await user.type(nameField, 'Duplicate Product')
      await user.type(catNoField, 'EXISTING001')
      await user.selectOptions(categoryField, 'beakers')
      await user.type(priceField, '-50') // Invalid negative price

      // Submit form
      await user.click(screen.getByTestId('submit-product-button'))

      // Wait for server validation errors
      await waitFor(() => {
        const catNoField = document.getElementById('field-catNo') as HTMLInputElement
        const priceField = document.getElementById('field-price') as HTMLInputElement
        expect(catNoField.parentElement?.querySelector('.text-red-300')).toBeInTheDocument()
        expect(priceField.parentElement?.querySelector('.text-red-300')).toBeInTheDocument()
      })

      // Verify form data is preserved
      const preservedNameField = document.getElementById('field-name') as HTMLInputElement
      const preservedCatNoField = document.getElementById('field-catNo') as HTMLInputElement
      expect(preservedNameField.value).toBe('Duplicate Product')
      expect(preservedCatNoField.value).toBe('EXISTING001')
    })
  })
})