/**
 * Booking Service
 * Handles all booking-related business logic and calculations
 */

import Booking from '../models/Booking.model.js'
import Vehicle from '../models/Vehicle.model.js'
import { AppError } from '../middleware/error.middleware.js'

/**
 * Generate unique booking number
 * Format: CR-YYYYMMDD-XXXX
 * Where XXXX is a random 4-digit number
 * Includes retry logic to handle collisions
 */
const generateBookingNumber = async (maxRetries = 10) => {
  const prefix = 'CR'
  const date = new Date()
  const year = date.getFullYear().toString()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const datePart = `${year}${month}${day}`
  
  // Generate random 4-digit number (0000-9999)
  const generateRandom = () => Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const randomPart = generateRandom()
    const bookingNumber = `${prefix}-${datePart}-${randomPart}`
    
    // Check if this booking number already exists
    const existing = await Booking.findOne({ bookingNumber })
    
    if (!existing) {
      return bookingNumber
    }
    
    // If collision occurs, wait a tiny bit and try again
    // This is extremely rare but handled for safety
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
 * Calculate number of days between two dates
 */
const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end - start)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1
}

/**
 * Calculate booking pricing
 */
export const calculateBookingPricing = async (bookingData) => {
  const {
    vehicle,
    pickupDate,
    returnDate,
    startMileage,
    endMileage,
    driver,
    driverRequired,
    rentalType,
    vendor
  } = bookingData

  // Get vehicle details
  const vehicleDoc = await Vehicle.findById(vehicle)
  if (!vehicleDoc) {
    throw new AppError('Vehicle not found', 404)
  }

  // Calculate number of days
  const numberOfDays = calculateDays(pickupDate, returnDate)

  // Base amount calculation
  let baseAmount = 0
  if (numberOfDays >= 30 && vehicleDoc.monthlyRate > 0) {
    const months = Math.floor(numberOfDays / 30)
    const remainingDays = numberOfDays % 30
    baseAmount = (months * vehicleDoc.monthlyRate) + (remainingDays * vehicleDoc.dailyRate)
  } else if (numberOfDays >= 7 && vehicleDoc.weeklyRate > 0) {
    const weeks = Math.floor(numberOfDays / 7)
    const remainingDays = numberOfDays % 7
    baseAmount = (weeks * vehicleDoc.weeklyRate) + (remainingDays * vehicleDoc.dailyRate)
  } else {
    baseAmount = numberOfDays * vehicleDoc.dailyRate
  }

  // Extra KM calculation
  let extraKm = 0
  let extraKmCharges = 0
  if (startMileage && endMileage) {
    const totalKm = Math.max(0, endMileage - startMileage)
    const allowedKm = vehicleDoc.kmLimit > 0 
      ? (numberOfDays * vehicleDoc.kmLimit) 
      : totalKm
    extraKm = Math.max(0, totalKm - allowedKm)
    extraKmCharges = extraKm * vehicleDoc.extraKmRate
  }

  // Driver charges (will be calculated in driver service)
  let driverCharges = 0
  let driverAllowances = {
    overtime: 0,
    food: 0,
    outstation: 0,
    parking: 0
  }

  // Vendor commission (if vendor rental)
  let vendorCommission = 0
  if ((rentalType === 'vendor' || rentalType === 'outsourced') && vendor) {
    // Commission calculation will be handled separately
    vendorCommission = 0 // Placeholder
  }

  // Apply discount
  const discount = bookingData.discount || 0
  const amountAfterDiscount = baseAmount + extraKmCharges - discount

  // Calculate tax
  const taxRate = bookingData.taxRate || 0
  const taxAmount = (amountAfterDiscount * taxRate) / 100

  // Total amount
  const totalAmount = amountAfterDiscount + taxAmount + driverCharges

  return {
    numberOfDays,
    baseAmount,
    extraKm,
    extraKmCharges,
    driverCharges,
    driverAllowances,
    discount,
    taxRate,
    taxAmount,
    vendorCommission,
    totalAmount
  }
}

/**
 * Calculate driver charges and allowances
 */
