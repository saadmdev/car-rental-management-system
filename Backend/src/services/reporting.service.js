/**
 * Reporting Service
 * Handles business reports and analytics
 */

import Booking from '../models/Booking.model.js'
import Expense from '../models/Expense.model.js'
import Payment from '../models/Payment.model.js'
import Vehicle from '../models/Vehicle.model.js'
import Driver from '../models/Driver.model.js'

/**
 * Get monthly income vs expenses report
 */
export const getMonthlyIncomeExpenseReport = async (year, month) => {
  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0, 23, 59, 59)

  // Income from bookings
  const incomeData = await Booking.aggregate([
    {
      $match: {
        bookingDate: { $gte: startDate, $lte: endDate },
        status: { $in: ['confirmed', 'in_progress', 'completed'] }
      }
    },
    {
      $group: {
        _id: null,
        totalIncome: { $sum: '$totalAmount' },
        bookingCount: { $sum: 1 },
        avgBookingValue: { $avg: '$totalAmount' }
      }
    }
  ])

  // Expenses
  const expenseData = await Expense.aggregate([
    {
      $match: {
        expenseDate: { $gte: startDate, $lte: endDate },
        paymentStatus: 'paid'
      }
    },
    {
      $group: {
        _id: null,
        totalExpenses: { $sum: '$totalAmount' },
        expenseCount: { $sum: 1 }
      }
    }
  ])

  const income = incomeData[0] || { totalIncome: 0, bookingCount: 0, avgBookingValue: 0 }
  const expenses = expenseData[0] || { totalExpenses: 0, expenseCount: 0 }
  const netProfit = income.totalIncome - expenses.totalExpenses

  return {
    period: { year, month },
    income: {
      total: income.totalIncome,
      bookingCount: income.bookingCount,
      averageBookingValue: income.avgBookingValue
    },
    expenses: {
      total: expenses.totalExpenses,
      count: expenses.expenseCount
    },
    profit: {
      net: netProfit,
      margin: income.totalIncome > 0 
        ? ((netProfit / income.totalIncome) * 100).toFixed(2) 
        : 0
    }
  }
}

/**
 * Get income vs expenses report by date range
 */
export const getIncomeExpenseReportByDateRange = async (startDate, endDate) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  end.setHours(23, 59, 59, 999)

  // Income from bookings
  const incomeData = await Booking.aggregate([
    {
      $match: {
        bookingDate: { $gte: start, $lte: end },
        status: { $in: ['confirmed', 'in_progress', 'completed'] }
      }
    },
    {
      $group: {
        _id: null,
        totalIncome: { $sum: '$totalAmount' },
        bookingCount: { $sum: 1 },
        avgBookingValue: { $avg: '$totalAmount' }
      }
    }
  ])

  // Expenses
  const expenseData = await Expense.aggregate([
    {
      $match: {
        expenseDate: { $gte: start, $lte: end },
        paymentStatus: 'paid'
      }
    },
    {
      $group: {
        _id: null,
        totalExpenses: { $sum: '$totalAmount' },
        expenseCount: { $sum: 1 }
      }
    }
  ])

  const income = incomeData[0] || { totalIncome: 0, bookingCount: 0, avgBookingValue: 0 }
  const expenses = expenseData[0] || { totalExpenses: 0, expenseCount: 0 }
  const netProfit = income.totalIncome - expenses.totalExpenses

  return {
    period: { startDate, endDate },
    income: {
      total: income.totalIncome,
      bookingCount: income.bookingCount,
      averageBookingValue: income.avgBookingValue
    },
    expenses: {
      total: expenses.totalExpenses,
      count: expenses.expenseCount
    },
    profit: {
      net: netProfit,
      margin: income.totalIncome > 0 
        ? ((netProfit / income.totalIncome) * 100).toFixed(2) 
        : 0
    }
  }
}

/**
 * Get vehicle performance report
 */
