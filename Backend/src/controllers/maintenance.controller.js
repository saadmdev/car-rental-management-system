/**
 * Maintenance Controller
 */

import * as maintenanceService from '../services/maintenance.service.js'
import { asyncHandler } from '../middleware/error.middleware.js'

export const createMaintenanceLog = asyncHandler(async (req, res) => {
  const log = await maintenanceService.createMaintenanceLog(req.body, req.user.id)
  res.status(201).json({ success: true, data: log })
})

export const getMaintenanceLogs = asyncHandler(async (req, res) => {
  const { page, limit, sort, ...filters } = req.query
  const result = await maintenanceService.getMaintenanceLogs(filters, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    sort: sort || '-maintenanceDate'
  })
  res.status(200).json({ success: true, data: result.logs, pagination: result.pagination })
})

export const getMaintenanceLogById = asyncHandler(async (req, res) => {
  const log = await maintenanceService.getMaintenanceLogById(req.params.id)
  res.status(200).json({ success: true, data: log })
})

export const updateMaintenanceLog = asyncHandler(async (req, res) => {
  const log = await maintenanceService.updateMaintenanceLog(req.params.id, req.body, req.user.id)
  res.status(200).json({ success: true, data: log })
})

export const getVehicleMaintenanceHistory = asyncHandler(async (req, res) => {
  const logs = await maintenanceService.getVehicleMaintenanceHistory(req.params.vehicleId)
  res.status(200).json({ success: true, data: logs })
})

export const getUpcomingMaintenance = asyncHandler(async (req, res) => {
  const upcoming = await maintenanceService.getUpcomingMaintenance()
  res.status(200).json({ success: true, data: upcoming })
})

