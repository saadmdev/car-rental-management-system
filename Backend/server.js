import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import mongoose from 'mongoose'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import connectDB from './src/config/database.js'
import config from './src/config/env.js'
import { errorHandler } from './src/middleware/error.middleware.js'

// ES6 __dirname equivalent
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Import routes
import bookingRoutes from './src/routes/booking.routes.js'
import expenseRoutes from './src/routes/expense.routes.js'
import paymentRoutes from './src/routes/payment.routes.js'
import reportingRoutes from './src/routes/reporting.routes.js'
import vehicleRoutes from './src/routes/vehicle.routes.js'
import driverRoutes from './src/routes/driver.routes.js'
import customerRoutes from './src/routes/customer.routes.js'
import vendorRoutes from './src/routes/vendor.routes.js'
import maintenanceRoutes from './src/routes/maintenance.routes.js'
import exportRoutes from './src/routes/export.routes.js'
import publicRoutes from './src/routes/public.routes.js'
import authRoutes from './src/routes/auth.routes.js'

// Initialize Express app
const app = express()

// Middleware
app.use(cors({
  origin: config.frontendUrl,
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

// Serve static files for uploads
app.use('/uploads', express.static(join(__dirname, 'uploads')))

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Car Rental API is running',
    timestamp: new Date().toISOString()
  })
})

// API Routes
// Public routes (no authentication required)
app.use('/api/public', publicRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/expenses', expenseRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/reports', reportingRoutes)
app.use('/api/vehicles', vehicleRoutes)
app.use('/api/drivers', driverRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/vendors', vendorRoutes)
app.use('/api/maintenance', maintenanceRoutes)
app.use('/api/export', exportRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  })
})

// Error handling middleware
app.use(errorHandler)

// Connect to database
connectDB()

// Start server
app.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port}`)
  console.log(`📝 Environment: ${config.nodeEnv}`)
  console.log(`🌐 API URL: http://localhost:${config.port}/api`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed')
    process.exit(0)
  })
})

