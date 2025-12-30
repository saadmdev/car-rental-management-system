import mongoose from 'mongoose'

/**
 * Customer Model
 * Represents customers (individual or company) who rent vehicles
 */

const customerSchema = new mongoose.Schema({
  // Customer Type
  customerType: {
    type: String,
    enum: ['individual', 'company'],
    required: [true, 'Customer type is required'],
    default: 'individual'
  },
  
  // Individual Customer Fields
  firstName: {
    type: String,
    trim: true,
    required: function() {
      return this.customerType === 'individual'
    }
  },
  lastName: {
    type: String,
    trim: true,
    required: function() {
      return this.customerType === 'individual'
    }
  },
  
  // Company Fields
  companyName: {
    type: String,
    trim: true,
    required: function() {
      return this.customerType === 'company'
    }
  },
  contactPerson: {
    type: String,
    trim: true
  },
  taxId: {
    type: String,
    trim: true
  },
  
  // Contact Information
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  alternatePhone: {
    type: String,
    trim: true
  },
  
  // Address
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  
  // License Information (for individuals)
  licenseNumber: {
    type: String,
    trim: true
  },
  licenseExpiry: {
    type: Date
  },
  licenseIssuedBy: {
    type: String,
    trim: true
  },
  
  // Payment Information
  paymentMethod: {
    type: String,
    enum: ['cash', 'credit_card', 'debit_card', 'bank_transfer', 'check', 'other'],
    default: 'cash'
  },
  creditLimit: {
    type: Number,
    default: 0,
    min: 0
  },
  outstandingBalance: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Status & Preferences
  status: {
    type: String,
    enum: ['active', 'inactive', 'blacklisted'],
    default: 'active'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  preferredVehicleType: {
    type: String,
    enum: ['sedan', 'suv', 'hatchback', 'coupe', 'convertible', 'van', 'pickup', 'minivan', 'luxury']
  },
  
  // Additional Information
  dateOfBirth: {
    type: Date
  },
  idProof: {
    type: String, // Document URL
    trim: true
  },
  addressProof: {
    type: String, // Document URL
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  
  // Tracking
  totalBookings: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0,
    min: 0
  },
  lastBookingDate: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminUser'
  }
}, {
  timestamps: true
})

// Indexes
customerSchema.index({ email: 1 })
customerSchema.index({ phone: 1 })
customerSchema.index({ customerType: 1 })
customerSchema.index({ status: 1 })
customerSchema.index({ isActive: 1 })
customerSchema.index({ companyName: 1 })

// Virtual for full name
customerSchema.virtual('fullName').get(function() {
  if (this.customerType === 'individual') {
    return `${this.firstName} ${this.lastName}`.trim()
  }
  return this.companyName
})

const Customer = mongoose.model('Customer', customerSchema)

export default Customer

