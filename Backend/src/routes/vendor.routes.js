/**
 * Vendor Routes
 */

import express from 'express'
import * as vendorController from '../controllers/vendor.controller.js'
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js'

const router = express.Router()

router.use(authenticate)
router.use(requireAdmin)

router.post('/', vendorController.createVendor)
router.get('/active', vendorController.getActiveVendors)
router.get('/', vendorController.getVendors)
router.get('/:id', vendorController.getVendorById)
router.put('/:id', vendorController.updateVendor)
router.patch('/:id/deactivate', vendorController.deactivateVendor)

export default router

