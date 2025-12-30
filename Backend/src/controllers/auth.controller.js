/**
 * Auth Controller
 * Handles HTTP requests for authentication
 */

import * as authService from '../services/auth.service.js'
import { asyncHandler } from '../middleware/error.middleware.js'

/**
 * Login
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    })
  }

  const result = await authService.login(email, password)

  res.status(200).json({
    success: true,
    data: result
  })
})

/**
 * Get current user
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.id)

  res.status(200).json({
    success: true,
    data: user
  })
})

