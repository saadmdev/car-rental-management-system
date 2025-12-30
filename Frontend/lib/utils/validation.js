/**
 * Validation utilities
 */

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePhone = (phone) => {
  const re = /^[\d\s\-\+\(\)]+$/
  return re.test(phone) && phone.replace(/\D/g, '').length >= 10
}

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== ''
}

export const validateNumber = (value, min = null, max = null) => {
  const num = parseFloat(value)
  if (isNaN(num)) return false
  if (min !== null && num < min) return false
  if (max !== null && num > max) return false
  return true
}

export const validateDate = (date) => {
  return date instanceof Date && !isNaN(date.getTime())
}

export const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return false
  return new Date(startDate) <= new Date(endDate)
}

export const validateForm = (formData, rules) => {
  const errors = {}
  
  Object.keys(rules).forEach((field) => {
    const rule = rules[field]
    const value = formData[field]
    
    if (rule.required && !validateRequired(value)) {
      errors[field] = rule.requiredMessage || `${field} is required`
      return
    }
    
    if (value && rule.email && !validateEmail(value)) {
      errors[field] = rule.emailMessage || 'Invalid email address'
      return
    }
    
    if (value && rule.phone && !validatePhone(value)) {
      errors[field] = rule.phoneMessage || 'Invalid phone number'
      return
    }
    
    if (value && rule.number && !validateNumber(value, rule.min, rule.max)) {
      errors[field] = rule.numberMessage || 'Invalid number'
      return
    }
    
    if (value && rule.minLength && value.length < rule.minLength) {
      errors[field] = rule.minLengthMessage || `Minimum length is ${rule.minLength}`
      return
    }
    
    if (value && rule.maxLength && value.length > rule.maxLength) {
      errors[field] = rule.maxLengthMessage || `Maximum length is ${rule.maxLength}`
      return
    }
  })
  
  return errors
}