export const getVehiclePerformanceReport = async (vehicleId, startDate, endDate) => {
  const matchStage = { vehicle: vehicleId }
  
  if (startDate || endDate) {
    matchStage.bookingDate = {}
    if (startDate) matchStage.bookingDate.$gte = new Date(startDate)
    if (endDate) matchStage.bookingDate.$lte = new Date(endDate)
  }

  const vehicle = await Vehicle.findById(vehicleId)
  if (!vehicle) {
    throw new Error('Vehicle not found')
  }

  const bookings = await Booking.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$vehicle',
        totalBookings: { $sum: 1 },
        totalRevenue: { $sum: '$totalAmount' },
        totalKm: { $sum: '$totalKm' },
        avgBookingValue: { $avg: '$totalAmount' },
        utilizationDays: { $sum: '$numberOfDays' }
      }
    }
  ])

  const stats = bookings[0] || {
    totalBookings: 0,
    totalRevenue: 0,
    totalKm: 0,
    avgBookingValue: 0,
    utilizationDays: 0
  }

  return {
    vehicle: {
      id: vehicle._id,
      registrationNumber: vehicle.registrationNumber,
      make: vehicle.make,
      model: vehicle.model
    },
    performance: {
      totalBookings: stats.totalBookings,
      totalRevenue: stats.totalRevenue,
      totalKm: stats.totalKm,
      averageBookingValue: stats.avgBookingValue,
      utilizationDays: stats.utilizationDays,
      revenuePerKm: stats.totalKm > 0 ? (stats.totalRevenue / stats.totalKm) : 0
    }
  }
}

/**
 * Get all vehicles performance report
 */
export const getAllVehiclesPerformanceReport = async (startDate, endDate) => {
  const matchStage = {}
  
  if (startDate || endDate) {
    matchStage.bookingDate = {}
    if (startDate) matchStage.bookingDate.$gte = new Date(startDate)
    if (endDate) matchStage.bookingDate.$lte = new Date(endDate)
  }

  const vehicles = await Vehicle.find({ isActive: true })
  const performanceData = []

  for (const vehicle of vehicles) {
    const bookings = await Booking.aggregate([
      { $match: { ...matchStage, vehicle: vehicle._id } },
      {
        $group: {
          _id: '$vehicle',
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          totalKm: { $sum: '$totalKm' },
          utilizationDays: { $sum: '$numberOfDays' }
        }
      }
    ])

    const stats = bookings[0] || {
      totalBookings: 0,
      totalRevenue: 0,
      totalKm: 0,
      utilizationDays: 0
    }

    performanceData.push({
      vehicle: {
        id: vehicle._id,
        registrationNumber: vehicle.registrationNumber,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year
      },
      performance: {
        totalBookings: stats.totalBookings,
        totalRevenue: stats.totalRevenue,
        totalKm: stats.totalKm,
        utilizationDays: stats.utilizationDays,
        revenuePerKm: stats.totalKm > 0 ? (stats.totalRevenue / stats.totalKm) : 0
      }
    })
  }

  return performanceData.sort((a, b) => b.performance.totalRevenue - a.performance.totalRevenue)
}

/**
 * Get driver performance report
 */
export const getDriverPerformanceReport = async (driverId, startDate, endDate) => {
  const matchStage = { driver: driverId }
  
  if (startDate || endDate) {
    matchStage.bookingDate = {}
    if (startDate) matchStage.bookingDate.$gte = new Date(startDate)
    if (endDate) matchStage.bookingDate.$lte = new Date(endDate)
  }

  const driver = await Driver.findById(driverId)
  if (!driver) {
    throw new Error('Driver not found')
  }

  const bookings = await Booking.aggregate([
    { 
      $match: {
        ...matchStage,
        status: 'completed',
        paymentStatus: 'paid'
      }
    },
    {
      $group: {
        _id: '$driver',
        totalTrips: { $sum: 1 },
        totalKm: { $sum: '$totalKm' },
        totalEarnings: { $sum: '$driverCharges' },
        totalAllowances: {
          $sum: {
            $add: [
              '$driverAllowances.overtime',
              '$driverAllowances.food',
              '$driverAllowances.outstation',
              '$driverAllowances.parking'
            ]
          }
        }
      }
    }
  ])

  const stats = bookings[0] || {
    totalTrips: 0,
    totalKm: 0,
    totalEarnings: 0,
    totalAllowances: 0
  }

  return {
    driver: {
      id: driver._id,
      fullName: `${driver.firstName} ${driver.lastName}`,
      employeeId: driver.employeeId
    },
    performance: {
      totalTrips: stats.totalTrips,
      totalKm: stats.totalKm,
      totalEarnings: stats.totalEarnings,
      totalAllowances: stats.totalAllowances,
      totalIncome: stats.totalEarnings + stats.totalAllowances,
      avgKmPerTrip: stats.totalTrips > 0 ? (stats.totalKm / stats.totalTrips) : 0
    }
  }
}

