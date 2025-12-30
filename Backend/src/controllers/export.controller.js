/**
 * Export Controller
 * Handles Excel export requests
 */

import * as exportService from '../services/export.service.js'
import { asyncHandler } from '../middleware/error.middleware.js'

/**
 * Export bookings to Excel
 */
export const exportBookings = asyncHandler(async (req, res) => {
  const filters = req.query
  const workbook = await exportService.exportBookingsToExcel(filters)

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  )
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=bookings-${new Date().toISOString().split('T')[0]}.xlsx`
  )

  await workbook.xlsx.write(res)
  res.end()
})

/**
 * Export expenses to Excel
 */
export const exportExpenses = asyncHandler(async (req, res) => {
  const filters = req.query
  const workbook = await exportService.exportExpensesToExcel(filters)

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  )
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=expenses-${new Date().toISOString().split('T')[0]}.xlsx`
  )

  await workbook.xlsx.write(res)
  res.end()
})

/**
 * Export payments to Excel
 */
export const exportPayments = asyncHandler(async (req, res) => {
  const filters = req.query
  const workbook = await exportService.exportPaymentsToExcel(filters)

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  )
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=payments-${new Date().toISOString().split('T')[0]}.xlsx`
  )

  await workbook.xlsx.write(res)
  res.end()
})

/**
 * Export income vs expenses to Excel
 */
export const exportIncomeExpense = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query

  if (!startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: 'startDate and endDate are required',
    })
  }

  const workbook = await exportService.exportIncomeExpenseToExcel(startDate, endDate)

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  )
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=income-expense-${new Date().toISOString().split('T')[0]}.xlsx`
  )

  await workbook.xlsx.write(res)
  res.end()
})

