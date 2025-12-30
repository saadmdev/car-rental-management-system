/**
 * Booking Controller
 * Handles HTTP requests for booking operations
 */

import * as bookingService from '../services/booking.service.js'
import { asyncHandler } from '../middleware/error.middleware.js'

/**
 * Create a new booking
 */
export const createBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.createBooking(req.body, req.user.id)
  
  res.status(201).json({
    success: true,
    data: booking
  })
})

/**
 * Get all bookings
 */
export const getBookings = asyncHandler(async (req, res) => {
  const { page, limit, sort, ...filters } = req.query
  
  const result = await bookingService.getBookings(filters, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    sort: sort || '-createdAt'
  })
  
  res.status(200).json({
    success: true,
    data: result.bookings,
    pagination: result.pagination
  })
})

/**
 * Get booking by ID
 */
export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await bookingService.getBookingById(req.params.id)
  
  res.status(200).json({
    success: true,
    data: booking
  })
})

/**
 * Update booking
 */
export const updateBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.updateBooking(
    req.params.id,
    req.body,
    req.user.id
  )
  
  res.status(200).json({
    success: true,
    data: booking
  })
})

/**
 * Update booking status
 */
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status, reason } = req.body
  
  const booking = await bookingService.updateBookingStatus(
    req.params.id,
    status,
    req.user.id,
    reason
  )
  
  res.status(200).json({
    success: true,
    data: booking
  })
})

/**
 * Calculate booking pricing (preview)
 */
export const calculatePricing = asyncHandler(async (req, res) => {
  const pricing = await bookingService.calculateBookingPricing(req.body)
  
  res.status(200).json({
    success: true,
    data: pricing
  })
})

/**
 * Create a public booking (from website, no authentication required)
 */
export const createPublicBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.createPublicBooking(req.body)
  
  res.status(201).json({
    success: true,
    data: booking,
    message: 'Booking request submitted successfully. We will contact you shortly.'
  })
})

