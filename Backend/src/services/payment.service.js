/**
 * Payment Service
 * Handles payment-related business logic (receivables & payables)
 */

import Payment from '../models/Payment.model.js'
import Booking from '../models/Booking.model.js'
import Customer from '../models/Customer.model.js'
import { AppError } from '../middleware/error.middleware.js'

/**
 * Generate unique payment number
 * Format: PMT-YYYYMMDD-XXXX
 * Where XXXX is a random 4-digit number
 * Includes retry logic to handle collisions
 */
const generatePaymentNumber = async (maxRetries = 10) => {
  const prefix = 'PMT'
  const date = new Date()
  const year = date.getFullYear().toString()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const datePart = `${year}${month}${day}`
  
  // Generate random 4-digit number (0000-9999)
  const generateRandom = () => Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const randomPart = generateRandom()
    const paymentNumber = `${prefix}-${datePart}-${randomPart}`
    
    // Check if this payment number already exists
    const existing = await Payment.findOne({ paymentNumber })
    
    if (!existing) {
      return paymentNumber
    }
    
    // If collision occurs, wait a tiny bit and try again
    if (attempt < maxRetries - 1) {
      await new Promise(resolve => setTimeout(resolve, 10))
    }
  }
  
  // Fallback: use timestamp + random if all retries fail (extremely unlikely)
  const timestamp = Date.now().toString().slice(-8)
  const fallbackRandom = generateRandom()
  return `${prefix}-${timestamp}-${fallbackRandom}`
}

/**
 * Create payment
 */
export const createPayment = async (paymentData, userId) => {
  // Ensure paymentType is set (default to receivable for booking payments)
  if (!paymentData.paymentType && paymentData.booking) {
    paymentData.paymentType = 'receivable'
  }
  
  // Ensure customer is set from booking if not provided
  if (paymentData.booking && !paymentData.customer) {
    const booking = await Booking.findById(paymentData.booking).populate('customer')
    if (booking && booking.customer) {
      paymentData.customer = booking.customer._id || booking.customer
    }
  }

  const paymentNumber = await generatePaymentNumber()

  const payment = await Payment.create({
    ...paymentData,
    paymentNumber,
    status: 'completed', // Payments are completed when recorded
    createdBy: userId
  })

  // Update booking payment status and status if payment is for a booking
  if (paymentData.booking) {
    await updateBookingPaymentStatus(paymentData.booking)
    
    // If booking is completed and now paid, calculate driver income
    const booking = await Booking.findById(paymentData.booking)
    if (booking && booking.status === 'completed' && booking.paymentStatus === 'paid' && booking.driver) {
      await calculateDriverIncomeFromBooking(paymentData.booking)
    }
  }

  // Update customer outstanding balance if receivable
  if (paymentData.paymentType === 'receivable' && paymentData.customer) {
    await updateCustomerBalance(paymentData.customer)
  }

  return payment
}

/**
 * Update booking payment status based on payments
 * Also updates booking status to CONFIRMED if fully paid
 */
const updateBookingPaymentStatus = async (bookingId) => {
  const booking = await Booking.findById(bookingId)
  if (!booking) return

  const payments = await Payment.find({
    booking: bookingId,
    paymentType: 'receivable',
    status: 'completed'
  })

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0)
  const advancePaid = totalPaid
  const balanceAmount = booking.totalAmount - advancePaid

  let paymentStatus = 'pending'
  let bookingStatus = booking.status
  
  if (balanceAmount <= 0) {
    paymentStatus = 'paid'
    // Update booking status to CONFIRMED if it was pending and now fully paid
    if (booking.status === 'pending') {
      bookingStatus = 'confirmed'
    }
  } else if (advancePaid > 0) {
    paymentStatus = 'partial'
    // Update booking status to CONFIRMED if it was pending and partial payment received
    if (booking.status === 'pending') {
      bookingStatus = 'confirmed'
    }
  }

  await Booking.findByIdAndUpdate(bookingId, {
    advancePaid,
    balanceAmount,
    paymentStatus,
    status: bookingStatus
  })

  // If booking is completed and paid, calculate driver income
  if (bookingStatus === 'completed' && paymentStatus === 'paid' && booking.driver) {
    await calculateDriverIncomeFromBooking(bookingId)
  }
}

/**
 * Calculate and store driver income when booking is completed and paid
 */
