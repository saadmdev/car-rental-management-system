/**
 * Auth Service
 * Handles authentication-related business logic
 */

import AdminUser from '../models/AdminUser.model.js'
import { generateToken } from '../utils/jwt.utils.js'
import { AppError } from '../middleware/error.middleware.js'

/**
 * Login admin user
 */
export const login = async (email, password) => {
  // Find user by email and include password
  const user = await AdminUser.findOne({ email: email.toLowerCase() })
    .select('+password')

  if (!user) {
    throw new AppError('Invalid credentials', 401)
  }

  // Check if user is active
  if (!user.isActive) {
    throw new AppError('Account is deactivated', 403)
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password)
  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401)
  }

  // Update last login
  user.lastLogin = new Date()
  await user.save()

  // Generate token
  const token = generateToken({
    id: user._id,
    email: user.email,
    role: user.role,
    username: user.username
  })

  // Remove password from user object
  const userObj = user.toObject()
  delete userObj.password

  return {
    user: userObj,
    token
  }
}

/**
 * Get current user
 */
export const getCurrentUser = async (userId) => {
  const user = await AdminUser.findById(userId)
  
  if (!user) {
    throw new AppError('User not found', 404)
  }

  if (!user.isActive) {
    throw new AppError('Account is deactivated', 403)
  }

  return user
}

