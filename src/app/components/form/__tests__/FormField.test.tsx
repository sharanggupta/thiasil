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

describe('FormField', () => {
  const defaultProps = {
    label: 'Test Field',
    name: 'testField',
    value: '',
    onChange: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('basic rendering', () => {
    it('renders text input correctly', () => {
      render(<FormField {...defaultProps} />)
      
      expect(screen.getByLabelText('Test Field')).toBeInTheDocument()
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('renders label correctly', () => {
      render(<FormField {...defaultProps} />)
      
      const label = screen.getByText('Test Field')
      expect(label).toBeInTheDocument()
      expect(label.tagName).toBe('LABEL')
    })

    it('associates label with input correctly', () => {
      render(<FormField {...defaultProps} />)
      
      const input = screen.getByRole('textbox')
      const label = screen.getByLabelText('Test Field')
      
      expect(input).toBe(label)
      expect(input).toHaveAttribute('id', 'field-testField')
    })

    it('applies custom className', () => {
      const { container } = render(<FormField {...defaultProps} className="custom-field" />)
      
      expect(container.firstChild).toHaveClass('form-field', 'custom-field')
    })
  })

  describe('input types', () => {
    it('renders number input correctly', () => {
      render(<FormField {...defaultProps} type="number" value={42} />)
      
      const input = screen.getByRole('spinbutton')
      expect(input).toHaveAttribute('type', 'number')
      expect(input).toHaveValue(42)
    })

    it('renders email input correctly', () => {
      render(<FormField {...defaultProps} type="email" placeholder="Enter email" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'email')
      expect(input).toHaveAttribute('placeholder', 'Enter email')
    })

    it('renders password input correctly', () => {
      render(<FormField {...defaultProps} type="password" />)
      
      const input = screen.getByLabelText('Test Field')
      expect(input).toHaveAttribute('type', 'password')
    })

    it('renders textarea correctly', () => {
      render(<FormField {...defaultProps} type="textarea" rows={5} />)
      
      const textarea = screen.getByRole('textbox')
      expect(textarea.tagName).toBe('TEXTAREA')
      expect(textarea).toHaveAttribute('rows', '5')
    })

    it('renders select dropdown correctly', () => {
      const options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' }
      ]
      
      render(<FormField {...defaultProps} type="select" options={options} />)
      
      const select = screen.getByRole('combobox')
      expect(select.tagName).toBe('SELECT')
      expect(screen.getByText('Option 1')).toBeInTheDocument()
      expect(screen.getByText('Option 2')).toBeInTheDocument()
    })
  })

  describe('form field attributes', () => {
    it('handles required field correctly', () => {
      render(<FormField {...defaultProps} required />)
      
      const input = screen.getByRole('textbox')
      const requiredIndicator = screen.getByText('*')
      
      expect(input).toHaveAttribute('required')
      expect(requiredIndicator).toBeInTheDocument()
      expect(requiredIndicator).toHaveClass('text-red-400')
    })

    it('handles disabled field correctly', () => {
      render(<FormField {...defaultProps} disabled />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('disabled')
    })

    it('handles placeholder text', () => {
      render(<FormField {...defaultProps} placeholder="Enter value here" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('placeholder', 'Enter value here')
    })

    it('handles maxLength attribute', () => {
      render(<FormField {...defaultProps} maxLength={100} />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('maxLength', '100')
    })

    it('handles number input attributes', () => {
      render(<FormField {...defaultProps} type="number" min={0} max={100} step={5} />)
      
      const input = screen.getByRole('spinbutton')
      expect(input).toHaveAttribute('min', '0')
      expect(input).toHaveAttribute('max', '100')
      expect(input).toHaveAttribute('step', '5')
    })
  })

  describe('field sizing', () => {
    it('applies small size classes correctly for textarea', () => {
      render(<FormField {...defaultProps} type="textarea" size="small" />)
      
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveClass('px-3', 'py-1', 'text-sm')
    })

    it('applies medium size classes correctly for textarea (default)', () => {
      render(<FormField {...defaultProps} type="textarea" />)
      
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveClass('px-4', 'py-2', 'text-base')
    })

    it('applies large size classes correctly for textarea', () => {
      render(<FormField {...defaultProps} type="textarea" size="large" />)
      
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveClass('px-5', 'py-3', 'text-lg')
    })
  })

  describe('error handling', () => {
    it('displays error message correctly', () => {
      render(<FormField {...defaultProps} error="This field is required" />)
      
      const errorMessage = screen.getByText('This field is required')
      expect(errorMessage).toBeInTheDocument()
      // Error message is inside a div with the text-red-300 class
      expect(errorMessage.parentElement).toHaveClass('text-red-300')
    })

    it('applies error styling to field', () => {
      render(<FormField {...defaultProps} error="This field is required" />)
      
      const label = screen.getByText('Test Field')
      expect(label).toHaveClass('text-red-300')
    })

    it('shows error icon with error message', () => {
      render(<FormField {...defaultProps} error="This field is required" />)
      
      const errorContainer = screen.getByText('This field is required').parentElement
      const errorIcon = errorContainer?.querySelector('svg')
      
      expect(errorIcon).toBeInTheDocument()
    })

    it('hides help text when error is present', () => {
      render(
        <FormField 
          {...defaultProps} 
          error="This field is required" 
          helpText="This is help text" 
        />
      )
      
      expect(screen.getByText('This field is required')).toBeInTheDocument()
      expect(screen.queryByText('This is help text')).not.toBeInTheDocument()
    })
  })

  describe('help text', () => {
    it('displays help text correctly', () => {
      render(<FormField {...defaultProps} helpText="This is helpful information" />)
      
      const helpText = screen.getByText('This is helpful information')
      expect(helpText).toBeInTheDocument()
      expect(helpText).toHaveClass('text-white/60')
    })

    it('hides help text when error is present', () => {
      render(
        <FormField 
          {...defaultProps} 
          error="Error message" 
          helpText="Help text" 
        />
      )
      
      expect(screen.queryByText('Help text')).not.toBeInTheDocument()
    })
  })

  describe('value handling and onChange', () => {
    it('handles text input changes correctly', () => {
      const onChange = jest.fn()
      render(<FormField {...defaultProps} onChange={onChange} />)
      
      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: 'test value' } })
      
      expect(onChange).toHaveBeenCalledWith('test value')
    })

    it('handles number input changes correctly', () => {
      const onChange = jest.fn()
      render(<FormField {...defaultProps} type="number" onChange={onChange} />)
      
      const input = screen.getByRole('spinbutton')
      fireEvent.change(input, { target: { value: '123' } })
      
      expect(onChange).toHaveBeenCalledWith(123)
    })

    it('handles empty number input correctly', () => {
      const onChange = jest.fn()
      render(<FormField {...defaultProps} type="number" value={123} onChange={onChange} />)
      
      const input = screen.getByRole('spinbutton')
      fireEvent.change(input, { target: { value: '' } })
      
      // When number input is empty, it should return empty string
      expect(onChange).toHaveBeenCalledWith('')
    })

    it('handles textarea changes correctly', () => {
      const onChange = jest.fn()
      render(<FormField {...defaultProps} type="textarea" onChange={onChange} />)
      
      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: 'multiline\ntext' } })
      
      expect(onChange).toHaveBeenCalledWith('multiline\ntext')
    })

    it('handles select changes correctly', () => {
      const onChange = jest.fn()
      const options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' }
      ]
      
      render(<FormField {...defaultProps} type="select" options={options} onChange={onChange} />)
      
      const select = screen.getByRole('combobox')
      fireEvent.change(select, { target: { value: 'option2' } })
      
      expect(onChange).toHaveBeenCalledWith('option2')
    })
  })

  describe('select dropdown specific features', () => {
    const options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' }
    ]

    it('shows default option when not required', () => {
      render(<FormField {...defaultProps} type="select" options={options} />)
      
      expect(screen.getByText('Select an option')).toBeInTheDocument()
    })

    it('hides default option when required', () => {
      render(<FormField {...defaultProps} type="select" options={options} required />)
      
      expect(screen.queryByText('Select an option')).not.toBeInTheDocument()
    })

    it('renders all options correctly', () => {
      render(<FormField {...defaultProps} type="select" options={options} />)
      
      expect(screen.getByText('Option 1')).toBeInTheDocument()
      expect(screen.getByText('Option 2')).toBeInTheDocument()
    })

    it('handles numeric option values', () => {
      const numericOptions = [
        { value: 1, label: 'One' },
        { value: 2, label: 'Two' }
      ]
      
      render(<FormField {...defaultProps} type="select" options={numericOptions} />)
      
      expect(screen.getByText('One')).toBeInTheDocument()
      expect(screen.getByText('Two')).toBeInTheDocument()
    })
  })

  describe('textarea specific features', () => {
    it('applies resize-vertical class to textarea', () => {
      render(<FormField {...defaultProps} type="textarea" />)
      
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveClass('resize-vertical')
    })

    it('uses custom rows attribute', () => {
      render(<FormField {...defaultProps} type="textarea" rows={8} />)
      
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('rows', '8')
    })

    it('defaults to 3 rows when not specified', () => {
      render(<FormField {...defaultProps} type="textarea" />)
      
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('rows', '3')
    })
  })

  describe('GlassInput integration', () => {
    it('passes correct props to GlassInput for text input', () => {
      render(
        <FormField 
          {...defaultProps} 
          maxLength={50}
          placeholder="Test placeholder"
        />
      )
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('glass-input')
      expect(input).toHaveAttribute('maxLength', '50')
      expect(input).toHaveAttribute('placeholder', 'Test placeholder')
    })

    it('applies error styling to GlassInput', () => {
      render(<FormField {...defaultProps} error="Error message" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('border-red-400', 'focus:border-red-300')
    })

    it('does not use GlassInput for textarea', () => {
      render(<FormField {...defaultProps} type="textarea" />)
      
      const textarea = screen.getByRole('textbox')
      expect(textarea).not.toHaveClass('glass-input')
    })

    it('does not use GlassInput for select', () => {
      const options = [{ value: 'test', label: 'Test' }]
      render(<FormField {...defaultProps} type="select" options={options} />)
      
      const select = screen.getByRole('combobox')
      expect(select).not.toHaveClass('glass-input')
    })
  })

  describe('accessibility', () => {
    it('has proper label association', () => {
      render(<FormField {...defaultProps} />)
      
      const input = screen.getByLabelText('Test Field')
      expect(input).toBeInTheDocument()
    })

    it('maintains accessibility with required fields', () => {
      render(<FormField {...defaultProps} required />)
      
      // Use ID to find the input instead since the label contains additional elements
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('required')
      expect(input).toHaveAttribute('id', 'field-testField')
      
      // Check that the asterisk is rendered
      expect(screen.getByText('*')).toBeInTheDocument()
    })

    it('provides proper form semantics', () => {
      render(<FormField {...defaultProps} />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('name', 'testField')
      expect(input).toHaveAttribute('id', 'field-testField')
    })
  })

  describe('edge cases', () => {
    it('handles empty options array for select', () => {
      render(<FormField {...defaultProps} type="select" options={[]} />)
      
      const select = screen.getByRole('combobox')
      expect(select).toBeInTheDocument()
      expect(screen.queryByText('Option')).not.toBeInTheDocument()
    })

    it('handles undefined options for select', () => {
      render(<FormField {...defaultProps} type="select" />)
      
      const select = screen.getByRole('combobox')
      expect(select).toBeInTheDocument()
    })

    it('handles long error messages', () => {
      const longError = 'This is a very long error message that should wrap properly and maintain readability'
      render(<FormField {...defaultProps} error={longError} />)
      
      expect(screen.getByText(longError)).toBeInTheDocument()
    })

    it('handles special characters in field name', () => {
      render(<FormField {...defaultProps} name="field-with-special_chars123" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('id', 'field-field-with-special_chars123')
      expect(input).toHaveAttribute('name', 'field-with-special_chars123')
    })
  })
})