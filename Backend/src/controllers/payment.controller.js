/**
 * Payment Controller
 * Handles HTTP requests for payment operations
 */

import * as paymentService from '../services/payment.service.js'
import { asyncHandler } from '../middleware/error.middleware.js'

/**
 * Create a new payment
 */
export const createPayment = asyncHandler(async (req, res) => {
  const payment = await paymentService.createPayment(req.body, req.user.id)
  
  res.status(201).json({
    success: true,
    data: payment
  })
})

/**
 * Get all payments
 */
export const getPayments = asyncHandler(async (req, res) => {
  const { page, limit, sort, ...filters } = req.query
  
  const result = await paymentService.getPayments(filters, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    sort: sort || '-paymentDate'
  })
  
  res.status(200).json({
    success: true,
    data: result.payments,
    pagination: result.pagination
  })
})

/**
 * Get payment by ID
 */
export const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await paymentService.getPaymentById(req.params.id)
  
  res.status(200).json({
    success: true,
    data: payment
  })
})

/**
 * Get receivables summary
 */
export const getReceivablesSummary = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query
  
  const summary = await paymentService.getReceivablesSummary(startDate, endDate)
  
  res.status(200).json({
    success: true,
    data: summary
  })
})

/**
 * Get payables summary
 */
export const getPayablesSummary = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query
  
  const summary = await paymentService.getPayablesSummary(startDate, endDate)
  
  res.status(200).json({
    success: true,
    data: summary
  })
})

/**
 * Get outstanding receivables
 */
export const getOutstandingReceivables = asyncHandler(async (req, res) => {
  const receivables = await paymentService.getOutstandingReceivables()
  
  res.status(200).json({
    success: true,
    data: receivables
  })
})

/**
 * Mark payment as received
 */
export const markPaymentAsReceived = asyncHandler(async (req, res) => {
  const payment = await paymentService.markPaymentAsReceived(req.params.id, req.user.id)
  
  res.status(200).json({
    success: true,
    data: payment,
    message: 'Payment marked as received successfully'
  })
})

