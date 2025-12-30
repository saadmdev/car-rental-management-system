import mongoose from 'mongoose'

/**
 * Payment Model
 * Represents payments received from customers or made to vendors/drivers
 */

const paymentSchema = new mongoose.Schema({
  // Payment Information
  paymentNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  paymentDate: {
    type: Date,
    required: [true, 'Payment date is required'],
    default: Date.now
  },
  
  // Payment Type
  paymentType: {
    type: String,
    enum: ['receivable', 'payable'],
    required: [true, 'Payment type is required']
  },
  
  // Related Entities
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor'
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver'
  },
  expense: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expense'
  },
  
  // Payment Details
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'credit_card', 'debit_card', 'bank_transfer', 'check', 'upi', 'other'],
    required: [true, 'Payment method is required']
  },
  
  // Transaction Details
  transactionId: {
    type: String,
    trim: true
  },
  bankName: {
    type: String,
    trim: true
  },
  checkNumber: {
    type: String,
    trim: true
  },
  checkDate: {
    type: Date
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'completed'
  },
  
  // Description
  description: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  
  // Receipt/Document
  receiptNumber: {
    type: String,
    trim: true
  },
  receiptImage: {
    type: String, // Document URL
    trim: true
  },
  
  // Tracking
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminUser',
    required: false, // Optional for public booking payments
    default: null // Explicitly allow null for public bookings
  }
}, {
  timestamps: true
})

// Indexes
paymentSchema.index({ paymentDate: 1 })
paymentSchema.index({ paymentType: 1 })
paymentSchema.index({ booking: 1 })
paymentSchema.index({ customer: 1 })
paymentSchema.index({ vendor: 1 })
paymentSchema.index({ driver: 1 })
paymentSchema.index({ status: 1 })
paymentSchema.index({ paymentNumber: 1 })

const Payment = mongoose.model('Payment', paymentSchema)

export default Payment

