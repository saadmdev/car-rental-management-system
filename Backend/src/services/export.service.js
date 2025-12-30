/**
 * Export Service
 * Handles Excel export functionality
 */

import ExcelJS from 'exceljs'
import Booking from '../models/Booking.model.js'
import Expense from '../models/Expense.model.js'
import Payment from '../models/Payment.model.js'
import Vehicle from '../models/Vehicle.model.js'
import Driver from '../models/Driver.model.js'

/**
 * Generate Excel workbook for bookings report
 */
export const exportBookingsToExcel = async (filters = {}) => {
  const bookings = await Booking.find(filters)
    .populate('vehicle', 'registrationNumber make model')
    .populate('customer', 'firstName lastName companyName email phone')
    .populate('driver', 'firstName lastName phone')
    .sort('-bookingDate')

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Bookings')

  // Define columns
  worksheet.columns = [
    { header: 'Booking Number', key: 'bookingNumber', width: 15 },
    { header: 'Customer Name', key: 'customerName', width: 25 },
    { header: 'Customer Email', key: 'customerEmail', width: 30 },
    { header: 'Vehicle', key: 'vehicle', width: 25 },
    { header: 'Pickup Date', key: 'pickupDate', width: 15 },
    { header: 'Return Date', key: 'returnDate', width: 15 },
    { header: 'Days', key: 'days', width: 10 },
    { header: 'Total Amount', key: 'totalAmount', width: 15 },
    { header: 'Advance Paid', key: 'advancePaid', width: 15 },
    { header: 'Balance', key: 'balance', width: 15 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Payment Status', key: 'paymentStatus', width: 15 },
  ]

  // Style header row
  worksheet.getRow(1).font = { bold: true }
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF7C3AED' },
  }
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }

  // Add data rows
  bookings.forEach((booking) => {
    const customer = booking.customer
    const vehicle = booking.vehicle
    const customerName =
      customer?.customerType === 'individual'
        ? `${customer?.firstName || ''} ${customer?.lastName || ''}`.trim()
        : customer?.companyName || 'N/A'
    const customerEmail = customer?.email || 'N/A'
    const vehicleInfo = vehicle
      ? `${vehicle.make} ${vehicle.model} (${vehicle.registrationNumber})`
      : 'N/A'

    worksheet.addRow({
      bookingNumber: booking.bookingNumber,
      customerName,
      customerEmail,
      vehicle: vehicleInfo,
      pickupDate: new Date(booking.pickupDate).toLocaleDateString(),
      returnDate: new Date(booking.returnDate).toLocaleDateString(),
      days: booking.numberOfDays,
      totalAmount: booking.totalAmount,
      advancePaid: booking.advancePaid || 0,
      balance: booking.balanceAmount || 0,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
    })
  })

  // Format number columns
  worksheet.getColumn('totalAmount').numFmt = '$#,##0.00'
  worksheet.getColumn('advancePaid').numFmt = '$#,##0.00'
  worksheet.getColumn('balance').numFmt = '$#,##0.00'

  return workbook
}

/**
 * Generate Excel workbook for expenses report
 */
export const exportExpensesToExcel = async (filters = {}) => {
  const expenses = await Expense.find(filters)
    .populate('vehicle', 'registrationNumber make model')
    .populate('booking', 'bookingNumber')
    .sort('-expenseDate')

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Expenses')

  worksheet.columns = [
    { header: 'Expense Number', key: 'expenseNumber', width: 15 },
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Category', key: 'category', width: 20 },
    { header: 'Description', key: 'description', width: 40 },
    { header: 'Amount', key: 'amount', width: 15 },
    { header: 'Tax', key: 'tax', width: 15 },
    { header: 'Total Amount', key: 'totalAmount', width: 15 },
    { header: 'Payment Status', key: 'paymentStatus', width: 15 },
    { header: 'Vehicle', key: 'vehicle', width: 25 },
  ]

  worksheet.getRow(1).font = { bold: true }
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF7C3AED' },
  }
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }

  expenses.forEach((expense) => {
    const vehicle = expense.vehicle
    const vehicleInfo = vehicle
      ? `${vehicle.make} ${vehicle.model} (${vehicle.registrationNumber})`
      : 'N/A'

    worksheet.addRow({
      expenseNumber: expense.expenseNumber,
      date: new Date(expense.expenseDate).toLocaleDateString(),
      category: expense.category,
      description: expense.description,
      amount: expense.amount,
      tax: expense.taxAmount || 0,
      totalAmount: expense.totalAmount,
      paymentStatus: expense.paymentStatus,
      vehicle: vehicleInfo,
    })
  })

  worksheet.getColumn('amount').numFmt = '$#,##0.00'
  worksheet.getColumn('tax').numFmt = '$#,##0.00'
  worksheet.getColumn('totalAmount').numFmt = '$#,##0.00'

  return workbook
}

/**
 * Generate Excel workbook for payments report
 */
