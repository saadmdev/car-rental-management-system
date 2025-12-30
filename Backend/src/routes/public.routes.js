/**
 * Public Routes
 * Routes accessible without authentication
 */

import express from 'express'
import * as vehicleController from '../controllers/vehicle.controller.js'
import * as bookingController from '../controllers/booking.controller.js'

const router = express.Router()

// Public vehicle endpoints (no authentication required)
router.get('/vehicles/available', vehicleController.getAvailableVehicles)
router.get('/vehicles/:id', vehicleController.getVehicleById)

// Public booking endpoint (no authentication required)
router.post('/bookings', bookingController.createPublicBooking)

export default router

