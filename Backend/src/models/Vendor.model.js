import mongoose from 'mongoose'

/**
 * Vendor Model
 * Represents external vendors who provide vehicles for rental
 */

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vendor name is required'],
    trim: true
  },
  contactPerson: {
    type: String,
    required: [true, 'Contact person is required'],
    trim: true
  },
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
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  taxId: {
    type: String,
    trim: true
  },
  paymentTerms: {
    type: String,
    enum: ['net_15', 'net_30', 'net_45', 'net_60', 'cash'],
    default: 'net_30'
  },
  commissionRate: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminUser'
  }
}, {
  timestamps: true
})

// Index for faster queries
vendorSchema.index({ name: 1 })
vendorSchema.index({ email: 1 })
vendorSchema.index({ isActive: 1 })

const Vendor = mongoose.model('Vendor', vendorSchema)

export default Vendor

