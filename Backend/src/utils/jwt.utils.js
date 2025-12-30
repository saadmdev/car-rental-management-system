import jwt from 'jsonwebtoken'
import config from '../config/env.js'

/**
 * JWT Utility Functions
 * Handles token generation and verification
 */

/**
 * Generate JWT token
 * @param {Object} payload - Data to encode in token
 * @param {String} expiresIn - Token expiration time (default: 7d)
 * @returns {String} JWT token
 */
export const generateToken = (payload, expiresIn = config.jwtExpire) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn
  })
}

/**
 * Verify JWT token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
export const verifyToken = (token) => {
  return jwt.verify(token, config.jwtSecret)
}

/**
 * Decode JWT token without verification (for inspection)
 * @param {String} token - JWT token to decode
 * @returns {Object} Decoded token payload
 */
export const decodeToken = (token) => {
  return jwt.decode(token)
}

