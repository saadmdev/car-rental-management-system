/**
 * Reporting Routes
 */

import express from 'express'
import * as reportingController from '../controllers/reporting.controller.js'
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js'

const router = express.Router()

// All routes require authentication and admin role
router.use(authenticate)
router.use(requireAdmin)

// Routes
router.get('/dashboard', reportingController.getDashboardSummary)
router.get('/income-expense', reportingController.getMonthlyIncomeExpenseReport)
router.get('/income-expense/range', reportingController.getIncomeExpenseReportByDateRange)
router.get('/vehicle-performance', reportingController.getVehiclePerformanceReport)
router.get('/vehicles-performance', reportingController.getAllVehiclesPerformanceReport)
router.get('/driver-performance', reportingController.getDriverPerformanceReport)
router.get('/drivers-performance', reportingController.getAllDriversPerformanceReport)

export default router

