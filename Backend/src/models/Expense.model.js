import mongoose from 'mongoose'

/**
 * Expense Model
 * Represents various expenses related to vehicles, drivers, and operations
 */

const expenseSchema = new mongoose.Schema({
  // Expense Information
  expenseNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  expenseDate: {
    type: Date,
    required: [true, 'Expense date is required'],
    default: Date.now
  },
  
  // Expense Category
  category: {
    type: String,
    enum: [
      'fuel',
      'maintenance',
      'repair',
      'insurance',
      'driver_allowance',
      'parking',
      'toll',
      'cleaning',
      'documentation',
      'vendor_payment',
      'office',
      'marketing',
      'other'
    ],
    required: [true, 'Expense category is required']
  },
  
  // Related Entities
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver'
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor'
  },
  
  // Expense Details
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
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
  paymentMethod: {
    type: String,
    enum: ['cash', 'credit_card', 'debit_card', 'bank_transfer', 'check', 'other'],
    default: 'cash'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'paid'
  },
  paidDate: {
    type: Date
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
expenseSchema.index({ expenseDate: 1 })
expenseSchema.index({ category: 1 })
expenseSchema.index({ vehicle: 1 })
expenseSchema.index({ booking: 1 })
expenseSchema.index({ driver: 1 })
expenseSchema.index({ vendor: 1 })
expenseSchema.index({ paymentStatus: 1 })

// Pre-save middleware to calculate total
expenseSchema.pre('save', function(next) {
  this.taxAmount = (this.amount * this.taxRate) / 100
  this.totalAmount = this.amount + this.taxAmount
  next()
})

const Expense = mongoose.model('Expense', expenseSchema)

export default Expense

