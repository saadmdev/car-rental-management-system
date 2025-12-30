/**
 * Vehicle Controller
 */

import * as vehicleService from '../services/vehicle.service.js'
import { asyncHandler } from '../middleware/error.middleware.js'

export const createVehicle = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.createVehicle(req.body, req.user.id)
  res.status(201).json({ success: true, data: vehicle })
})

export const getVehicles = asyncHandler(async (req, res) => {
  const { page, limit, sort, ...filters } = req.query
  const result = await vehicleService.getVehicles(filters, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    sort: sort || '-createdAt'
  })
  res.status(200).json({ success: true, data: result.vehicles, pagination: result.pagination })
})

export const getVehicleById = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.getVehicleById(req.params.id)
  res.status(200).json({ success: true, data: vehicle })
})

export const updateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.updateVehicle(req.params.id, req.body, req.user.id)
  res.status(200).json({ success: true, data: vehicle })
})

export const updateVehicleStatus = asyncHandler(async (req, res) => {
  const { status } = req.body
  const vehicle = await vehicleService.updateVehicleStatus(req.params.id, status)
  res.status(200).json({ success: true, data: vehicle })
})

export const getAvailableVehicles = asyncHandler(async (req, res) => {
  const vehicles = await vehicleService.getAvailableVehicles(req.query)
  res.status(200).json({ success: true, data: vehicles })
})

export const deleteVehicle = asyncHandler(async (req, res) => {
  await vehicleService.deleteVehicle(req.params.id)
  res.status(200).json({ success: true, message: 'Vehicle deleted successfully' })
})

