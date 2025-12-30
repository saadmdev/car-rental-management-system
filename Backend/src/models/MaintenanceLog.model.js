import mongoose from 'mongoose'

/**
 * MaintenanceLog Model
 * Tracks vehicle maintenance, repairs, and service history
 */

const maintenanceLogSchema = new mongoose.Schema({
  // Maintenance Information
  logNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  maintenanceDate: {
    type: Date,
    required: [true, 'Maintenance date is required'],
    default: Date.now
  },
  
  // Vehicle
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: [true, 'Vehicle is required']
  },
  
  // Maintenance Type
  maintenanceType: {
    type: String,
    enum: [
      'routine_service',
      'oil_change',
      'tire_replacement',
      'battery_replacement',
      'brake_service',
      'engine_repair',
      'transmission_repair',
      'ac_service',
      'body_repair',
      'accident_repair',
      'inspection',
      'other'
    ],
    required: [true, 'Maintenance type is required']
  },
  
  // Service Details
  serviceProvider: {
    type: String,
    trim: true
  },
  serviceProviderType: {
    type: String,
    enum: ['internal', 'external', 'vendor'],
    default: 'external'
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor'
  },
  
  // Cost Information
  laborCost: {
    type: Number,
    default: 0,
    min: 0
  },
  partsCost: {
    type: Number,
    default: 0,
    min: 0
  },
  totalCost: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Mileage Information
  mileageAtService: {
    type: Number,
    required: true,
    min: 0
  },
  nextServiceMileage: {
    type: Number,
    min: 0
  },
  nextServiceDate: {
    type: Date
  },
  
  // Work Done
  workDescription: {
    type: String,
    required: [true, 'Work description is required'],
    trim: true
  },
  partsReplaced: [{
    name: String,
    partNumber: String,
    quantity: Number,
    cost: Number
  }],
  
  // Status
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
    default: 'completed'
  },
  
  // Documents
  invoiceNumber: {
    type: String,
    trim: true
  },
  invoiceImage: {
    type: String, // Document URL
    trim: true
  },
  warrantyInfo: {
    type: String,
    trim: true
  },
  warrantyExpiry: {
    type: Date
  },
  
  // Additional Information
  notes: {
    type: String,
    trim: true
  },
  
  // Tracking
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminUser',
    required: true
  }
}, {
  timestamps: true
})

// Indexes
maintenanceLogSchema.index({ maintenanceDate: 1 })
maintenanceLogSchema.index({ vehicle: 1 })
maintenanceLogSchema.index({ maintenanceType: 1 })
maintenanceLogSchema.index({ status: 1 })
maintenanceLogSchema.index({ logNumber: 1 })

// Pre-save middleware to calculate total
maintenanceLogSchema.pre('save', function(next) {
  this.totalCost = this.laborCost + this.partsCost
  next()
})

const MaintenanceLog = mongoose.model('MaintenanceLog', maintenanceLogSchema)

export default MaintenanceLog

