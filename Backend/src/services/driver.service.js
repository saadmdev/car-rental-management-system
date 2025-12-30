/**
 * Driver Service
 * Handles driver-related business logic
 */

import Driver from '../models/Driver.model.js'
import { AppError } from '../middleware/error.middleware.js'

/**
 * Generate unique employee ID
 */
const generateEmployeeId = async () => {
  const prefix = 'DRV'
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  
  const lastDriver = await Driver.findOne({
    employeeId: { $regex: `^${prefix}${year}` }
  }).sort({ employeeId: -1 })
  
  let sequence = 1
  if (lastDriver && lastDriver.employeeId) {
    const lastSeq = parseInt(lastDriver.employeeId.slice(-4)) || 0
    sequence = lastSeq + 1
  }
  
  return `${prefix}${year}${sequence.toString().padStart(4, '0')}`
}

/**
 * Create a new driver
 */
export const createDriver = async (driverData, userId) => {
  // Check if license number already exists
  const existing = await Driver.findOne({
    licenseNumber: driverData.licenseNumber.toUpperCase()
  })
  
  if (existing) {
    throw new AppError('Driver with this license number already exists', 400)
  }

  // Generate employee ID if not provided
  if (!driverData.employeeId) {
    driverData.employeeId = await generateEmployeeId()
  }

  const driver = await Driver.create({
    ...driverData,
    licenseNumber: driverData.licenseNumber.toUpperCase(),
    createdBy: userId
  })

  return driver
}

/**
 * Get driver by ID
 */
export const getDriverById = async (driverId) => {
  const driver = await Driver.findById(driverId)
    .populate('createdBy', 'username fullName')

  if (!driver) {
    throw new AppError('Driver not found', 404)
  }

  return driver
}

/**
 * Get all drivers with filters
 */
export const getDrivers = async (filters = {}, pagination = {}) => {
  const { page = 1, limit = 10, sort = '-createdAt' } = pagination
  const skip = (page - 1) * limit

  const query = Driver.find(filters)
    .sort(sort)
    .skip(skip)
    .limit(limit)

  const [drivers, total] = await Promise.all([
    query.exec(),
    Driver.countDocuments(filters)
  ])

  return {
    drivers,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }
}

/**
 * Update driver
 */
export const updateDriver = async (driverId, updateData, userId) => {
  const driver = await Driver.findById(driverId)
  if (!driver) {
    throw new AppError('Driver not found', 404)
  }

  // If license number is being updated, check for duplicates
  if (updateData.licenseNumber) {
    const existing = await Driver.findOne({
      licenseNumber: updateData.licenseNumber.toUpperCase(),
      _id: { $ne: driverId }
    })
    
    if (existing) {
      throw new AppError('Driver with this license number already exists', 400)
    }
    
    updateData.licenseNumber = updateData.licenseNumber.toUpperCase()
  }

  const updatedDriver = await Driver.findByIdAndUpdate(
    driverId,
    updateData,
    { new: true, runValidators: true }
  )

  return updatedDriver
}

/**
 * Update driver status
 */
export const updateDriverStatus = async (driverId, status) => {
  const driver = await Driver.findByIdAndUpdate(
    driverId,
    { status },
    { new: true }
  )

  if (!driver) {
    throw new AppError('Driver not found', 404)
  }

  return driver
}

/**
 * Get active drivers
 */
export const getActiveDrivers = async () => {
  const drivers = await Driver.find({
    status: 'active'
  }).sort('firstName lastName')

  return drivers
}

/**
 * Delete driver
 */
export const deleteDriver = async (driverId) => {
  const driver = await Driver.findById(driverId)
  
  if (!driver) {
    throw new AppError('Driver not found', 404)
  }

  // Check if driver has active or upcoming bookings
  const Booking = (await import('../models/Booking.model.js')).default
  const activeBookings = await Booking.countDocuments({
    driver: driverId,
    status: { $in: ['pending', 'confirmed', 'in_progress'] }
  })
  
  if (activeBookings > 0) {
    throw new AppError('Cannot delete driver with active or upcoming bookings', 400)
  }

  await Driver.findByIdAndDelete(driverId)
  return { message: 'Driver deleted successfully' }
}

