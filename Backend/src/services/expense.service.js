/**
 * Expense Service
 * Handles expense-related business logic
 */

import Expense from '../models/Expense.model.js'
import { AppError } from '../middleware/error.middleware.js'

/**
 * Generate unique expense number
 */
const generateExpenseNumber = async () => {
  const prefix = 'EXP'
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const lastExpense = await Expense.findOne({
    expenseDate: { $gte: today }
  }).sort({ expenseNumber: -1 })
  
  let sequence = 1
  if (lastExpense) {
    const lastSeq = parseInt(lastExpense.expenseNumber.slice(-4)) || 0
    sequence = lastSeq + 1
  }
  
  return `${prefix}${year}${month}${sequence.toString().padStart(4, '0')}`
}

/**
 * Create expense
 */
export const createExpense = async (expenseData, userId) => {
  const expenseNumber = await generateExpenseNumber()

  const expense = await Expense.create({
    ...expenseData,
    expenseNumber,
    createdBy: userId
  })

  return expense
}

/**
 * Get expense by ID
 */
export const getExpenseById = async (expenseId) => {
  const expense = await Expense.findById(expenseId)
    .populate('vehicle', 'registrationNumber make model')
    .populate('booking', 'bookingNumber')
    .populate('driver', 'firstName lastName')
    .populate('vendor', 'name')
    .populate('createdBy', 'username fullName')

  if (!expense) {
    throw new AppError('Expense not found', 404)
  }

  return expense
}

/**
 * Get all expenses with filters
 */
export const getExpenses = async (filters = {}, pagination = {}) => {
  const { page = 1, limit = 10, sort = '-expenseDate' } = pagination
  const skip = (page - 1) * limit

  const query = Expense.find(filters)
    .populate('vehicle', 'registrationNumber make model')
    .populate('booking', 'bookingNumber')
    .populate('driver', 'firstName lastName')
    .populate('vendor', 'name')
    .sort(sort)
    .skip(skip)
    .limit(limit)

  const [expenses, total] = await Promise.all([
    query.exec(),
    Expense.countDocuments(filters)
  ])

  return {
    expenses,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }
}

/**
 * Get expense summary by category
 */
export const getExpenseSummary = async (startDate, endDate) => {
  const matchStage = {}
  
  if (startDate || endDate) {
    matchStage.expenseDate = {}
    if (startDate) matchStage.expenseDate.$gte = new Date(startDate)
    if (endDate) matchStage.expenseDate.$lte = new Date(endDate)
  }

  const summary = await Expense.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$category',
        totalAmount: { $sum: '$totalAmount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { totalAmount: -1 } }
  ])

  return summary
}

/**
 * Get total expenses for a period
 */
export const getTotalExpenses = async (startDate, endDate) => {
  const matchStage = {}
  
  if (startDate || endDate) {
    matchStage.expenseDate = {}
    if (startDate) matchStage.expenseDate.$gte = new Date(startDate)
    if (endDate) matchStage.expenseDate.$lte = new Date(endDate)
  }

  const result = await Expense.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$totalAmount' },
        count: { $sum: 1 }
      }
    }
  ])

  return result[0] || { totalAmount: 0, count: 0 }
}

