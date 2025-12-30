/**
 * API Error Handler
 * Centralized error handling for API calls
 */

import toast from 'react-hot-toast'

export const handleApiError = (error) => {
  let message = 'An error occurred'

  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response
    
    if (status === 401) {
      message = 'Unauthorized. Please login again.'
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/pages/login'
      }
    } else if (status === 403) {
      message = 'You do not have permission to perform this action.'
    } else if (status === 404) {
      message = 'Resource not found.'
    } else if (status === 422) {
      // Validation errors
      if (data.errors) {
        const errorMessages = Object.values(data.errors).flat()
        message = errorMessages.join(', ')
      } else {
        message = data.message || 'Validation error'
      }
    } else if (status === 500) {
      message = 'Server error. Please try again later.'
    } else {
      message = data.message || `Error ${status}`
    }
  } else if (error.request) {
    // Request made but no response
    message = 'Network error. Please check your connection.'
  } else {
    // Error in request setup
    message = error.message || 'An unexpected error occurred'
  }

  toast.error(message)
  return message
}

export const handleApiSuccess = (message = 'Operation successful') => {
  toast.success(message)
}

