/**
 * Driver Routes
 */

import express from 'express'
import * as driverController from '../controllers/driver.controller.js'
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js'

const router = express.Router()

router.use(authenticate)
router.use(requireAdmin)

router.post('/', driverController.createDriver)
router.get('/active', driverController.getActiveDrivers)
router.get('/', driverController.getDrivers)
router.get('/:id', driverController.getDriverById)
router.put('/:id', driverController.updateDriver)
router.patch('/:id/status', driverController.updateDriverStatus)
router.delete('/:id', driverController.deleteDriver)

export default router

