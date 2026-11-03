import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function Input({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  error, 
  maxLength,
  icon: Icon,
  className = '',
  ...props 
}) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={18} />
          </div>
        )}
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`
            input-field
            ${Icon ? 'pl-10' : ''}
            ${isPassword ? 'pr-10' : ''}
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {maxLength && (
        <div className="text-xs text-gray-400 text-right">
          {(value || '').length}/{maxLength}
        </div>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
