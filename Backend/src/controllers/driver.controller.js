/**
 * Driver Controller
 */

import * as driverService from '../services/driver.service.js'
import { asyncHandler } from '../middleware/error.middleware.js'

export const createDriver = asyncHandler(async (req, res) => {
  const driver = await driverService.createDriver(req.body, req.user.id)
  res.status(201).json({ success: true, data: driver })
})

export const getDrivers = asyncHandler(async (req, res) => {
  const { page, limit, sort, ...filters } = req.query
  const result = await driverService.getDrivers(filters, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    sort: sort || '-createdAt'
  })
  res.status(200).json({ success: true, data: result.drivers, pagination: result.pagination })
})

export const getDriverById = asyncHandler(async (req, res) => {
  const driver = await driverService.getDriverById(req.params.id)
  res.status(200).json({ success: true, data: driver })
})

export const updateDriver = asyncHandler(async (req, res) => {
  const driver = await driverService.updateDriver(req.params.id, req.body, req.user.id)
  res.status(200).json({ success: true, data: driver })
})

export const updateDriverStatus = asyncHandler(async (req, res) => {
  const { status } = req.body
  const driver = await driverService.updateDriverStatus(req.params.id, status)
  res.status(200).json({ success: true, data: driver })
})

export const getActiveDrivers = asyncHandler(async (req, res) => {
  const drivers = await driverService.getActiveDrivers()
  res.status(200).json({ success: true, data: drivers })
})

export const deleteDriver = asyncHandler(async (req, res) => {
  await driverService.deleteDriver(req.params.id)
  res.status(200).json({ success: true, message: 'Driver deleted successfully' })
})

