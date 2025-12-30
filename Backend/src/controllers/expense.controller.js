/**
 * Expense Controller
 * Handles HTTP requests for expense operations
 */

import * as expenseService from '../services/expense.service.js'
import { asyncHandler } from '../middleware/error.middleware.js'

/**
 * Create a new expense
 */
export const createExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.createExpense(req.body, req.user.id)
  
  res.status(201).json({
    success: true,
    data: expense
  })
})

/**
 * Get all expenses
 */
export const getExpenses = asyncHandler(async (req, res) => {
  const { page, limit, sort, ...filters } = req.query
  
  const result = await expenseService.getExpenses(filters, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    sort: sort || '-expenseDate'
  })
  
  res.status(200).json({
    success: true,
    data: result.expenses,
    pagination: result.pagination
  })
})

/**
 * Get expense by ID
 */
export const getExpenseById = asyncHandler(async (req, res) => {
  const expense = await expenseService.getExpenseById(req.params.id)
  
  res.status(200).json({
    success: true,
    data: expense
  })
})

/**
 * Get expense summary
 */
export const getExpenseSummary = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query
  
  const summary = await expenseService.getExpenseSummary(startDate, endDate)
  
  res.status(200).json({
    success: true,
    data: summary
  })
})

/**
 * Get total expenses
 */
export const getTotalExpenses = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query
  
  const total = await expenseService.getTotalExpenses(startDate, endDate)
  
  res.status(200).json({
    success: true,
    data: total
  })
})