export const exportPaymentsToExcel = async (filters = {}) => {
  const payments = await Payment.find(filters)
    .populate('booking', 'bookingNumber')
    .populate('customer', 'firstName lastName companyName')
    .populate('vendor', 'name')
    .sort('-paymentDate')

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Payments')

  worksheet.columns = [
    { header: 'Payment Number', key: 'paymentNumber', width: 15 },
    { header: 'Type', key: 'type', width: 15 },
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Amount', key: 'amount', width: 15 },
    { header: 'Method', key: 'method', width: 15 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Booking', key: 'booking', width: 15 },
    { header: 'Customer/Vendor', key: 'entity', width: 25 },
  ]

  worksheet.getRow(1).font = { bold: true }
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF7C3AED' },
  }
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }

  payments.forEach((payment) => {
    let entityName = 'N/A'
    if (payment.customer) {
      const customer = payment.customer
      entityName =
        customer.customerType === 'individual'
          ? `${customer.firstName} ${customer.lastName}`
          : customer.companyName
    } else if (payment.vendor) {
      entityName = payment.vendor.name
    }

    worksheet.addRow({
      paymentNumber: payment.paymentNumber,
      type: payment.paymentType,
      date: new Date(payment.paymentDate).toLocaleDateString(),
      amount: payment.amount,
      method: payment.paymentMethod,
      status: payment.status,
      booking: payment.booking?.bookingNumber || 'N/A',
      entity: entityName,
    })
  })

  worksheet.getColumn('amount').numFmt = '$#,##0.00'

  return workbook
}

/**
 * Generate Excel workbook for income vs expenses report
 */
export const exportIncomeExpenseToExcel = async (startDate, endDate) => {
  const workbook = new ExcelJS.Workbook()

  // Income Sheet
  const incomeSheet = workbook.addWorksheet('Income')
  const bookings = await Booking.find({
    bookingDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
    status: { $in: ['confirmed', 'in_progress', 'completed'] },
  })
    .populate('customer', 'firstName lastName companyName')
    .populate('vehicle', 'registrationNumber make model')
    .sort('-bookingDate')

  incomeSheet.columns = [
    { header: 'Booking Number', key: 'bookingNumber', width: 15 },
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Customer', key: 'customer', width: 30 },
    { header: 'Vehicle', key: 'vehicle', width: 25 },
    { header: 'Amount', key: 'amount', width: 15 },
  ]

  incomeSheet.getRow(1).font = { bold: true }
  incomeSheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF7C3AED' },
  }
  incomeSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }

  bookings.forEach((booking) => {
    const customer = booking.customer
    const customerName =
      customer?.customerType === 'individual'
        ? `${customer?.firstName || ''} ${customer?.lastName || ''}`.trim()
        : customer?.companyName || 'N/A'
    const vehicle = booking.vehicle
    const vehicleInfo = vehicle
      ? `${vehicle.make} ${vehicle.model} (${vehicle.registrationNumber})`
      : 'N/A'

    incomeSheet.addRow({
      bookingNumber: booking.bookingNumber,
      date: new Date(booking.bookingDate).toLocaleDateString(),
      customer: customerName,
      vehicle: vehicleInfo,
      amount: booking.totalAmount,
    })
  })

  incomeSheet.getColumn('amount').numFmt = '$#,##0.00'

  // Expenses Sheet
  const expenseSheet = workbook.addWorksheet('Expenses')
  const expenses = await Expense.find({
    expenseDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
  })
    .populate('vehicle', 'registrationNumber make model')
    .sort('-expenseDate')

  expenseSheet.columns = [
    { header: 'Expense Number', key: 'expenseNumber', width: 15 },
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Category', key: 'category', width: 20 },
    { header: 'Description', key: 'description', width: 40 },
    { header: 'Amount', key: 'amount', width: 15 },
  ]

  expenseSheet.getRow(1).font = { bold: true }
  expenseSheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF7C3AED' },
  }
  expenseSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }

  expenses.forEach((expense) => {
    expenseSheet.addRow({
      expenseNumber: expense.expenseNumber,
      date: new Date(expense.expenseDate).toLocaleDateString(),
      category: expense.category,
      description: expense.description,
      amount: expense.totalAmount,
    })
  })

  expenseSheet.getColumn('amount').numFmt = '$#,##0.00'

  // Summary Sheet
  const summarySheet = workbook.addWorksheet('Summary')
  const totalIncome = bookings.reduce((sum, b) => sum + b.totalAmount, 0)
  const totalExpenses = expenses.reduce((sum, e) => sum + e.totalAmount, 0)
  const netProfit = totalIncome - totalExpenses

  summarySheet.columns = [
    { header: 'Item', key: 'item', width: 30 },
    { header: 'Amount', key: 'amount', width: 20 },
  ]

  summarySheet.getRow(1).font = { bold: true }
  summarySheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF7C3AED' },
  }
  summarySheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }

  summarySheet.addRow({ item: 'Total Income', amount: totalIncome })
  summarySheet.addRow({ item: 'Total Expenses', amount: totalExpenses })
  summarySheet.addRow({ item: 'Net Profit', amount: netProfit })
  summarySheet.getColumn('amount').numFmt = '$#,##0.00'

  return workbook
}