const calculateDriverIncomeFromBooking = async (bookingId) => {
  const Driver = (await import('../models/Driver.model.js')).default
  const booking = await Booking.findById(bookingId).populate('driver')
  
  if (!booking || !booking.driver) return

  const driver = booking.driver
  const driverCharges = booking.driverCharges || 0
  const driverAllowances = booking.driverAllowances || {
    overtime: 0,
    food: 0,
    outstation: 0,
    parking: 0
  }
  
  const totalAllowances = 
    (driverAllowances.overtime || 0) +
    (driverAllowances.food || 0) +
    (driverAllowances.outstation || 0) +
    (driverAllowances.parking || 0)
  
  const totalEarnings = driverCharges + totalAllowances

  // Update driver stats
  await Driver.findByIdAndUpdate(driver._id, {
    $inc: {
      totalTrips: 1,
      totalKmDriven: booking.totalKm || 0,
      totalEarnings: totalEarnings
    }
  })
}


/**
 * Update customer outstanding balance
 */
const updateCustomerBalance = async (customerId) => {
  const customer = await Customer.findById(customerId)
  if (!customer) return

  // Get all unpaid bookings for this customer
  const unpaidBookings = await Booking.find({
    customer: customerId,
    paymentStatus: { $in: ['pending', 'partial'] }
  })

  const totalOutstanding = unpaidBookings.reduce((sum, booking) => {
    return sum + booking.balanceAmount
  }, 0)

  await Customer.findByIdAndUpdate(customerId, {
    outstandingBalance: totalOutstanding
  })
}

/**
 * Get payment by ID
 */
export const getPaymentById = async (paymentId) => {
  const payment = await Payment.findById(paymentId)
    .populate('booking', 'bookingNumber totalAmount')
    .populate('customer', 'firstName lastName companyName')
    .populate('vendor', 'name')
    .populate('driver', 'firstName lastName')
    .populate('expense', 'expenseNumber totalAmount')
    .populate('createdBy', 'username fullName')

  if (!payment) {
    throw new AppError('Payment not found', 404)
  }

  return payment
}

/**
 * Get all payments with filters
 */
export const getPayments = async (filters = {}, pagination = {}) => {
  const { page = 1, limit = 10, sort = '-paymentDate' } = pagination
  const skip = (page - 1) * limit

  const query = Payment.find(filters)
    .populate('booking', 'bookingNumber')
    .populate('customer', 'firstName lastName companyName')
    .populate('vendor', 'name')
    .populate('driver', 'firstName lastName')
    .sort(sort)
    .skip(skip)
    .limit(limit)

  const [payments, total] = await Promise.all([
    query.exec(),
    Payment.countDocuments(filters)
  ])

  return {
    payments,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }
}

/**
 * Get receivables summary
 */
export const getReceivablesSummary = async (startDate, endDate) => {
  const matchStage = {
    paymentType: 'receivable',
    status: 'completed'
  }
  
  if (startDate || endDate) {
    matchStage.paymentDate = {}
    if (startDate) matchStage.paymentDate.$gte = new Date(startDate)
    if (endDate) matchStage.paymentDate.$lte = new Date(endDate)
  }

  const summary = await Payment.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ])

  return summary[0] || { totalAmount: 0, count: 0 }
}

/**
 * Get payables summary
 */
export const getPayablesSummary = async (startDate, endDate) => {
  const matchStage = {
    paymentType: 'payable',
    status: 'completed'
  }
  
  if (startDate || endDate) {
    matchStage.paymentDate = {}
    if (startDate) matchStage.paymentDate.$gte = new Date(startDate)
    if (endDate) matchStage.paymentDate.$lte = new Date(endDate)
  }

  const summary = await Payment.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ])

  return summary[0] || { totalAmount: 0, count: 0 }
}

/**
 * Get outstanding receivables (unpaid bookings)
 */
export const getOutstandingReceivables = async () => {
  const bookings = await Booking.find({
    paymentStatus: { $in: ['pending', 'partial'] }
  })
    .populate('customer', 'firstName lastName companyName email phone')
    .populate('vehicle', 'registrationNumber make model')
    .sort('-bookingDate')

  return bookings.map(booking => ({
    booking: booking._id,
    bookingNumber: booking.bookingNumber,
    customer: booking.customer,
    vehicle: booking.vehicle,
    totalAmount: booking.totalAmount,
    advancePaid: booking.advancePaid,
    balanceAmount: booking.balanceAmount,
    bookingDate: booking.bookingDate,
    dueDate: booking.returnDate
  }))
}

