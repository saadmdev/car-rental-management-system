/**
 * Customer Routes
 */

import express from 'express'
import * as customerController from '../controllers/customer.controller.js'
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js'

const router = express.Router()

router.use(authenticate)
router.use(requireAdmin)

router.post('/', customerController.createCustomer)
router.get('/', customerController.getCustomers)
router.get('/:id', customerController.getCustomerById)
router.get('/:id/bookings', customerController.getCustomerBookings)
router.put('/:id', customerController.updateCustomer)
router.patch('/:id/deactivate', customerController.deactivateCustomer)

export default router

