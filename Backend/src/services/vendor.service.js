/**
 * Vendor Service
 * Handles vendor-related business logic
 */

import Vendor from '../models/Vendor.model.js'
import { AppError } from '../middleware/error.middleware.js'

/**
 * Create a new vendor
 */
export const createVendor = async (vendorData, userId) => {
  // Check if email already exists
  const existing = await Vendor.findOne({
    email: vendorData.email.toLowerCase()
  })
  
  if (existing) {
    throw new AppError('Vendor with this email already exists', 400)
  }

  const vendor = await Vendor.create({
    ...vendorData,
    email: vendorData.email.toLowerCase(),
    createdBy: userId
  })

  return vendor
}

/**
 * Get vendor by ID
 */
export const getVendorById = async (vendorId) => {
  const vendor = await Vendor.findById(vendorId)
    .populate('createdBy', 'username fullName')

  if (!vendor) {
    throw new AppError('Vendor not found', 404)
  }

  return vendor
}

/**
 * Get all vendors with filters
 */
export const getVendors = async (filters = {}, pagination = {}) => {
  const { page = 1, limit = 10, sort = '-createdAt' } = pagination
  const skip = (page - 1) * limit

  // Only show active vendors by default unless explicitly filtered
  const queryFilters = { ...filters }
  if (queryFilters.isActive === undefined) {
    queryFilters.isActive = true
  }

  const query = Vendor.find(queryFilters)
    .sort(sort)
    .skip(skip)
    .limit(limit)

  const [vendors, total] = await Promise.all([
    query.exec(),
    Vendor.countDocuments(queryFilters)
  ])

  return {
    vendors,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }
}

/**
 * Update vendor
 */
export const updateVendor = async (vendorId, updateData, userId) => {
  const vendor = await Vendor.findById(vendorId)
  if (!vendor) {
    throw new AppError('Vendor not found', 404)
  }

  // If email is being updated, check for duplicates
  if (updateData.email) {
    const existing = await Vendor.findOne({
      email: updateData.email.toLowerCase(),
      _id: { $ne: vendorId }
    })
    
    if (existing) {
      throw new AppError('Vendor with this email already exists', 400)
    }
    
    updateData.email = updateData.email.toLowerCase()
  }

  const updatedVendor = await Vendor.findByIdAndUpdate(
    vendorId,
    updateData,
    { new: true, runValidators: true }
  )

  return updatedVendor
}

/**
 * Get active vendors
 */
export const getActiveVendors = async () => {
  const vendors = await Vendor.find({
    isActive: true
  }).sort('name')

  return vendors
}

/**
 * Deactivate vendor (soft delete)
 */
export const deactivateVendor = async (vendorId) => {
  const Booking = (await import('../models/Booking.model.js')).default
  const Vehicle = (await import('../models/Vehicle.model.js')).default
  
  const vendor = await Vendor.findById(vendorId)
  if (!vendor) {
    throw new AppError('Vendor not found', 404)
  }

  // Check if vendor has linked bookings
  const activeBookings = await Booking.countDocuments({
    vendor: vendorId,
    status: { $in: ['pending', 'confirmed', 'in_progress'] }
  })

  if (activeBookings > 0) {
    throw new AppError('Cannot deactivate vendor with active or pending bookings', 400)
  }

  // Check if vendor has linked vehicles
  const linkedVehicles = await Vehicle.countDocuments({
    vendor: vendorId,
    isActive: true
  })

  if (linkedVehicles > 0) {
    throw new AppError('Cannot deactivate vendor with active vehicles linked', 400)
  }

  // Soft delete: set isActive to false
  const deactivatedVendor = await Vendor.findByIdAndUpdate(
    vendorId,
    { isActive: false },
    { new: true }
  )

  return deactivatedVendor
}

