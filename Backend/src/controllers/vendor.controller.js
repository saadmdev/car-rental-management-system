/**
 * Vendor Controller
 */

import * as vendorService from '../services/vendor.service.js'
import { asyncHandler } from '../middleware/error.middleware.js'

export const createVendor = asyncHandler(async (req, res) => {
  const vendor = await vendorService.createVendor(req.body, req.user.id)
  res.status(201).json({ success: true, data: vendor })
})

export const getVendors = asyncHandler(async (req, res) => {
  const { page, limit, sort, ...filters } = req.query
  const result = await vendorService.getVendors(filters, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    sort: sort || '-createdAt'
  })
  res.status(200).json({ success: true, data: result.vendors, pagination: result.pagination })
})

export const getVendorById = asyncHandler(async (req, res) => {
  const vendor = await vendorService.getVendorById(req.params.id)
  res.status(200).json({ success: true, data: vendor })
})

export const updateVendor = asyncHandler(async (req, res) => {
  const vendor = await vendorService.updateVendor(req.params.id, req.body, req.user.id)
  res.status(200).json({ success: true, data: vendor })
})

export const getActiveVendors = asyncHandler(async (req, res) => {
  const vendors = await vendorService.getActiveVendors()
  res.status(200).json({ success: true, data: vendors })
})

export const deactivateVendor = asyncHandler(async (req, res) => {
  const vendor = await vendorService.deactivateVendor(req.params.id)
  res.status(200).json({ success: true, data: vendor, message: 'Vendor deactivated successfully' })
})

