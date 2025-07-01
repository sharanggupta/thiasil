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

describe('Form Submission Integration Testing Suite', () => {
  beforeEach(() => {
    clearAllMocks()
  })

  describe('when testing Contact Form submission workflows', () => {
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

    it('should successfully complete end-to-end contact form submission', async () => {
      // Given: Contact form API accepting valid submissions
      mockFetch({ success: true, message: 'Message sent successfully' })

      // When: User loads contact form interface
      render(<ContactFormComponent />)

      // Then: Initial form state is ready for user input
      expect(screen.getByText('Contact Us')).toBeInTheDocument()
      expect(screen.getByTestId('contact-form')).toBeInTheDocument()

      // When: User fills out complete contact information
      const nameField = document.getElementById('field-name') as HTMLInputElement
      const emailField = document.getElementById('field-email') as HTMLInputElement
      const companyField = document.getElementById('field-company') as HTMLInputElement
      const messageField = document.getElementById('field-message') as HTMLTextAreaElement
      
      await user.type(nameField, 'John Doe')
      await user.type(emailField, 'john@example.com')
      await user.type(companyField, 'ACME Corp')
      await user.type(messageField, 'I am interested in your laboratory equipment.')

      // Then: Form captures user input correctly
      expect(nameField.value).toBe('John Doe')
      expect(emailField.value).toBe('john@example.com')
      expect(companyField.value).toBe('ACME Corp')
      expect(messageField.value).toBe('I am interested in your laboratory equipment.')

      // When: User submits completed form
      const submitButton = screen.getByTestId('submit-button')
      await user.click(submitButton)

      // Then: Submission succeeds and shows confirmation
      await waitFor(() => {
        expect(screen.getByTestId('success-message')).toBeInTheDocument()
      })

      // Then: Success message provides clear confirmation to user
      expect(screen.getByText('Thank You!')).toBeInTheDocument()
      expect(screen.getByText('Your message has been sent successfully.')).toBeInTheDocument()

      // Then: API receives correctly formatted contact data
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

      // When: User wants to send another message
      const sendAnotherButton = screen.getByTestId('send-another-button')
      await user.click(sendAnotherButton)

      // Then: Form resets for new message entry
      await waitFor(() => {
        expect(screen.getByTestId('contact-form')).toBeInTheDocument()
      })

      // Then: Form fields are cleared for new input
      const resetNameField = document.getElementById('field-name') as HTMLInputElement
      expect(resetNameField.value).toBe('')
    })

    it('should prevent submission with client-side validation errors', async () => {
      // Given: Empty contact form requiring validation
      render(<ContactFormComponent />)

      // When: User attempts to submit empty form
      const submitButton = screen.getByTestId('submit-button')
      await user.click(submitButton)

      // Then: Client validation prevents API call
      await waitFor(() => {
        expect(global.fetch).not.toHaveBeenCalled()
      })
      
      // Then: Form remains available for user corrections
      expect(screen.getByTestId('contact-form')).toBeInTheDocument()
      expect(global.fetch).not.toHaveBeenCalled()

      // When: User provides invalid email format
      const emailField = document.getElementById('field-email') as HTMLInputElement
      await user.type(emailField, 'invalid-email')
      await user.click(submitButton)

      // Then: Email validation prevents submission
      await waitFor(() => {
        expect(global.fetch).not.toHaveBeenCalled()
      })

      // When: User provides insufficient message content
      const messageField = document.getElementById('field-message') as HTMLTextAreaElement
      await user.clear(messageField)
      await user.type(messageField, 'short')
      await user.click(submitButton)

      // Then: Message length validation prevents submission
      await waitFor(() => {
        expect(global.fetch).not.toHaveBeenCalled()
      })
    })

    it('should display server-side validation errors clearly', async () => {
      // Given: Server returning field-specific validation errors
      mockFetch({
        success: false,
        errors: {
          email: 'Email is already registered',
          message: 'Message contains inappropriate content'
        }
      }, false, 0, 400)

      // When: User submits form with server-rejected data
      render(<ContactFormComponent />)

      const nameField = document.getElementById('field-name') as HTMLInputElement
      const emailField = document.getElementById('field-email') as HTMLInputElement
      const messageField = document.getElementById('field-message') as HTMLTextAreaElement
      await user.type(nameField, 'John Doe')
      await user.type(emailField, 'existing@example.com')
      await user.type(messageField, 'This message has issues')

      await user.click(screen.getByTestId('submit-button'))

      // Then: Server validation errors are displayed on relevant fields
      await waitFor(() => {
        const emailField = document.getElementById('field-email') as HTMLInputElement
        const messageField = document.getElementById('field-message') as HTMLTextAreaElement
        expect(emailField.parentElement?.querySelector('.text-red-300')).toBeInTheDocument()
        expect(messageField.parentElement?.querySelector('.text-red-300')).toBeInTheDocument()
      })

      // Then: Form remains available for user corrections
      expect(screen.getByTestId('contact-form')).toBeInTheDocument()
    })

    it('should provide helpful feedback for network connectivity issues', async () => {
      // Given: Network connectivity problems preventing submission
      simulateNetworkError()

      // When: User submits form during network issues
      render(<ContactFormComponent />)

      const nameField = document.getElementById('field-name') as HTMLInputElement
      const emailField = document.getElementById('field-email') as HTMLInputElement
      const messageField = document.getElementById('field-message') as HTMLTextAreaElement
      await user.type(nameField, 'John Doe')
      await user.type(emailField, 'john@example.com')
      await user.type(messageField, 'Test message content')

      await user.click(screen.getByTestId('submit-button'))

      // Then: Network error message guides user to retry
      await waitFor(() => {
        expect(screen.getByTestId('submit-error')).toBeInTheDocument()
      })

      // Then: Clear error message helps user understand connectivity issue
      expect(screen.getByText('Network error. Please try again.')).toBeInTheDocument()

      // Then: Form data is preserved for retry without re-entry
      expect(nameField.value).toBe('John Doe')
      expect(emailField.value).toBe('john@example.com')
    })

    it('should demonstrate complete validation workflow progression', async () => {
      // Given: Contact form requiring progressive validation testing
      render(<ContactFormComponent />)

      // When: Empty form submission is attempted
      await user.click(screen.getByTestId('submit-button'))
      
      // Then: Empty form validation prevents submission
      await waitFor(() => {
        expect(global.fetch).not.toHaveBeenCalled()
      })
      
      // When: Partial valid input with invalid email is submitted
      const nameField = document.getElementById('field-name') as HTMLInputElement
      const emailField = document.getElementById('field-email') as HTMLInputElement
      
      await user.type(nameField, 'John Doe')
      await user.type(emailField, 'invalid-email')
      
      await user.click(screen.getByTestId('submit-button'))
      
      // Then: Invalid email validation prevents submission
      await waitFor(() => {
        expect(global.fetch).not.toHaveBeenCalled()
      })
      
      // When: Complete valid form data is provided
      await user.clear(emailField)
      await user.type(emailField, 'john@example.com')
      
      const messageField = document.getElementById('field-message') as HTMLTextAreaElement
      await user.type(messageField, 'This is a valid message with enough characters.')
      
      mockFetch({ success: true, message: 'Message sent successfully' })
      
      await user.click(screen.getByTestId('submit-button'))
      
      // Then: Valid form successfully submits to API
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
      
      // Then: Success confirmation is displayed to user
      await waitFor(() => {
        expect(screen.getByTestId('success-message')).toBeInTheDocument()
      })
    })
  })

  describe('when testing Admin Product Form complex data workflows', () => {
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

    it('should handle complex product creation with dynamic feature management', async () => {
      // Given: Admin API accepting new product submissions
      mockFetch({ success: true, product: { id: 'new-product-001' } })

      // When: Admin user creates new product with complete information
      render(<ProductFormComponent />)

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

      // When: Admin manages dynamic product features
      const firstFeatureInput = screen.getByTestId('feature-input-0')
      await user.type(firstFeatureInput, 'Borosilicate glass')

      const addFeatureButton = screen.getByTestId('add-feature-button')
      await user.click(addFeatureButton)

      // Then: Dynamic feature inputs are created correctly
      expect(screen.getByTestId('feature-input-1')).toBeInTheDocument()
      expect(screen.getByTestId('remove-feature-1')).toBeInTheDocument()

      await user.type(screen.getByTestId('feature-input-1'), 'Graduated markings')

      await user.click(addFeatureButton)
      await user.type(screen.getByTestId('feature-input-2'), 'Heat resistant')

      // When: Admin removes middle feature to test array management
      await user.click(screen.getByTestId('remove-feature-1'))

      // Then: Feature removal correctly updates array indices
      await waitFor(() => {
        expect(screen.queryByTestId('feature-input-2')).not.toBeInTheDocument()
      })

      // When: Admin submits complete product form
      await user.click(screen.getByTestId('submit-product-button'))

      // Then: Product creation succeeds with confirmation
      await waitFor(() => {
        expect(screen.getByTestId('success-alert')).toBeInTheDocument()
      })

      // Then: Success message confirms product was added
      expect(screen.getByText('Product added successfully!')).toBeInTheDocument()

      // Then: API receives correctly structured product data
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
          features: ['Borosilicate glass', 'Heat resistant'] // Dynamic array with removed feature
        })
      })

      // Then: Form resets for next product entry
      const resetNameField = document.getElementById('field-name') as HTMLInputElement
      expect(resetNameField.value).toBe('')
    })

    it('should handle complex business rule validation from server', async () => {
      // Given: Server enforcing business rules on product data
      mockFetch({
        success: false,
        errors: {
          catNo: 'Catalog number already exists',
          price: 'Price must be positive'
        }
      }, false, 0, 400)

      // When: Admin submits product data violating business rules
      render(<ProductFormComponent />)

      const nameField = document.getElementById('field-name') as HTMLInputElement
      const catNoField = document.getElementById('field-catNo') as HTMLInputElement
      const categoryField = document.getElementById('field-category') as HTMLSelectElement
      const priceField = document.getElementById('field-price') as HTMLInputElement
      
      await user.type(nameField, 'Duplicate Product')
      await user.type(catNoField, 'EXISTING001') // Duplicate catalog number
      await user.selectOptions(categoryField, 'beakers')
      await user.type(priceField, '-50') // Invalid negative price

      await user.click(screen.getByTestId('submit-product-button'))

      // Then: Server validation errors are displayed on problematic fields
      await waitFor(() => {
        const catNoField = document.getElementById('field-catNo') as HTMLInputElement
        const priceField = document.getElementById('field-price') as HTMLInputElement
        expect(catNoField.parentElement?.querySelector('.text-red-300')).toBeInTheDocument()
        expect(priceField.parentElement?.querySelector('.text-red-300')).toBeInTheDocument()
      })

      // Then: Form data is preserved for admin to make corrections
      const preservedNameField = document.getElementById('field-name') as HTMLInputElement
      const preservedCatNoField = document.getElementById('field-catNo') as HTMLInputElement
      expect(preservedNameField.value).toBe('Duplicate Product')
      expect(preservedCatNoField.value).toBe('EXISTING001')
    })
  })
})