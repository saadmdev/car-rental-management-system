/**
 * Payment Routes
 */

import express from 'express'
import * as paymentController from '../controllers/payment.controller.js'
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js'

const router = express.Router()

// All routes require authentication and admin role
router.use(authenticate)
router.use(requireAdmin)

// Routes
router.post('/', paymentController.createPayment)
router.get('/', paymentController.getPayments)
router.get('/receivables/summary', paymentController.getReceivablesSummary)
router.get('/payables/summary', paymentController.getPayablesSummary)
router.get('/receivables/outstanding', paymentController.getOutstandingReceivables)
router.patch('/:id/received', paymentController.markPaymentAsReceived)
router.get('/:id', paymentController.getPaymentById)

export default router

