import mongoose from 'mongoose'

/**
 * Booking Model
 * Represents vehicle rental bookings with driver and customer assignment
 */

const bookingSchema = new mongoose.Schema({
  // Booking Information
  bookingNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  
  // Rental Type
  rentalType: {
    type: String,
    enum: ['own', 'vendor', 'outsourced'],
    required: [true, 'Rental type is required'],
    default: 'own'
  },
  
  // Vehicle Assignment
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: [true, 'Vehicle is required']
  },
  
  // Driver Assignment
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver'
  },
  driverRequired: {
    type: Boolean,
    default: false
  },
  
  // Customer Information
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Customer is required']
  },
  
  // Rental Period
  pickupDate: {
    type: Date,
    required: [true, 'Pickup date is required']
  },
  pickupTime: {
    type: String,
    required: [true, 'Pickup time is required']
  },
  pickupLocation: {
    type: String,
    required: [true, 'Pickup location is required'],
    trim: true
  },
  returnDate: {
    type: Date,
    required: [true, 'Return date is required']
  },
  returnTime: {
    type: String,
    required: [true, 'Return time is required']
  },
  returnLocation: {
    type: String,
    trim: true
  },
  
  // Mileage Tracking
  startMileage: {
    type: Number,
    min: 0
  },
  endMileage: {
    type: Number,
    min: 0
  },
  totalKm: {
    type: Number,
    default: 0,
    min: 0
  },
  allowedKm: {
    type: Number,
    default: 0,
    min: 0
  },
  extraKm: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Pricing
  dailyRate: {
    type: Number,
    required: true,
    min: 0
  },
  numberOfDays: {
    type: Number,
    required: true,
    min: 1
  },
  baseAmount: {
    type: Number,
    required: true,
    min: 0
  },
  extraKmCharges: {
    type: Number,
    default: 0,
    min: 0
  },
  driverCharges: {
    type: Number,
    default: 0,
    min: 0
  },
  driverAllowances: {
    overtime: { type: Number, default: 0, min: 0 },
    food: { type: Number, default: 0, min: 0 },
    outstation: { type: Number, default: 0, min: 0 },
    parking: { type: Number, default: 0, min: 0 }
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  taxRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  taxAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Payment Information
  advancePaid: {
    type: Number,
    default: 0,
    min: 0
  },
  balanceAmount: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'refunded'],
    default: 'pending'
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  
  // Vendor Information (if rental type is vendor/outsourced)
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor'
  },
  vendorCommission: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Additional Information
  specialInstructions: {
    type: String,
    trim: true
  },
  cancellationReason: {
    type: String,
    trim: true
  },
  cancelledAt: {
    type: Date
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminUser'
  },
  
  // Tracking
  actualPickupDate: {
    type: Date
  },
  actualReturnDate: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminUser',
    required: false, // Optional for public bookings
    default: null // Explicitly allow null for public bookings
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminUser'
  }
}, {
  timestamps: true
})

// Indexes
bookingSchema.index({ bookingNumber: 1 })
bookingSchema.index({ vehicle: 1 })
bookingSchema.index({ customer: 1 })
bookingSchema.index({ driver: 1 })
bookingSchema.index({ status: 1 })
bookingSchema.index({ rentalType: 1 })
bookingSchema.index({ pickupDate: 1 })
bookingSchema.index({ returnDate: 1 })
bookingSchema.index({ bookingDate: 1 })

// Pre-save middleware to calculate fields
bookingSchema.pre('save', function(next) {
  // Calculate number of days
  if (this.pickupDate && this.returnDate) {
    const diffTime = Math.abs(this.returnDate - this.pickupDate)
    this.numberOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1
  }
  
  // Calculate total km
  if (this.startMileage && this.endMileage) {
    this.totalKm = Math.max(0, this.endMileage - this.startMileage)
    this.extraKm = Math.max(0, this.totalKm - (this.allowedKm || 0))
  }
  
  // Calculate balance
  this.balanceAmount = this.totalAmount - this.advancePaid
  
  next()
})

const Booking = mongoose.model('Booking', bookingSchema)

export default Booking

