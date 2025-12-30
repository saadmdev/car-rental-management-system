import mongoose from 'mongoose'

/**
 * Vehicle Model
 * Represents vehicles in the fleet (own or vendor vehicles)
 */

const vehicleSchema = new mongoose.Schema({
  // Basic Information
  registrationNumber: {
    type: String,
    required: [true, 'Registration number is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  make: {
    type: String,
    required: [true, 'Make is required'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Model is required'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1900, 'Invalid year'],
    max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
  },
  color: {
    type: String,
    trim: true
  },
  vehicleType: {
    type: String,
    enum: ['sedan', 'suv', 'hatchback', 'coupe', 'convertible', 'van', 'pickup', 'truck', 'minivan', 'luxury'],
    required: true
  },
  
  // Ownership & Source
  ownershipType: {
    type: String,
    enum: ['own', 'vendor', 'outsourced'],
    required: [true, 'Ownership type is required'],
    default: 'own'
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: function() {
      return this.ownershipType === 'vendor' || this.ownershipType === 'outsourced'
    }
  },
  
  // Specifications
  engine: {
    type: String,
    trim: true
  },
  transmission: {
    type: String,
    enum: ['manual', 'automatic', 'cvt', 'semi-automatic'],
    required: true
  },
  fuelType: {
    type: String,
    enum: ['petrol', 'diesel', 'electric', 'hybrid', 'cng'],
    required: true
  },
  seatingCapacity: {
    type: Number,
    required: true,
    min: 2,
    max: 50
  },
  mileage: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Pricing
  dailyRate: {
    type: Number,
    required: [true, 'Daily rate is required'],
    min: 0
  },
  weeklyRate: {
    type: Number,
    min: 0
  },
  monthlyRate: {
    type: Number,
    min: 0
  },
  kmLimit: {
    type: Number,
    default: 0, // 0 means unlimited
    min: 0
  },
  extraKmRate: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Status & Availability
  status: {
    type: String,
    enum: ['available', 'booked', 'maintenance', 'out_of_service', 'sold'],
    default: 'available'
  },
  location: {
    type: String,
    trim: true
  },
  
  // Documents & Insurance
  insuranceExpiry: {
    type: Date
  },
  registrationExpiry: {
    type: Date
  },
  fitnessExpiry: {
    type: Date
  },
  permitExpiry: {
    type: Date
  },
  
  // Images (array of image URLs)
  images: [{
    type: String,
    trim: true
  }],
  
  // Features/Equipment (array of feature names)
  features: [{
    type: String,
    trim: true
  }],
  notes: {
    type: String,
    trim: true
  },
  
  // Tracking
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminUser'
  }
}, {
  timestamps: true
})

// Indexes for faster queries
vehicleSchema.index({ registrationNumber: 1 })
vehicleSchema.index({ status: 1 })
vehicleSchema.index({ ownershipType: 1 })
vehicleSchema.index({ vehicleType: 1 })
vehicleSchema.index({ vendor: 1 })
vehicleSchema.index({ isActive: 1 })

// Virtual for current booking
vehicleSchema.virtual('currentBooking', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'vehicle',
  justOne: true,
  match: { status: { $in: ['confirmed', 'in_progress'] } }
})

const Vehicle = mongoose.model('Vehicle', vehicleSchema)

export default Vehicle

