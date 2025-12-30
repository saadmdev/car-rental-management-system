import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

/**
 * Environment configuration
 * Validates and exports all required environment variables
 */

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'PORT'
]

// Validate required environment variables
const validateEnv = () => {
  const missing = requiredEnvVars.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:')
    missing.forEach(key => console.error(`   - ${key}`))
    console.error('\nPlease check your .env file')
    process.exit(1)
  }
}

// Run validation
validateEnv()

export default {
  // Server
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  mongodbUri: process.env.MONGODB_URI,
  
  // JWT
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  
  // CORS
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // File Upload
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
  uploadPath: process.env.UPLOAD_PATH || './uploads'
}

