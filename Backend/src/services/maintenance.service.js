/**
 * Maintenance Service
 * Handles maintenance log business logic
 */

import MaintenanceLog from '../models/MaintenanceLog.model.js'
import Vehicle from '../models/Vehicle.model.js'
import { AppError } from '../middleware/error.middleware.js'

/**
 * Generate unique maintenance log number
 */
const generateLogNumber = async () => {
  const prefix = 'MNT'
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const lastLog = await MaintenanceLog.findOne({
    maintenanceDate: { $gte: today }
  }).sort({ logNumber: -1 })
  
  let sequence = 1
  if (lastLog) {
    const lastSeq = parseInt(lastLog.logNumber.slice(-4)) || 0
    sequence = lastSeq + 1
  }
  
  return `${prefix}${year}${month}${sequence.toString().padStart(4, '0')}`
}

/**
 * Create maintenance log
 */
export const createMaintenanceLog = async (maintenanceData, userId) => {
  const logNumber = await generateLogNumber()

  const maintenance = await MaintenanceLog.create({
    ...maintenanceData,
    logNumber,
    createdBy: userId
  })

  // Update vehicle status if maintenance is in progress
  if (maintenance.status === 'in_progress') {
    await Vehicle.findByIdAndUpdate(maintenanceData.vehicle, {
      status: 'maintenance'
    })
  }

  return maintenance
}

/**
 * Get maintenance log by ID
 */
export const getMaintenanceLogById = async (logId) => {
  const log = await MaintenanceLog.findById(logId)
    .populate('vehicle', 'registrationNumber make model')
    .populate('vendor', 'name')
    .populate('createdBy', 'username fullName')

  if (!log) {
    throw new AppError('Maintenance log not found', 404)
  }

  return log
}

/**
 * Get all maintenance logs with filters
 */
export const getMaintenanceLogs = async (filters = {}, pagination = {}) => {
  const { page = 1, limit = 10, sort = '-maintenanceDate' } = pagination
  const skip = (page - 1) * limit

  const query = MaintenanceLog.find(filters)
    .populate('vehicle', 'registrationNumber make model')
    .populate('vendor', 'name')
    .sort(sort)
    .skip(skip)
    .limit(limit)

  const [logs, total] = await Promise.all([
    query.exec(),
    MaintenanceLog.countDocuments(filters)
  ])

  return {
    logs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }
}

/**
 * Update maintenance log
 */
export const updateMaintenanceLog = async (logId, updateData, userId) => {
  const log = await MaintenanceLog.findById(logId)
  if (!log) {
    throw new AppError('Maintenance log not found', 404)
  }

  const updatedLog = await MaintenanceLog.findByIdAndUpdate(
    logId,
    updateData,
    { new: true, runValidators: true }
  )

  // Update vehicle status based on maintenance status
  if (updateData.status === 'completed') {
    await Vehicle.findByIdAndUpdate(log.vehicle, {
      status: 'available'
    })
  } else if (updateData.status === 'in_progress') {
    await Vehicle.findByIdAndUpdate(log.vehicle, {
      status: 'maintenance'
    })
  }

  return updatedLog
}

/**
 * Get maintenance history for a vehicle
 */
export const getVehicleMaintenanceHistory = async (vehicleId) => {
  const logs = await MaintenanceLog.find({ vehicle: vehicleId })
    .populate('vendor', 'name')
    .sort('-maintenanceDate')

  return logs
}

/**
 * Get upcoming maintenance (based on next service date/mileage)
 */
export const getUpcomingMaintenance = async () => {
  const today = new Date()
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())

  // Find vehicles with upcoming service dates
  const upcomingByDate = await MaintenanceLog.find({
    nextServiceDate: { $lte: nextMonth, $gte: today },
    status: 'completed'
  })
    .populate('vehicle', 'registrationNumber make model mileage')
    .sort('nextServiceDate')

  // Find vehicles approaching service mileage
  const vehicles = await Vehicle.find({ isActive: true })
  const upcomingByMileage = []

  for (const vehicle of vehicles) {
    const lastMaintenance = await MaintenanceLog.findOne({
      vehicle: vehicle._id,
      status: 'completed'
    }).sort('-maintenanceDate')

    if (lastMaintenance && lastMaintenance.nextServiceMileage) {
      const remainingKm = lastMaintenance.nextServiceMileage - vehicle.mileage
      if (remainingKm <= 1000 && remainingKm > 0) {
        upcomingByMileage.push({
          vehicle,
          lastMaintenance,
          remainingKm
        })
      }
    }
  }

  return {
    byDate: upcomingByDate,
    byMileage: upcomingByMileage
  }
}

