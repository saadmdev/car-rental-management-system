'use client'

export default function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder,
  icon: Icon,
  ...props
}) {
  return (
    <div>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && type !== 'textarea' && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
        {type === 'textarea' ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            rows={4}
            className={`w-full pl-4 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            {...props}
          />
        ) : (
          <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={`w-full ${
              Icon ? 'pl-10' : 'pl-4'
            } pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            {...props}
          />
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

