/**
 * Maintenance Routes
 */

import express from 'express'
import * as maintenanceController from '../controllers/maintenance.controller.js'
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js'

const router = express.Router()

router.use(authenticate)
router.use(requireAdmin)

router.post('/', maintenanceController.createMaintenanceLog)
router.get('/upcoming', maintenanceController.getUpcomingMaintenance)
router.get('/vehicle/:vehicleId', maintenanceController.getVehicleMaintenanceHistory)
router.get('/', maintenanceController.getMaintenanceLogs)
router.get('/:id', maintenanceController.getMaintenanceLogById)
router.put('/:id', maintenanceController.updateMaintenanceLog)

export default router