const calculateDriverCharges = async (driverId, bookingData) => {
  if (!driverId || !bookingData.driverRequired) {
    return {
      driverCharges: 0,
      driverAllowances: {
        overtime: 0,
        food: 0,
        outstation: 0,
        parking: 0
      }
    }
  }

  const Driver = (await import('../models/Driver.model.js')).default
  const driver = await Driver.findById(driverId)
  if (!driver) {
    throw new AppError('Driver not found', 404)
  }

  const { pickupDate, returnDate, pickupLocation, returnLocation } = bookingData
  const numberOfDays = calculateDays(pickupDate, returnDate)
  
  let driverCharges = 0
  const allowances = {
    overtime: 0,
    food: 0,
    outstation: 0,
    parking: 0
  }

  // Food allowance
  if (driver.allowances.food.enabled) {
    allowances.food = numberOfDays * driver.allowances.food.dailyRate
  }

  // Outstation allowance (if pickup and return locations are different)
  if (driver.allowances.outstation.enabled && 
      pickupLocation && returnLocation && 
      pickupLocation.toLowerCase() !== returnLocation.toLowerCase()) {
    allowances.outstation = numberOfDays * driver.allowances.outstation.dailyRate
  }

  // Parking allowance
  if (driver.allowances.parking.enabled) {
    allowances.parking = numberOfDays * driver.allowances.parking.dailyRate
  }

  // Overtime calculation (assuming 8 hours per day standard)
  if (driver.allowances.overtime.enabled) {
    const standardHoursPerDay = 8
    const totalHours = numberOfDays * 24 // Simplified calculation
    const overtimeHours = Math.max(0, totalHours - (numberOfDays * driver.allowances.overtime.hoursThreshold))
    
    if (overtimeHours > 0) {
      allowances.overtime = overtimeHours * driver.allowances.overtime.ratePerHour
    }
  }

  driverCharges = allowances.overtime + allowances.food + allowances.outstation + allowances.parking

  return {
    driverCharges,
    driverAllowances: allowances
  }
}

/**
 * Create a new booking
 */
export const createBooking = async (bookingData, userId) => {
  // Validate dates
  if (bookingData.pickupDate && bookingData.returnDate) {
    const pickupDate = new Date(bookingData.pickupDate)
    const returnDate = new Date(bookingData.returnDate)
    if (returnDate <= pickupDate) {
      throw new AppError('Return date must be after pickup date', 400)
    }
  }

  // Validate driver if assigned
  if (bookingData.driver && bookingData.driverRequired) {
    const Driver = (await import('../models/Driver.model.js')).default
    const driver = await Driver.findById(bookingData.driver)
    if (!driver) {
      throw new AppError('Driver not found', 404)
    }
    if (driver.status !== 'active') {
      throw new AppError('Only active drivers can be assigned to bookings', 400)
    }
  }

  // Generate booking number
  const bookingNumber = await generateBookingNumber()

  // Get vehicle to validate and get dailyRate
  const vehicle = await Vehicle.findById(bookingData.vehicle)
  if (!vehicle) {
    throw new AppError('Vehicle not found', 404)
  }
  const dailyRate = vehicle.dailyRate
  if (!dailyRate || dailyRate <= 0) {
    throw new AppError('Vehicle daily rate is not set', 400)
  }

  // Calculate pricing
  const pricing = await calculateBookingPricing(bookingData)

  // Calculate driver charges if driver is assigned
  if (bookingData.driver && bookingData.driverRequired) {
    const driverCharges = await calculateDriverCharges(bookingData.driver, bookingData)
    pricing.driverCharges = driverCharges.driverCharges
    pricing.driverAllowances = driverCharges.driverAllowances
    pricing.totalAmount += driverCharges.driverCharges
  }

  // Exclude bookingNumber from bookingData (always generated server-side)
  const { bookingNumber: _, ...cleanBookingData } = bookingData
  
  // Create booking
  const booking = await Booking.create({
    ...cleanBookingData,
    bookingNumber,
    createdBy: userId,
    dailyRate: dailyRate, // Use vehicle's dailyRate (validated)
    ...pricing,
    balanceAmount: pricing.totalAmount - (bookingData.advancePaid || 0)
  })

  // Auto-create payment record with status PENDING (only if one doesn't exist)
  const Payment = (await import('../models/Payment.model.js')).default
  const existingPayment = await Payment.findOne({
    booking: booking._id,
    paymentType: 'receivable',
    status: 'pending'
  })
  
  if (!existingPayment) {
    // Generate payment number using same format as payment service
    const prefix = 'PMT'
    const date = new Date()
    const year = date.getFullYear().toString()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const datePart = `${year}${month}${day}`
    const generateRandom = () => Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    let paymentNumber = `${prefix}-${datePart}-${generateRandom()}`
    
    // Ensure unique payment number
    let attempts = 0
    while (await Payment.findOne({ paymentNumber }) && attempts < 10) {
      paymentNumber = `${prefix}-${datePart}-${generateRandom()}`
      attempts++
    }
    
    await Payment.create({
      paymentNumber,
      booking: booking._id,
      customer: booking.customer,
      amount: booking.totalAmount,
      paymentMethod: 'cash', // Default, can be updated later
      paymentDate: booking.bookingDate,
      paymentType: 'receivable',
      status: 'pending',
      description: `Payment for booking ${booking.bookingNumber}`,
      createdBy: userId
    })
  }

  // Update vehicle status if confirmed
  if (booking.status === 'confirmed') {
    await Vehicle.findByIdAndUpdate(bookingData.vehicle, {
      status: 'booked'
    })
  }

  return booking
}

