import React from 'react'
import { useFormContext } from 'react-hook-form'

interface FormSelectProps {
  name: string
  label: string
  options: Array<[string, string]>
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

const FormSelect: React.FC<FormSelectProps> = ({
  name,
  label,
  options,
  placeholder,
  required = false,
  disabled = false,
  className = ''
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
      <select
        {...register(name)}
        id={name}
        disabled={disabled}
        className={error ? 'error' : ''}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      {error && (
        <span className="error-message">
          {error.message as string}
        </span>
      )}
    </div>
  )
}

export default FormSelect
