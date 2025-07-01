import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import FormField from '../FormField'

// Mock the GlassInput component
jest.mock('@/app/components/Glassmorphism', () => ({
  GlassInput: ({ 
    id, 
    name, 
    type, 
    value, 
    onChange, 
    placeholder, 
    required, 
    disabled, 
    maxLength, 
    min, 
    max, 
    step, 
    className 
  }: any) => (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      maxLength={maxLength}
      min={min}
      max={max}
      step={step}
      className={`glass-input ${className || ''}`}
    />
  )
}))

describe('FormField Component', () => {
  const defaultProps = {
    label: 'Test Field',
    name: 'testField',
    value: '',
    onChange: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('when rendering basic form field structure', () => {
    it('should create accessible text input with proper label association', () => {
      // Given: Form requiring text input for user data collection
      
      // When: FormField renders with text input configuration
      render(<FormField {...defaultProps} />)
      
      // Then: Input is accessible through label and available for interaction
      expect(screen.getByLabelText('Test Field')).toBeInTheDocument()
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('should display field label with proper semantic markup', () => {
      // Given: Form field requiring descriptive label for user guidance
      
      // When: FormField renders with label text
      render(<FormField {...defaultProps} />)
      
      // Then: Label uses correct semantic element for accessibility
      const label = screen.getByText('Test Field')
      expect(label).toBeInTheDocument()
      expect(label.tagName).toBe('LABEL')
    })

    it('should establish proper label-input relationship for screen readers', () => {
      // Given: Form field requiring accessible label association
      
      // When: FormField renders with label and input
      render(<FormField {...defaultProps} />)
      
      // Then: Input is programmatically associated with label via ID
      const input = screen.getByRole('textbox')
      const label = screen.getByLabelText('Test Field')
      
      expect(input).toBe(label)
      expect(input).toHaveAttribute('id', 'field-testField')
    })

    it('should accept and apply custom CSS classes for specialized styling', () => {
      // Given: FormField requiring custom styling for specific design context
      
      // When: Component renders with custom className
      const { container } = render(<FormField {...defaultProps} className="custom-field" />)
      
      // Then: Custom class is applied alongside default form field classes
      expect(container.firstChild).toHaveClass('form-field', 'custom-field')
    })
  })

  describe('when rendering different input types for various data collection', () => {
    it('should create number input with spinner controls for numeric data', () => {
      // Given: Form requiring numeric input with value validation
      
      // When: FormField renders as number input type
      render(<FormField {...defaultProps} type="number" value={42} />)
      
      // Then: Number input provides appropriate controls and validation
      const input = screen.getByRole('spinbutton')
      expect(input).toHaveAttribute('type', 'number')
      expect(input).toHaveValue(42)
    })

    it('should create email input with built-in validation for email addresses', () => {
      // Given: Form requiring email address with validation
      
      // When: FormField renders as email input type
      render(<FormField {...defaultProps} type="email" placeholder="Enter email" />)
      
      // Then: Email input provides browser validation and appropriate keyboard
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'email')
      expect(input).toHaveAttribute('placeholder', 'Enter email')
    })

    it('should create password input with masked text for secure data entry', () => {
      // Given: Form requiring secure password input
      
      // When: FormField renders as password input type
      render(<FormField {...defaultProps} type="password" />)
      
      // Then: Password input masks characters for security
      const input = screen.getByLabelText('Test Field')
      expect(input).toHaveAttribute('type', 'password')
    })

    it('should create textarea for multi-line text input with configurable size', () => {
      // Given: Form requiring multi-line text input with specific dimensions
      
      // When: FormField renders as textarea with row configuration
      render(<FormField {...defaultProps} type="textarea" rows={5} />)
      
      // Then: Textarea provides multi-line editing with specified height
      const textarea = screen.getByRole('textbox')
      expect(textarea.tagName).toBe('TEXTAREA')
      expect(textarea).toHaveAttribute('rows', '5')
    })

    it('should create select dropdown for choosing from predefined options', () => {
      // Given: Form requiring selection from predefined choices
      const options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' }
      ]
      
      // When: FormField renders as select dropdown
      render(<FormField {...defaultProps} type="select" options={options} />)
      
      // Then: Select dropdown presents all available options
      const select = screen.getByRole('combobox')
      expect(select.tagName).toBe('SELECT')
      expect(screen.getByText('Option 1')).toBeInTheDocument()
      expect(screen.getByText('Option 2')).toBeInTheDocument()
    })
  })

  describe('when applying input attributes for validation and user guidance', () => {
    it('should mark required fields with visual indicator and validation attribute', () => {
      // Given: Form field requiring mandatory user input
      
      // When: FormField renders with required attribute
      render(<FormField {...defaultProps} required />)
      
      // Then: Required validation is enforced and visually indicated
      const input = screen.getByRole('textbox')
      const requiredIndicator = screen.getByText('*')
      
      expect(input).toHaveAttribute('required')
      expect(requiredIndicator).toBeInTheDocument()
      expect(requiredIndicator).toHaveClass('text-red-400')
    })

    it('should disable field interaction when field is marked as disabled', () => {
      // Given: Form field that should not accept user input
      
      // When: FormField renders with disabled attribute
      render(<FormField {...defaultProps} disabled />)
      
      // Then: Input is non-interactive and visually indicates disabled state
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('disabled')
    })

    it('should provide helpful placeholder text for user guidance', () => {
      // Given: Form field requiring user guidance for expected input format
      
      // When: FormField renders with placeholder text
      render(<FormField {...defaultProps} placeholder="Enter value here" />)
      
      // Then: Placeholder provides clear guidance for expected input
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('placeholder', 'Enter value here')
    })

    it('should enforce maximum input length for data validation', () => {
      // Given: Form field requiring input length restrictions
      
      // When: FormField renders with maxLength constraint
      render(<FormField {...defaultProps} maxLength={100} />)
      
      // Then: Input enforces maximum character limit
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('maxLength', '100')
    })

    it('should configure numeric input constraints for value validation', () => {
      // Given: Numeric input requiring specific range and increment constraints
      
      // When: FormField renders with numeric validation attributes
      render(<FormField {...defaultProps} type="number" min={0} max={100} step={5} />)
      
      // Then: Numeric constraints are enforced for valid data entry
      const input = screen.getByRole('spinbutton')
      expect(input).toHaveAttribute('min', '0')
      expect(input).toHaveAttribute('max', '100')
      expect(input).toHaveAttribute('step', '5')
    })
  })

  describe('when adapting field size for different interface contexts', () => {
    it('should apply compact sizing for space-constrained interfaces', () => {
      // Given: Textarea in compact interface requiring minimal space usage
      
      // When: FormField renders textarea with small size
      render(<FormField {...defaultProps} type="textarea" size="small" />)
      
      // Then: Compact padding and text size optimize space usage
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveClass('px-3', 'py-1', 'text-sm')
    })

    it('should apply balanced sizing for standard form interfaces', () => {
      // Given: Textarea in standard form layout requiring balanced proportions
      
      // When: FormField renders textarea with default medium size
      render(<FormField {...defaultProps} type="textarea" />)
      
      // Then: Medium sizing provides good readability and interaction area
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveClass('px-4', 'py-2', 'text-base')
    })

    it('should apply generous sizing for prominent form interfaces', () => {
      // Given: Textarea in prominent form requiring easy interaction
      
      // When: FormField renders textarea with large size
      render(<FormField {...defaultProps} type="textarea" size="large" />)
      
      // Then: Large sizing provides comfortable interaction and readability
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveClass('px-5', 'py-3', 'text-lg')
    })
  })

  describe('when displaying validation errors to guide user correction', () => {
    it('should prominently display error messages for immediate user attention', () => {
      // Given: Form field with validation error requiring user correction
      
      // When: FormField renders with error message
      render(<FormField {...defaultProps} error="This field is required" />)
      
      // Then: Error message is displayed with appropriate visual emphasis
      const errorMessage = screen.getByText('This field is required')
      expect(errorMessage).toBeInTheDocument()
      expect(errorMessage.parentElement).toHaveClass('text-red-300')
    })

    it('should apply error styling to field label for visual error association', () => {
      // Given: Form field in error state requiring visual indication
      
      // When: FormField renders with error
      render(<FormField {...defaultProps} error="This field is required" />)
      
      // Then: Label styling indicates error state for user awareness
      const label = screen.getByText('Test Field')
      expect(label).toHaveClass('text-red-300')
    })

    it('should include error icon to reinforce error state visually', () => {
      // Given: Form field error requiring clear visual indication
      
      // When: FormField renders with error message
      render(<FormField {...defaultProps} error="This field is required" />)
      
      // Then: Error icon provides additional visual cue for error state
      const errorContainer = screen.getByText('This field is required').parentElement
      const errorIcon = errorContainer?.querySelector('svg')
      
      expect(errorIcon).toBeInTheDocument()
    })

    it('should prioritize error messages over help text for user focus', () => {
      // Given: Form field with both error and help text
      
      // When: FormField renders in error state with help text
      render(
        <FormField 
          {...defaultProps} 
          error="This field is required" 
          helpText="This is help text" 
        />
      )
      
      // Then: Error message takes priority over help text for user attention
      expect(screen.getByText('This field is required')).toBeInTheDocument()
      expect(screen.queryByText('This is help text')).not.toBeInTheDocument()
    })
  })

  describe('when providing helpful guidance to users', () => {
    it('should display help text with subtle styling for user guidance', () => {
      // Given: Form field requiring additional context or guidance
      
      // When: FormField renders with help text
      render(<FormField {...defaultProps} helpText="This is helpful information" />)
      
      // Then: Help text provides guidance with appropriate visual hierarchy
      const helpText = screen.getByText('This is helpful information')
      expect(helpText).toBeInTheDocument()
      expect(helpText).toHaveClass('text-white/60')
    })

    it('should hide help text when error messages require user attention', () => {
      // Given: Form field with both error and help text competing for attention
      
      // When: FormField renders in error state
      render(
        <FormField 
          {...defaultProps} 
          error="Error message" 
          helpText="Help text" 
        />
      )
      
      // Then: Error message takes precedence over help text
      expect(screen.queryByText('Help text')).not.toBeInTheDocument()
    })
  })

  describe('when handling user input and value changes', () => {
    it('should capture and communicate text input changes to parent component', () => {
      // Given: Text input requiring real-time value updates
      const onChange = jest.fn()
      
      // When: User types in text field
      render(<FormField {...defaultProps} onChange={onChange} />)
      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: 'test value' } })
      
      // Then: Change handler receives updated text value
      expect(onChange).toHaveBeenCalledWith('test value')
    })

    it('should convert numeric input strings to numbers for data consistency', () => {
      // Given: Numeric input requiring proper data type handling
      const onChange = jest.fn()
      
      // When: User enters numeric value
      render(<FormField {...defaultProps} type="number" onChange={onChange} />)
      const input = screen.getByRole('spinbutton')
      fireEvent.change(input, { target: { value: '123' } })
      
      // Then: Change handler receives numeric value instead of string
      expect(onChange).toHaveBeenCalledWith(123)
    })

    it('should handle empty numeric input by preserving empty state', () => {
      // Given: Numeric input that user clears completely
      const onChange = jest.fn()
      
      // When: User clears numeric field
      render(<FormField {...defaultProps} type="number" value={123} onChange={onChange} />)
      const input = screen.getByRole('spinbutton')
      fireEvent.change(input, { target: { value: '' } })
      
      // Then: Empty state is preserved for proper form validation
      expect(onChange).toHaveBeenCalledWith('')
    })

    it('should handle multi-line text input preserving line breaks', () => {
      // Given: Textarea requiring multi-line text with formatting
      const onChange = jest.fn()
      
      // When: User enters multi-line text
      render(<FormField {...defaultProps} type="textarea" onChange={onChange} />)
      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: 'multiline\ntext' } })
      
      // Then: Line breaks and formatting are preserved
      expect(onChange).toHaveBeenCalledWith('multiline\ntext')
    })

    it('should communicate dropdown selection changes with selected value', () => {
      // Given: Select dropdown requiring selection tracking
      const onChange = jest.fn()
      const options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' }
      ]
      
      // When: User selects different option
      render(<FormField {...defaultProps} type="select" options={options} onChange={onChange} />)
      const select = screen.getByRole('combobox')
      fireEvent.change(select, { target: { value: 'option2' } })
      
      // Then: Change handler receives selected option value
      expect(onChange).toHaveBeenCalledWith('option2')
    })
  })

  describe('when implementing dropdown selection functionality', () => {
    const options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' }
    ]

    it('should provide default selection prompt for optional dropdown fields', () => {
      // Given: Optional dropdown where user may choose not to select
      
      // When: FormField renders non-required select
      render(<FormField {...defaultProps} type="select" options={options} />)
      
      // Then: Default prompt guides user that selection is optional
      expect(screen.getByText('Select an option')).toBeInTheDocument()
    })

    it('should omit default prompt for required dropdown fields', () => {
      // Given: Required dropdown where user must make selection
      
      // When: FormField renders required select
      render(<FormField {...defaultProps} type="select" options={options} required />)
      
      // Then: No default prompt forces user to choose valid option
      expect(screen.queryByText('Select an option')).not.toBeInTheDocument()
    })

    it('should display all available options for user selection', () => {
      // Given: Dropdown with multiple predefined choices
      
      // When: FormField renders select with options
      render(<FormField {...defaultProps} type="select" options={options} />)
      
      // Then: All options are available for user selection
      expect(screen.getByText('Option 1')).toBeInTheDocument()
      expect(screen.getByText('Option 2')).toBeInTheDocument()
    })

    it('should handle numeric option values for data consistency', () => {
      // Given: Dropdown with numeric values requiring proper handling
      const numericOptions = [
        { value: 1, label: 'One' },
        { value: 2, label: 'Two' }
      ]
      
      // When: FormField renders select with numeric values
      render(<FormField {...defaultProps} type="select" options={numericOptions} />)
      
      // Then: Numeric options are properly displayed and selectable
      expect(screen.getByText('One')).toBeInTheDocument()
      expect(screen.getByText('Two')).toBeInTheDocument()
    })
  })

  describe('when configuring textarea for multi-line text input', () => {
    it('should allow vertical resizing for user control over input area', () => {
      // Given: Textarea requiring user-adjustable height for varying content
      
      // When: FormField renders textarea
      render(<FormField {...defaultProps} type="textarea" />)
      
      // Then: Vertical resize capability accommodates different content lengths
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveClass('resize-vertical')
    })

    it('should respect custom row configuration for specific content requirements', () => {
      // Given: Textarea requiring specific height for expected content
      
      // When: FormField renders textarea with custom rows
      render(<FormField {...defaultProps} type="textarea" rows={8} />)
      
      // Then: Custom height accommodates expected content volume
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('rows', '8')
    })

    it('should provide reasonable default height for general text input', () => {
      // Given: Textarea without specific height requirements
      
      // When: FormField renders textarea with default configuration
      render(<FormField {...defaultProps} type="textarea" />)
      
      // Then: Default height provides adequate space for typical text input
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('rows', '3')
    })
  })

  describe('when integrating glassmorphism styling for modern appearance', () => {
    it('should apply glassmorphism styling to text inputs with proper attributes', () => {
      // Given: Text input requiring modern glassmorphism appearance
      
      // When: FormField renders with GlassInput integration
      render(
        <FormField 
          {...defaultProps} 
          maxLength={50}
          placeholder="Test placeholder"
        />
      )
      
      // Then: GlassInput styling and attributes are properly applied
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('glass-input')
      expect(input).toHaveAttribute('maxLength', '50')
      expect(input).toHaveAttribute('placeholder', 'Test placeholder')
    })

    it('should apply error-specific glassmorphism styling for validation feedback', () => {
      // Given: Text input in error state requiring visual feedback
      
      // When: FormField renders with error and GlassInput
      render(<FormField {...defaultProps} error="Error message" />)
      
      // Then: Error styling is integrated with glassmorphism design
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('border-red-400', 'focus:border-red-300')
    })

    it('should use standard styling for textarea without glassmorphism', () => {
      // Given: Textarea requiring different styling approach than text inputs
      
      // When: FormField renders textarea
      render(<FormField {...defaultProps} type="textarea" />)
      
      // Then: Textarea uses appropriate non-glass styling
      const textarea = screen.getByRole('textbox')
      expect(textarea).not.toHaveClass('glass-input')
    })

    it('should use standard styling for select dropdown without glassmorphism', () => {
      // Given: Select dropdown requiring different styling approach
      const options = [{ value: 'test', label: 'Test' }]
      
      // When: FormField renders select
      render(<FormField {...defaultProps} type="select" options={options} />)
      
      // Then: Select uses appropriate non-glass styling
      const select = screen.getByRole('combobox')
      expect(select).not.toHaveClass('glass-input')
    })
  })

  describe('when ensuring accessibility for all users', () => {
    it('should establish proper label-input association for screen readers', () => {
      // Given: Form field requiring accessible label association
      
      // When: FormField renders with label
      render(<FormField {...defaultProps} />)
      
      // Then: Input is accessible through its associated label
      const input = screen.getByLabelText('Test Field')
      expect(input).toBeInTheDocument()
    })

    it('should maintain accessibility features for required field validation', () => {
      // Given: Required field needing accessible validation indication
      
      // When: FormField renders as required
      render(<FormField {...defaultProps} required />)
      
      // Then: Required attribute and visual indicator support screen readers
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('required')
      expect(input).toHaveAttribute('id', 'field-testField')
      expect(screen.getByText('*')).toBeInTheDocument()
    })

    it('should provide complete form semantics for assistive technology', () => {
      // Given: Form field requiring proper semantic markup
      
      // When: FormField renders with form attributes
      render(<FormField {...defaultProps} />)
      
      // Then: Name and ID attributes enable proper form processing
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('name', 'testField')
      expect(input).toHaveAttribute('id', 'field-testField')
    })
  })

  describe('when handling unusual data and edge cases gracefully', () => {
    it('should render select dropdown safely with empty options array', () => {
      // Given: Select field with no available options due to data loading
      
      // When: FormField renders select with empty options
      render(<FormField {...defaultProps} type="select" options={[]} />)
      
      // Then: Select renders without errors and shows no options
      const select = screen.getByRole('combobox')
      expect(select).toBeInTheDocument()
      expect(screen.queryByText('Option')).not.toBeInTheDocument()
    })

    it('should handle missing options prop for select without breaking', () => {
      // Given: Select field with undefined options due to data issues
      
      // When: FormField renders select without options prop
      render(<FormField {...defaultProps} type="select" />)
      
      // Then: Select renders safely without crashing
      const select = screen.getByRole('combobox')
      expect(select).toBeInTheDocument()
    })

    it('should display lengthy error messages with proper text wrapping', () => {
      // Given: Form validation producing detailed error message
      const longError = 'This is a very long error message that should wrap properly and maintain readability'
      
      // When: FormField renders with extensive error text
      render(<FormField {...defaultProps} error={longError} />)
      
      // Then: Long error message is displayed with readable formatting
      expect(screen.getByText(longError)).toBeInTheDocument()
    })

    it('should generate valid HTML IDs from field names with special characters', () => {
      // Given: Field name containing special characters or numbers
      
      // When: FormField renders with complex field name
      render(<FormField {...defaultProps} name="field-with-special_chars123" />)
      
      // Then: HTML ID is generated safely for form processing
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('id', 'field-field-with-special_chars123')
      expect(input).toHaveAttribute('name', 'field-with-special_chars123')
    })
  })
})