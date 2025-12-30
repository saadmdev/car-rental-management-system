/**
 * Export Routes
 */

import express from 'express'
import * as exportController from '../controllers/export.controller.js'
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js'

const router = express.Router()

router.use(authenticate)
router.use(requireAdmin)

router.get('/bookings', exportController.exportBookings)
router.get('/expenses', exportController.exportExpenses)
router.get('/payments', exportController.exportPayments)
router.get('/income-expense', exportController.exportIncomeExpense)

export default router

