'use client'

/**
 * Auth Utilities
 * Handles authentication state and token management
 */

import { api } from './client.js'

/**
 * Login user
 */
export const login = async (email, password) => {
  try {
    const response = await api.login(email, password)
    
    if (response.success && response.data.token) {
      // Store token in localStorage
      localStorage.setItem('authToken', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      return response.data
    }
    
    throw new Error('Login failed')
  } catch (error) {
    throw error
  }
}

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
  window.location.href = '/pages/login'
}

/**
 * Get current user from localStorage
 */
export const getCurrentUser = () => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }
  return null
}

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('authToken')
  }
  return false
}

/**
 * Get auth token
 */
export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken')
  }
  return null
}

