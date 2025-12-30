import multer from 'multer'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'
import config from '../config/env.js'

// ES6 __dirname equivalent
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * File Upload Utility
 * Configures multer for file uploads
 */

// Ensure upload directory exists
const uploadDir = join(__dirname, '../../', config.uploadPath)
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop())
  }
})

// File filter
const fileFilter = (req, file, cb) => {
  // Allow images and documents
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only images and documents are allowed.'), false)
  }
}

// Multer configuration
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: config.maxFileSize
  },
  fileFilter: fileFilter
})

/**
 * Single file upload middleware
 */
export const uploadSingle = (fieldName) => {
  return upload.single(fieldName)
}

/**
 * Multiple files upload middleware
 */
export const uploadMultiple = (fieldName, maxCount = 5) => {
  return upload.array(fieldName, maxCount)
}

/**
 * Multiple fields upload middleware
 */
export const uploadFields = (fields) => {
  return upload.fields(fields)
}

