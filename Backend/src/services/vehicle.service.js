/**
 * Vehicle Service
 * Handles vehicle-related business logic
 */

import Vehicle from '../models/Vehicle.model.js'
import Booking from '../models/Booking.model.js'
import { AppError } from '../middleware/error.middleware.js'

/**
 * Create a new vehicle
 */
export const createVehicle = async (vehicleData, userId) => {
  // Check if registration number already exists
  const existing = await Vehicle.findOne({
    registrationNumber: vehicleData.registrationNumber.toUpperCase()
  })
  
  if (existing) {
    throw new AppError('Vehicle with this registration number already exists', 400)
  }

  const vehicle = await Vehicle.create({
    ...vehicleData,
    registrationNumber: vehicleData.registrationNumber.toUpperCase(),
    createdBy: userId
  })

  return vehicle
}

/**
 * Get vehicle by ID
 */
export const getVehicleById = async (vehicleId) => {
  const vehicle = await Vehicle.findById(vehicleId)
    .populate('vendor', 'name contactPerson email phone')
    .populate('createdBy', 'username fullName')

  if (!vehicle) {
    throw new AppError('Vehicle not found', 404)
  }

  return vehicle
}

/**
 * Get all vehicles with filters
 */
export const getVehicles = async (filters = {}, pagination = {}) => {
  const { page = 1, limit = 10, sort = '-createdAt' } = pagination
  const skip = (page - 1) * limit

  const query = Vehicle.find(filters)
    .populate('vendor', 'name')
    .sort(sort)
    .skip(skip)
    .limit(limit)

  const [vehicles, total] = await Promise.all([
    query.exec(),
    Vehicle.countDocuments(filters)
  ])

  return {
    vehicles,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }
}

/**
 * Update vehicle
 */
export const updateVehicle = async (vehicleId, updateData, userId) => {
  const vehicle = await Vehicle.findById(vehicleId)
  if (!vehicle) {
    throw new AppError('Vehicle not found', 404)
  }

  // If registration number is being updated, check for duplicates
  if (updateData.registrationNumber) {
    const existing = await Vehicle.findOne({
      registrationNumber: updateData.registrationNumber.toUpperCase(),
      _id: { $ne: vehicleId }
    })
    
    if (existing) {
      throw new AppError('Vehicle with this registration number already exists', 400)
    }
    
    updateData.registrationNumber = updateData.registrationNumber.toUpperCase()
  }

  const updatedVehicle = await Vehicle.findByIdAndUpdate(
    vehicleId,
    updateData,
    { new: true, runValidators: true }
  )

  return updatedVehicle
}

/**
 * Update vehicle status
 */
export const updateVehicleStatus = async (vehicleId, status) => {
  const vehicle = await Vehicle.findByIdAndUpdate(
    vehicleId,
    { status },
    { new: true }
  )

  if (!vehicle) {
    throw new AppError('Vehicle not found', 404)
  }

  return vehicle
}

/**
 * Get available vehicles
 */
export const getAvailableVehicles = async (filters = {}) => {
  const query = {
    isActive: true,
    status: 'available',
    ...filters
  }

  const vehicles = await Vehicle.find(query)
    .populate('vendor', 'name')
    .sort('make model')

  return vehicles
}

/**
 * Delete vehicle
 */
export const deleteVehicle = async (vehicleId) => {
  const vehicle = await Vehicle.findById(vehicleId)
  
  if (!vehicle) {
    throw new AppError('Vehicle not found', 404)
  }

  // Check if vehicle has active bookings
  const activeBookings = await Booking.countDocuments({
    vehicle: vehicleId,
    status: { $in: ['confirmed', 'in_progress'] }
  })
  
  if (activeBookings > 0) {
    throw new AppError('Cannot delete vehicle with active bookings', 400)
  }

  await Vehicle.findByIdAndDelete(vehicleId)
  return { message: 'Vehicle deleted successfully' }
}