/**
 * Update booking
 */
export const updateBooking = async (bookingId, updateData, userId) => {
  const booking = await Booking.findById(bookingId)
  if (!booking) {
    throw new AppError('Booking not found', 404)
  }

  // Validate dates if being updated
  if (updateData.pickupDate || updateData.returnDate) {
    const pickupDate = new Date(updateData.pickupDate || booking.pickupDate)
    const returnDate = new Date(updateData.returnDate || booking.returnDate)
    if (returnDate <= pickupDate) {
      throw new AppError('Return date must be after pickup date', 400)
    }
  }

  // Validate driver if being assigned
  if (updateData.driver && updateData.driverRequired) {
    const Driver = (await import('../models/Driver.model.js')).default
    const driver = await Driver.findById(updateData.driver)
    if (!driver) {
      throw new AppError('Driver not found', 404)
    }
    if (driver.status !== 'active') {
      throw new AppError('Only active drivers can be assigned to bookings', 400)
    }
  }

  // Recalculate pricing if relevant fields changed
  const needsRecalculation = 
    updateData.pickupDate || 
    updateData.returnDate || 
    updateData.startMileage || 
    updateData.endMileage ||
    updateData.driver ||
    updateData.driverRequired

  if (needsRecalculation) {
    const mergedData = { ...booking.toObject(), ...updateData }
    const pricing = await calculateBookingPricing(mergedData)
    
    if (mergedData.driver && mergedData.driverRequired) {
      const driverCharges = await calculateDriverCharges(mergedData.driver, mergedData)
      pricing.driverCharges = driverCharges.driverCharges
      pricing.driverAllowances = driverCharges.driverAllowances
      pricing.totalAmount += driverCharges.driverCharges
    }

    updateData = { ...updateData, ...pricing }
    updateData.balanceAmount = updateData.totalAmount - (updateData.advancePaid || booking.advancePaid || 0)
  }

  updateData.updatedBy = userId
  const updatedBooking = await Booking.findByIdAndUpdate(
    bookingId,
    updateData,
    { new: true, runValidators: true }
  )

  return updatedBooking
}

/**
 * Get booking by ID with populated fields
 */
export const getBookingById = async (bookingId) => {
  const booking = await Booking.findById(bookingId)
    .populate('vehicle')
    .populate('customer')
    .populate('driver')
    .populate('vendor')
    .populate('createdBy', 'username fullName')
    .populate('updatedBy', 'username fullName')

  if (!booking) {
    throw new AppError('Booking not found', 404)
  }

  return booking
}

/**
 * Get all bookings with filters
 */
export const getBookings = async (filters = {}, pagination = {}) => {
  const { page = 1, limit = 10, sort = '-createdAt' } = pagination
  const skip = (page - 1) * limit

  const query = Booking.find(filters)
    .populate('vehicle', 'registrationNumber make model')
    .populate('customer', 'firstName lastName companyName email phone')
    .populate('driver', 'firstName lastName phone')
    .populate('vendor', 'name')
    .sort(sort)
    .skip(skip)
    .limit(limit)

  const [bookings, total] = await Promise.all([
    query.exec(),
    Booking.countDocuments(filters)
  ])

  return {
    bookings,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }
}

