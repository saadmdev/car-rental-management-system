/**
 * Reporting Controller
 * Handles HTTP requests for reports and analytics
 */

import * as reportingService from '../services/reporting.service.js'
import { asyncHandler } from '../middleware/error.middleware.js'

/**
 * Get dashboard summary
 */
export const getDashboardSummary = asyncHandler(async (req, res) => {
  const summary = await reportingService.getDashboardSummary()
  
  res.status(200).json({
    success: true,
    data: summary
  })
})

/**
 * Get monthly income vs expenses report
 */
export const getMonthlyIncomeExpenseReport = asyncHandler(async (req, res) => {
  const { year, month } = req.query
  
  const report = await reportingService.getMonthlyIncomeExpenseReport(
    parseInt(year) || new Date().getFullYear(),
    parseInt(month) || new Date().getMonth() + 1
  )
  
  res.status(200).json({
    success: true,
    data: report
  })
})

/**
 * Get income vs expenses report by date range
 */
export const getIncomeExpenseReportByDateRange = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query
  
  if (!startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: 'startDate and endDate are required'
    })
  }
  
  const report = await reportingService.getIncomeExpenseReportByDateRange(startDate, endDate)
  
  res.status(200).json({
    success: true,
    data: report
  })
})

/**
 * Get vehicle performance report
 */
export const getVehiclePerformanceReport = asyncHandler(async (req, res) => {
  const { vehicleId, startDate, endDate } = req.query
  
  const report = await reportingService.getVehiclePerformanceReport(
    vehicleId,
    startDate,
    endDate
  )
  
  res.status(200).json({
    success: true,
    data: report
  })
})

/**
 * Get driver performance report
 */
export const getDriverPerformanceReport = asyncHandler(async (req, res) => {
  const { driverId, startDate, endDate } = req.query
  
  const report = await reportingService.getDriverPerformanceReport(
    driverId,
    startDate,
    endDate
  )
  
  res.status(200).json({
    success: true,
    data: report
  })
})

/**
 * Get all vehicles performance report
 */
export const getAllVehiclesPerformanceReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query
  
  const report = await reportingService.getAllVehiclesPerformanceReport(startDate, endDate)
  
  res.status(200).json({
    success: true,
    data: report
  })
})

/**
 * Get all drivers performance report
 */
export const getAllDriversPerformanceReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query
  
  const report = await reportingService.getAllDriversPerformanceReport(startDate, endDate)
  
  res.status(200).json({
    success: true,
    data: report
  })
})

