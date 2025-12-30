/**
 * Vehicle Routes
 */

import express from 'express'
import * as vehicleController from '../controllers/vehicle.controller.js'
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js'

const router = express.Router()

router.use(authenticate)
router.use(requireAdmin)

router.post('/', vehicleController.createVehicle)
router.get('/available', vehicleController.getAvailableVehicles)
router.get('/', vehicleController.getVehicles)
router.get('/:id', vehicleController.getVehicleById)
router.put('/:id', vehicleController.updateVehicle)
router.patch('/:id/status', vehicleController.updateVehicleStatus)
router.delete('/:id', vehicleController.deleteVehicle)

export default router

