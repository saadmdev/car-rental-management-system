/**
 * Customer Controller
 */

import * as customerService from '../services/customer.service.js'
import { asyncHandler } from '../middleware/error.middleware.js'

export const createCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.createCustomer(req.body, req.user.id)
  res.status(201).json({ success: true, data: customer })
})

export const getCustomers = asyncHandler(async (req, res) => {
  const { page, limit, sort, ...filters } = req.query
  const result = await customerService.getCustomers(filters, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    sort: sort || '-createdAt'
  })
  res.status(200).json({ success: true, data: result.customers, pagination: result.pagination })
})

export const getCustomerById = asyncHandler(async (req, res) => {
  const customer = await customerService.getCustomerById(req.params.id)
  res.status(200).json({ success: true, data: customer })
})

export const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.updateCustomer(req.params.id, req.body, req.user.id)
  res.status(200).json({ success: true, data: customer })
})

export const getCustomerBookings = asyncHandler(async (req, res) => {
  const bookings = await customerService.getCustomerBookings(req.params.id)
  res.status(200).json({ success: true, data: bookings })
})

export const deactivateCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.deactivateCustomer(req.params.id)
  res.status(200).json({ success: true, data: customer, message: 'Customer deactivated successfully' })
})