/**
 * Update booking status
 */
export const updateBookingStatus = async (bookingId, newStatus, userId, reason = null) => {
  const booking = await Booking.findById(bookingId)
  if (!booking) {
    throw new AppError('Booking not found', 404)
  }

  // Validate completion requires payment
  if (newStatus === 'completed' && booking.paymentStatus !== 'paid') {
    throw new AppError('Booking cannot be completed without full payment', 400)
  }

  const updateData = {
    status: newStatus,
    updatedBy: userId
  }

  if (newStatus === 'cancelled') {
    updateData.cancellationReason = reason
    updateData.cancelledAt = new Date()
    updateData.cancelledBy = userId

    // Update vehicle status back to available
    await Vehicle.findByIdAndUpdate(booking.vehicle, {
      status: 'available'
    })
  } else if (newStatus === 'confirmed') {
    // Update vehicle status to booked when confirmed
    await Vehicle.findByIdAndUpdate(booking.vehicle, {
      status: 'booked'
    })
  } else if (newStatus === 'in_progress') {
    updateData.actualPickupDate = new Date()
  } else if (newStatus === 'completed') {
    updateData.actualReturnDate = new Date()
    
    // Update vehicle status back to available
    await Vehicle.findByIdAndUpdate(booking.vehicle, {
      status: 'available',
      mileage: booking.endMileage || booking.vehicle.mileage
    })

    // If booking is paid, calculate driver income
    if (booking.paymentStatus === 'paid' && booking.driver) {
      await calculateDriverIncomeFromBooking(bookingId)
    }
  }

  const updatedBooking = await Booking.findByIdAndUpdate(
    bookingId,
    updateData,
    { new: true }
  )

  return updatedBooking
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
 * Create a public booking (from website, no authentication required)
 * Creates or finds customer, then creates booking with status 'pending'
 */
export const createPublicBooking = async (bookingData) => {
  const Customer = (await import('../models/Customer.model.js')).default
  
  // Validate required customer data
  if (!bookingData.customerEmail) {
    throw new AppError('Customer email is required', 400)
  }
  
  // Find customer by email ONLY (email is the primary identifier)
  // Phone numbers can be shared, so we use email as the unique identifier
  let customer = await Customer.findOne({
    email: bookingData.customerEmail.toLowerCase(),
    isActive: true // Only find active customers
  })

  if (!customer) {
    // Create new customer with isActive explicitly set
    customer = await Customer.create({
      customerType: 'individual',
      firstName: bookingData.customerFirstName,
      lastName: bookingData.customerLastName,
      email: bookingData.customerEmail.toLowerCase(),
      phone: bookingData.customerPhone,
      address: {
        street: bookingData.customerAddress?.street || '',
        city: bookingData.customerAddress?.city || '',
        state: bookingData.customerAddress?.state || '',
        zipCode: bookingData.customerAddress?.zipCode || '',
        country: bookingData.customerAddress?.country || ''
      },
      isActive: true, // Explicitly set to ensure customer appears in admin
      status: 'active'
    })
  } else {
    // Update existing customer information if provided
    // Update name if different (in case customer changed name)
    const updateData = {}
    if (bookingData.customerFirstName && bookingData.customerFirstName !== customer.firstName) {
      updateData.firstName = bookingData.customerFirstName
    }
    if (bookingData.customerLastName && bookingData.customerLastName !== customer.lastName) {
      updateData.lastName = bookingData.customerLastName
    }
    // Update phone if provided and different
    if (bookingData.customerPhone && bookingData.customerPhone !== customer.phone) {
      updateData.phone = bookingData.customerPhone
    }
    // Update address if provided and missing
    if (bookingData.customerAddress && (!customer.address?.street || !customer.address?.city)) {
      updateData.address = {
        street: bookingData.customerAddress?.street || customer.address?.street || '',
        city: bookingData.customerAddress?.city || customer.address?.city || '',
        state: bookingData.customerAddress?.state || customer.address?.state || '',
        zipCode: bookingData.customerAddress?.zipCode || customer.address?.zipCode || '',
        country: bookingData.customerAddress?.country || customer.address?.country || ''
      }
    }
    
    if (Object.keys(updateData).length > 0) {
      await Customer.findByIdAndUpdate(customer._id, updateData)
      // Refresh customer object to get updated data
      customer = await Customer.findById(customer._id)
    }
  }

  // Validate that customer was resolved/created successfully
  if (!customer || !customer._id) {
    throw new AppError('Failed to resolve or create customer', 500)
  }

  // Validate dates
  if (bookingData.pickupDate && bookingData.returnDate) {
    const pickupDate = new Date(bookingData.pickupDate)
    const returnDate = new Date(bookingData.returnDate)
    if (returnDate <= pickupDate) {
      throw new AppError('Return date must be after pickup date', 400)
    }
  }

  // Verify vehicle is available
  const vehicle = await Vehicle.findById(bookingData.vehicle)
  if (!vehicle) {
    throw new AppError('Vehicle not found', 404)
  }
  if (vehicle.status !== 'available' || !vehicle.isActive) {
    throw new AppError('Vehicle is not available for booking', 400)
  }

  // Generate booking number
  const bookingNumber = await generateBookingNumber()

  // Validate and use vehicle's dailyRate (prevent tampering)
  const dailyRate = vehicle.dailyRate
  if (!dailyRate || dailyRate <= 0) {
    throw new AppError('Vehicle daily rate is not set', 400)
  }

  // Calculate pricing
  const pricing = await calculateBookingPricing({
    ...bookingData,
    customer: customer._id,
    vehicle: bookingData.vehicle
  })

  // Validate customer ID is set before creating booking
  if (!customer || !customer._id) {
    throw new AppError('Customer ID is required to create booking', 500)
  }

  // Create booking with status 'pending' (not confirmed)
  // Exclude customer fields, bookingNumber, and createdBy from bookingData
  // (customer ID is needed, bookingNumber is generated, createdBy is null for public bookings)
  const { 
    customerEmail, 
    customerFirstName, 
    customerLastName, 
    customerPhone, 
    customerAddress,
    bookingNumber: _, // Explicitly exclude bookingNumber (always generated server-side)
    createdBy: __, // Explicitly exclude createdBy (always null for public bookings)
    customer: ___, // Explicitly exclude customer field from bookingData (use resolved customer._id)
    ...bookingFields 
  } = bookingData

  const booking = await Booking.create({
    ...bookingFields,
    customer: customer._id, // Always use the resolved customer's _id from email lookup
    bookingNumber,
    status: 'pending', // Public bookings start as pending
    rentalType: vehicle.ownershipType || 'own', // Use vehicle's ownership type
    dailyRate: dailyRate, // Use vehicle's dailyRate (validated, prevents tampering)
    ...pricing,
    balanceAmount: pricing.totalAmount - (bookingData.advancePaid || 0),
    createdBy: null, // Public bookings don't have an admin creator - explicitly set to null
    // Don't assign driver for public bookings (admin will assign if needed)
    driver: null,
    driverRequired: bookingData.driverRequired || false
  })

  // Final validation: ensure booking has customer linked
  if (!booking.customer) {
    throw new AppError('Booking must be linked to a customer', 500)
  }

  // Auto-create payment record with status PENDING (only if one doesn't exist)
  const Payment = (await import('../models/Payment.model.js')).default
  const existingPayment = await Payment.findOne({
    booking: booking._id,
    paymentType: 'receivable',
    status: 'pending'
  })
  
  if (!existingPayment) {
    // Generate payment number
    const prefix = 'PMT'
    const date = new Date()
    const year = date.getFullYear().toString()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const datePart = `${year}${month}${day}`
    const generateRandom = () => Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    let paymentNumber = `${prefix}-${datePart}-${generateRandom()}`
    
    // Ensure unique payment number
    let attempts = 0
    while (await Payment.findOne({ paymentNumber }) && attempts < 10) {
      paymentNumber = `${prefix}-${datePart}-${generateRandom()}`
      attempts++
    }
    
    await Payment.create({
      paymentNumber,
      booking: booking._id,
      customer: customer._id,
      amount: pricing.totalAmount,
      paymentMethod: 'cash',
      paymentDate: booking.bookingDate,
      paymentType: 'receivable',
      status: 'pending',
      description: `Payment for booking ${booking.bookingNumber}`,
      createdBy: null // Public bookings don't have admin creator
    })
  }

  // Don't update vehicle status yet - wait for admin confirmation
  // Vehicle status will be updated when admin confirms the booking

  return booking
}