/**
 * Get all drivers performance report
 */
export const getAllDriversPerformanceReport = async (startDate, endDate) => {
  const matchStage = {}
  
  if (startDate || endDate) {
    matchStage.bookingDate = {}
    if (startDate) matchStage.bookingDate.$gte = new Date(startDate)
    if (endDate) matchStage.bookingDate.$lte = new Date(endDate)
  }

  const drivers = await Driver.find({ status: 'active' })
  const performanceData = []

  for (const driver of drivers) {
    const bookings = await Booking.aggregate([
      { 
        $match: { 
          ...matchStage, 
          driver: driver._id,
          status: 'completed',
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: '$driver',
          totalTrips: { $sum: 1 },
          totalKm: { $sum: '$totalKm' },
          totalEarnings: { $sum: '$driverCharges' },
          totalAllowances: {
            $sum: {
              $add: [
                '$driverAllowances.overtime',
                '$driverAllowances.food',
                '$driverAllowances.outstation',
                '$driverAllowances.parking'
              ]
            }
          }
        }
      }
    ])

    const stats = bookings[0] || {
      totalTrips: 0,
      totalKm: 0,
      totalEarnings: 0,
      totalAllowances: 0
    }

    performanceData.push({
      driver: {
        id: driver._id,
        fullName: `${driver.firstName} ${driver.lastName}`,
        employeeId: driver.employeeId
      },
      performance: {
        totalTrips: stats.totalTrips,
        totalKm: stats.totalKm,
        totalEarnings: stats.totalEarnings,
        totalAllowances: stats.totalAllowances,
        totalIncome: stats.totalEarnings + stats.totalAllowances,
        avgKmPerTrip: stats.totalTrips > 0 ? (stats.totalKm / stats.totalTrips) : 0
      }
    })
  }

  return performanceData.sort((a, b) => b.performance.totalIncome - a.performance.totalIncome)
}

/**
 * Get dashboard summary
 */
export const getDashboardSummary = async () => {
  const today = new Date()
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const startOfYear = new Date(today.getFullYear(), 0, 1)

  // Total vehicles
  const totalVehicles = await Vehicle.countDocuments({ isActive: true })
  const availableVehicles = await Vehicle.countDocuments({ 
    isActive: true, 
    status: 'available' 
  })
  const bookedVehicles = await Vehicle.countDocuments({ 
    isActive: true, 
    status: 'booked' 
  })

  // Monthly bookings
  const monthlyBookings = await Booking.countDocuments({
    bookingDate: { $gte: startOfMonth }
  })

  // Monthly revenue
  const monthlyRevenue = await Booking.aggregate([
    {
      $match: {
        bookingDate: { $gte: startOfMonth },
        status: { $in: ['confirmed', 'in_progress', 'completed'] }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$totalAmount' }
      }
    }
  ])

  // Monthly expenses
  const monthlyExpenses = await Expense.aggregate([
    {
      $match: {
        expenseDate: { $gte: startOfMonth },
        paymentStatus: 'paid'
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$totalAmount' }
      }
    }
  ])

  // Active drivers
  const activeDrivers = await Driver.countDocuments({ status: 'active' })

  // Pending bookings
  const pendingBookings = await Booking.countDocuments({ status: 'pending' })

  // Outstanding receivables
  const outstandingReceivables = await Booking.aggregate([
    {
      $match: {
        paymentStatus: { $in: ['pending', 'partial'] }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$balanceAmount' }
      }
    }
  ])

  return {
    vehicles: {
      total: totalVehicles,
      available: availableVehicles,
      booked: bookedVehicles,
      inMaintenance: totalVehicles - availableVehicles - bookedVehicles
    },
    bookings: {
      monthly: monthlyBookings,
      pending: pendingBookings
    },
    revenue: {
      monthly: monthlyRevenue[0]?.total || 0
    },
    expenses: {
      monthly: monthlyExpenses[0]?.total || 0
    },
    profit: {
      monthly: (monthlyRevenue[0]?.total || 0) - (monthlyExpenses[0]?.total || 0)
    },
    drivers: {
      active: activeDrivers
    },
    receivables: {
      outstanding: outstandingReceivables[0]?.total || 0
    }
  }
}
