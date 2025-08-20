import React from 'react'
import { useFormContext } from 'react-hook-form'

interface FormInputProps {
  name: string
  label: string
  type?: 'text' | 'email' | 'tel' | 'number' | 'date'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
  step?: string | number
}

const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  className = '',
  step
}) => {
  const {
    register,
    formState: { errors }
  } = useFormContext()

  const error = errors[name]

  return (
    <div className={`form-group ${className}`}>
      <label htmlFor={name}>
        {label}
        {required && <span className="required">*</span>}
      </label>
      <input
        {...register(name)}
        type={type}
        id={name}
        placeholder={placeholder}
        disabled={disabled}
        className={error ? 'error' : ''}
        step={step}
      />
      {error && (
        <span className="error-message">
          {error.message as string}
        </span>
      )}
    </div>
  )
}

export default FormInput
