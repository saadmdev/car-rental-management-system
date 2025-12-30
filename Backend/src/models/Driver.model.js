import mongoose from 'mongoose'

/**
 * Driver Model
 * Represents drivers who can be assigned to bookings
 */

const driverSchema = new mongoose.Schema({
  // Personal Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  
  // Contact Information
  email: {
    type: String,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  alternatePhone: {
    type: String,
    trim: true
  },
  
  // Address
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  
  // License Information
  licenseNumber: {
    type: String,
    required: [true, 'License number is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  licenseExpiry: {
    type: Date,
    required: [true, 'License expiry is required']
  },
  licenseIssuedBy: {
    type: String,
    required: [true, 'License issued by is required'],
    trim: true
  },
  licenseClass: {
    type: String,
    trim: true
  },
  
  // Employment Details
  employeeId: {
    type: String,
    unique: true,
    trim: true
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on_leave', 'terminated'],
    default: 'active'
  },
  
  // Allowances Configuration
  allowances: {
    overtime: {
      enabled: {
        type: Boolean,
        default: true
      },
      ratePerHour: {
        type: Number,
        default: 0,
        min: 0
      },
      hoursThreshold: {
        type: Number,
        default: 12, // Overtime after 12 hours
        min: 0
      }
    },
    food: {
      enabled: {
        type: Boolean,
        default: true
      },
      dailyRate: {
        type: Number,
        default: 0,
        min: 0
      }
    },
    outstation: {
      enabled: {
        type: Boolean,
        default: true
      },
      dailyRate: {
        type: Number,
        default: 0,
        min: 0
      }
    },
    parking: {
      enabled: {
        type: Boolean,
        default: true
      },
      dailyRate: {
        type: Number,
        default: 0,
        min: 0
      }
    }
  },
  
  // Documents
  idProof: {
    type: String, // Document URL
    trim: true
  },
  addressProof: {
    type: String, // Document URL
    trim: true
  },
  photo: {
    type: String, // Photo URL
    trim: true
  },
  
  // Performance Tracking
  totalTrips: {
    type: Number,
    default: 0
  },
  totalKmDriven: {
    type: Number,
    default: 0,
    min: 0
  },
  totalEarnings: {
    type: Number,
    default: 0,
    min: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  
  // Additional Information
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    accountHolderName: String
  },
  notes: {
    type: String,
    trim: true
  },
  
  // Tracking
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminUser'
  }
}, {
  timestamps: true
})

// Indexes
driverSchema.index({ licenseNumber: 1 })
driverSchema.index({ employeeId: 1 })
driverSchema.index({ phone: 1 })
driverSchema.index({ status: 1 })

// Virtual for full name
driverSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`.trim()
})

const Driver = mongoose.model('Driver', driverSchema)

export default Driver

