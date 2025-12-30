/**
 * Booking Routes
 */

import express from 'express'
import * as bookingController from '../controllers/booking.controller.js'
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js'

const router = express.Router()

// All routes require authentication and admin role
router.use(authenticate)
router.use(requireAdmin)

// Routes
router.post('/', bookingController.createBooking)
router.get('/', bookingController.getBookings)
router.get('/calculate-pricing', bookingController.calculatePricing)
router.get('/:id', bookingController.getBookingById)
router.put('/:id', bookingController.updateBooking)
router.patch('/:id/status', bookingController.updateBookingStatus)

export default router

