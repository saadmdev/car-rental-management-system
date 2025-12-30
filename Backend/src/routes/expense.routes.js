/**
 * Expense Routes
 */

import express from 'express'
import * as expenseController from '../controllers/expense.controller.js'
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js'

const router = express.Router()

// All routes require authentication and admin role
router.use(authenticate)
router.use(requireAdmin)

// Routes
router.post('/', expenseController.createExpense)
router.get('/', expenseController.getExpenses)
router.get('/summary', expenseController.getExpenseSummary)
router.get('/total', expenseController.getTotalExpenses)
router.get('/:id', expenseController.getExpenseById)

export default router

