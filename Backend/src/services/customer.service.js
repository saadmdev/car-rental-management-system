/**
 * Customer Service
 * Handles customer-related business logic
 */

import Customer from '../models/Customer.model.js'
import Booking from '../models/Booking.model.js'
import { AppError } from '../middleware/error.middleware.js'

/**
 * Create a new customer
 */
export const createCustomer = async (customerData, userId) => {
  // Check if email already exists
  const existing = await Customer.findOne({
    email: customerData.email.toLowerCase()
  })
  
  if (existing) {
    throw new AppError('Customer with this email already exists', 400)
  }

  const customer = await Customer.create({
    ...customerData,
    email: customerData.email.toLowerCase(),
    createdBy: userId
  })

  return customer
}

/**
 * Get customer by ID
 */
export const getCustomerById = async (customerId) => {
  const customer = await Customer.findById(customerId)
    .populate('createdBy', 'username fullName')

  if (!customer) {
    throw new AppError('Customer not found', 404)
  }

  return customer
}

/**
 * Get all customers with filters
 */
export const getCustomers = async (filters = {}, pagination = {}) => {
  const { page = 1, limit = 10, sort = '-createdAt' } = pagination
  const skip = (page - 1) * limit

  // Only show active customers by default unless explicitly filtered
  const queryFilters = { ...filters }
  if (queryFilters.isActive === undefined) {
    queryFilters.isActive = true
  }

  const query = Customer.find(queryFilters)
    .sort(sort)
    .skip(skip)
    .limit(limit)

  const [customers, total] = await Promise.all([
    query.exec(),
    Customer.countDocuments(queryFilters)
  ])

  return {
    customers,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }
}

/**
 * Update customer
 */
export const updateCustomer = async (customerId, updateData, userId) => {
  const customer = await Customer.findById(customerId)
  if (!customer) {
    throw new AppError('Customer not found', 404)
  }

  // If email is being updated, check for duplicates
  if (updateData.email) {
    const existing = await Customer.findOne({
      email: updateData.email.toLowerCase(),
      _id: { $ne: customerId }
    })
    
    if (existing) {
      throw new AppError('Customer with this email already exists', 400)
    }
    
    updateData.email = updateData.email.toLowerCase()
  }

  const updatedCustomer = await Customer.findByIdAndUpdate(
    customerId,
    updateData,
    { new: true, runValidators: true }
  )

  return updatedCustomer
}

/**
 * Get customer booking history
 */
export const getCustomerBookings = async (customerId) => {
  const customer = await Customer.findById(customerId)
  if (!customer) {
    throw new AppError('Customer not found', 404)
  }

  const bookings = await Booking.find({ customer: customerId })
    .populate('vehicle', 'registrationNumber make model')
    .populate('driver', 'firstName lastName')
    .sort('-bookingDate')

  return bookings
}

/**
 * Update customer statistics
 */
export const updateCustomerStats = async (customerId) => {
  const bookings = await Booking.find({ customer: customerId })
  
  const totalBookings = bookings.length
  const totalSpent = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0)
  const lastBookingDate = bookings.length > 0 
    ? bookings[0].bookingDate 
    : null

  await Customer.findByIdAndUpdate(customerId, {
    totalBookings,
    totalSpent,
    lastBookingDate
  })
}

/**
 * Deactivate customer (soft delete)
 */
export const deactivateCustomer = async (customerId) => {
  const customer = await Customer.findById(customerId)
  
  if (!customer) {
    throw new AppError('Customer not found', 404)
  }

  // Check if customer has active or upcoming bookings
  const activeBookings = await Booking.countDocuments({
    customer: customerId,
    status: { $in: ['pending', 'confirmed', 'in_progress'] }
  })
  
  if (activeBookings > 0) {
    throw new AppError('Cannot deactivate customer with active or upcoming bookings', 400)
  }

  // Soft delete: set isActive to false
  const updatedCustomer = await Customer.findByIdAndUpdate(
    customerId,
    { isActive: false, status: 'inactive' },
    { new: true }
  )

  return updatedCustomer
}

