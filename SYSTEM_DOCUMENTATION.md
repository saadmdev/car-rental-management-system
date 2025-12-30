# Car Rental Admin Management System - Complete Documentation

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Installation & Setup](#installation--setup)
6. [Running the Application](#running-the-application)
7. [Configuration](#configuration)
8. [Usage Guide](#usage-guide)
9. [API Documentation](#api-documentation)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 System Overview

The **Car Rental Admin Management System** is a full-stack business management application designed for car rental companies. It provides comprehensive tools for managing vehicles, drivers, customers, bookings, expenses, payments, and generating detailed business reports.

### What It Does

**Public-Facing Website:**
- **Vehicle Browsing**: Browse available vehicles with filtering and search
- **Vehicle Details**: View detailed vehicle information, specifications, and images
- **Public Booking**: Customers can book vehicles directly from the website
- **Contact & Information**: About Us, Contact Us, and service information pages

**Admin Management System:**
- **Vehicle Management**: Track and manage your entire vehicle fleet (own, vendor, or outsourced vehicles)
- **Driver Management**: Manage drivers with allowance tracking (overtime, food, outstation, parking)
- **Customer Management**: Handle both individual and company customers with booking history
- **Booking System**: Complete booking management with automatic pricing calculations
- **Financial Tracking**: Track receivables, payables, expenses, and payments
- **Reporting & Analytics**: Generate detailed reports and export to Excel
- **Maintenance Tracking**: Monitor vehicle maintenance schedules and history

---

## ✨ Features

### Core Features

**Public Website Features:**

1. **Homepage**
   - Hero section with booking form
   - Featured vehicles showcase
   - Company features and benefits
   - Statistics and facts
   - Mobile app promotion
   - Newsletter subscription

2. **Vehicle Browsing**
   - Filter vehicles by type (Sedan, SUV, Sport, Cabriolet)
   - Search and filter by location, dates
   - View vehicle details with images and specifications
   - Direct booking from vehicle details page

3. **Public Booking System**
   - Book vehicles without account creation
   - Automatic customer creation from booking
   - Form validation and date checking
   - Booking confirmation

4. **Information Pages**
   - About Us page
   - Contact Us page with booking form
   - Service details

**Admin Dashboard Features:**

1. **Dashboard**
   - Real-time KPIs (vehicles, bookings, revenue, expenses)
   - Monthly statistics
   - Outstanding receivables tracking
   - Quick overview of business health

2. **Vehicle Management**
   - Add, edit, and manage vehicles
   - Track vehicle status (available, booked, maintenance)
   - Pricing management (daily, weekly, monthly rates)
   - Mileage tracking
   - Vehicle performance reports

3. **Driver Management**
   - Driver profiles with license information
   - Allowance configuration (overtime, food, outstation, parking)
   - Performance tracking
   - Trip and mileage statistics

4. **Customer Management**
   - Individual and company customer profiles
   - Booking history
   - Outstanding balance tracking
   - Customer statistics

5. **Booking Management**
   - Create and manage bookings
   - Automatic pricing calculation
   - Driver assignment with allowance calculation
   - Status lifecycle management
   - Payment tracking

6. **Financial Management**
   - Expense tracking and categorization
   - Receivables and payables management
   - Payment recording
   - Outstanding balance tracking

7. **Reporting & Export**
   - Income vs Expenses reports
   - Vehicle performance reports
   - Driver performance reports
   - Excel export functionality
   - Date range filtering

8. **Maintenance Management**
   - Maintenance log tracking
   - Upcoming maintenance alerts
   - Vehicle service history

---

## 🛠 Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **HTTP Client**: Fetch API

### Backend
- **Runtime**: Node.js (ES6 Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **File Uploads**: Multer
- **Excel Export**: ExcelJS

---

## 📁 Project Structure

```
car rental website/
├── Backend/                    # Backend API Server
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   │   ├── database.js    # MongoDB connection
│   │   │   └── env.js         # Environment variables
│   │   ├── models/            # MongoDB schemas
│   │   │   ├── AdminUser.model.js
│   │   │   ├── Vehicle.model.js
│   │   │   ├── Booking.model.js
│   │   │   ├── Customer.model.js
│   │   │   ├── Driver.model.js
│   │   │   ├── Vendor.model.js
│   │   │   ├── Payment.model.js
│   │   │   ├── Expense.model.js
│   │   │   └── MaintenanceLog.model.js
│   │   ├── controllers/       # Route controllers
│   │   ├── services/          # Business logic
│   │   ├── routes/            # API routes
│   │   │   ├── public.routes.js  # Public endpoints (no auth)
│   │   │   └── (other protected routes)
│   │   ├── middleware/        # Custom middleware
│   │   └── utils/             # Utility functions
│   ├── uploads/               # File uploads directory
│   ├── .env                   # Environment variables
│   ├── package.json
│   └── server.js              # Entry point
│
└── Frontend/                   # Next.js Frontend
    ├── app/
    │   ├── admin/             # Admin dashboard pages (protected)
    │   │   ├── dashboard/
    │   │   ├── vehicles/
    │   │   ├── drivers/
    │   │   ├── customers/
    │   │   ├── vendors/
    │   │   ├── bookings/
    │   │   ├── payments/
    │   │   ├── expenses/
    │   │   ├── reports/
    │   │   └── settings/
    │   ├── pages/             # Public-facing pages
    │   │   ├── home/          # Homepage
    │   │   ├── vehicles/     # Vehicle listing & details
    │   │   │   ├── [id]/     # Vehicle details page
    │   │   │   │   ├── page.js
    │   │   │   │   ├── book/  # Booking page
    │   │   │   │   └── not-found.js
    │   │   │   └── page.js   # Vehicle listing
    │   │   ├── about/         # About Us page
    │   │   ├── contact/       # Contact Us page
    │   │   ├── login/         # Admin login
    │   │   ├── signup/        # Admin signup
    │   │   └── details/       # Service details
    │   ├── layout.js          # Root layout
    │   ├── globals.css        # Global styles
    │   └── page.js            # Root page (redirects to /pages/home)
    ├── components/
    │   ├── admin/             # Admin components
    │   │   ├── layout/       # AdminLayout
    │   │   └── ui/           # Admin UI components
    │   ├── home/              # Homepage components
    │   │   ├── Hero.jsx
    │   │   ├── Features.jsx
    │   │   ├── FeaturedCars.jsx
    │   │   └── (other home sections)
    │   ├── layout/            # Layout components
    │   │   ├── Navbar.jsx
    │   │   └── Footer.jsx
    │   └── ui/                # Reusable UI components
    │       ├── VehicleFilter.jsx
    │       ├── VehiclesGrid.jsx
    │       ├── CarCard.jsx
    │       ├── ContactBookingForm.jsx
    │       └── (other UI components)
    ├── lib/
    │   ├── api/               # API client
    │   │   ├── client.js     # Main API client
    │   │   ├── auth.js        # Auth utilities
    │   │   └── errorHandler.js
    │   └── utils/             # Utility functions
    ├── .env.local             # Frontend environment variables
    └── package.json
```

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn** package manager

### Step 1: Clone/Download the Project

If you have the project files, navigate to the project directory:

```bash
cd "D:\Coding\Projects\car rental website"
```

### Step 2: Backend Setup

1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
# Copy the example file
copy .env.example .env
```

4. Configure environment variables in `.env`:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/car-rental-db
# For MongoDB Atlas, use:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/car-rental-db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

### Step 3: Frontend Setup

1. Navigate to the Frontend directory:
```bash
cd ../Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
# Create .env.local file
```

4. Add environment variables to `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Step 4: Start MongoDB

**Option A: Local MongoDB**
- Start your local MongoDB service
- Ensure it's running on `mongodb://localhost:27017`

**Option B: MongoDB Atlas**
- Use the connection string from your Atlas account
- Update `MONGODB_URI` in Backend `.env`

---

## ▶️ Running the Application

### Development Mode

#### 1. Start the Backend Server

Open a terminal in the `Backend` directory:

```bash
cd Backend
npm run dev
```

The server will start on `http://localhost:5000`
- You should see: `🚀 Server running on port 5000`

#### 2. Start the Frontend Server

Open a **new terminal** in the `Frontend` directory:

```bash
cd Frontend
npm run dev
```

The frontend will start on `http://localhost:3000`
- Open your browser and navigate to `http://localhost:3000`

### Production Mode

#### Backend:
```bash
cd Backend
npm start
```

#### Frontend:
```bash
cd Frontend
npm run build
npm start
```

---

## ⚙️ Configuration

### Backend Configuration

Edit `Backend/.env`:

- **PORT**: Backend server port (default: 5000)
- **MONGODB_URI**: MongoDB connection string
- **JWT_SECRET**: Secret key for JWT tokens (use a strong random string)
- **FRONTEND_URL**: Frontend URL for CORS (default: http://localhost:3000)

### Frontend Configuration

Edit `Frontend/.env.local`:

- **NEXT_PUBLIC_API_URL**: Backend API URL (default: http://localhost:5000/api)

---

## 📖 Usage Guide

### First Time Setup

1. **Start both servers** (Backend and Frontend)

2. **Create an Admin User**

   You need to create an admin user in the database. You can do this by:
   
   - Using MongoDB Compass or a MongoDB client
   - Or creating a seed script (recommended for first-time setup)
   
   Example admin user structure:
   ```javascript
   {
     username: "admin",
     email: "admin@carrental.com",
     password: "hashed_password", // Use bcrypt to hash
     fullName: "Admin User",
     role: "admin",
     isActive: true
   }
   ```

3. **Access the Website**
   - **Public Site**: Navigate to `http://localhost:3000` (redirects to `/pages/home`)
   - **Admin Panel**: Navigate to `http://localhost:3000/pages/login`
   - Use your admin credentials to login
   - You'll be redirected to `/admin/dashboard`

4. **Add Vehicles**
   - Login to admin panel
   - Go to Vehicles → Add Vehicle
   - Add vehicles with `status: 'available'` and `isActive: true` to make them visible on public site

### Using the Public Website

#### Homepage
- Browse featured vehicles
- Use the booking form to search and filter vehicles
- View company information and features
- Access all public pages via navigation

#### Vehicle Browsing
- **View All Vehicles**: Navigate to `/pages/vehicles` to see all available vehicles
- **Filter by Type**: Use filter buttons (Sedan, SUV, Sport, Cabriolet)
- **Search with Filters**: Use the booking form on homepage or contact page to filter by:
  - Car type
  - Pickup/return location
  - Rental and return dates
- **View Details**: Click on any vehicle to see full details, images, and specifications
- **Book Vehicle**: Click "Book Now" on vehicle details page to create a booking

#### Booking Process
1. Select a vehicle from the listing or details page
2. Click "Book Now" button
3. Fill in customer information (name, email, phone)
4. Confirm dates and pricing
5. Submit booking
6. Receive booking confirmation

### Using the Admin Dashboard

#### Dashboard
- View real-time business statistics
- Monitor KPIs at a glance
- Check outstanding receivables

#### Vehicles
- **View All**: See all vehicles in your fleet
- **Add New**: Click "Add Vehicle" to register a new vehicle
- **Edit**: Click the edit icon to modify vehicle details
- **Status**: Update vehicle status (available, booked, maintenance)
- **Public Visibility**: Only vehicles with `status: 'available'` and `isActive: true` appear on public site

#### Drivers
- **Add Driver**: Register new drivers with license information
- **Configure Allowances**: Set up overtime, food, outstation, and parking allowances
- **View Performance**: Check driver statistics and earnings
- **Status**: Only active drivers can be assigned to bookings

#### Customers
- **Add Customer**: Register individual or company customers
- **View History**: See booking history for each customer
- **Track Balance**: Monitor outstanding payments
- **Auto-Creation**: Customers are automatically created from public bookings

#### Bookings
- **Create Booking**: 
  1. Select vehicle
  2. Select customer
  3. Choose dates
  4. Optionally assign driver
  5. System automatically calculates pricing
- **Update Status**: Change booking status (pending → confirmed → in_progress → completed)
- **Track Payments**: Monitor payment status and balances
- **Public Bookings**: View and manage bookings created from public website
- **Validation**: System validates dates (pickup < return) and prevents completion without payment

#### Expenses
- **Record Expense**: Add operational expenses
- **Categorize**: Use categories (fuel, maintenance, insurance, etc.)
- **Track Tax**: System calculates tax automatically

#### Payments
- **Record Receivables**: Log customer payments
- **Record Payables**: Log vendor/driver payments
- **View Outstanding**: See unpaid invoices
- **Auto-Creation**: Payment records are automatically created when bookings are created

#### Reports
- **Overview**: Income vs Expenses summary
- **Vehicle Performance**: See which vehicles are most profitable
- **Driver Performance**: Track driver earnings and trips
- **Export to Excel**: Download reports as Excel files
- **Date Filters**: Filter reports by date range

#### Settings
- System settings (to be implemented)

### Creating Your First Booking

**From Public Website:**
1. Navigate to `/pages/vehicles` or use the booking form on homepage
2. Browse and select a vehicle
3. Click "Book Now" on vehicle details page
4. Fill in customer information and confirm dates
5. Submit booking
6. Booking is created with status "pending" and payment record is auto-created

**From Admin Panel:**
1. Go to **Bookings** → Click **"New Booking"**
2. Fill in the form:
   - Select a vehicle
   - Select a customer (or create new)
   - Choose pickup and return dates
   - Optionally assign a driver
   - System calculates pricing automatically
3. Click **"Create Booking"**
4. The booking is created with status "pending" and payment record is auto-created
5. Update status to "confirmed" when ready (vehicle status will update to "booked")

### Exporting Reports

1. Go to **Reports**
2. Select date range (optional)
3. Choose the report type (Overview, Vehicles, Drivers)
4. Click **"Export Report"** button
5. Excel file downloads automatically

---

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Key Endpoints

#### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user

#### Public Endpoints (No Authentication Required)
- `GET /api/public/vehicles/available` - Get available vehicles for public display
- `GET /api/public/vehicles/:id` - Get vehicle details (public)
- `POST /api/public/bookings` - Create booking from public website

#### Vehicles
- `GET /api/vehicles` - List all vehicles (admin)
- `GET /api/vehicles/available` - Get available vehicles (admin)
- `POST /api/vehicles` - Create vehicle (admin)
- `GET /api/vehicles/:id` - Get vehicle details (admin)
- `PUT /api/vehicles/:id` - Update vehicle (admin)
- `PATCH /api/vehicles/:id/status` - Update status (admin)

#### Bookings
- `GET /api/bookings` - List all bookings (admin)
- `POST /api/bookings` - Create booking (admin)
- `GET /api/bookings/:id` - Get booking details (admin)
- `PUT /api/bookings/:id` - Update booking (admin)
- `PATCH /api/bookings/:id/status` - Update status (admin)
- `GET /api/bookings/calculate-pricing` - Preview booking pricing (admin)

#### Reports
- `GET /api/reports/dashboard` - Dashboard summary
- `GET /api/reports/income-expense` - Income vs expenses
- `GET /api/reports/vehicles-performance` - All vehicles performance
- `GET /api/reports/drivers-performance` - All drivers performance

#### Export
- `GET /api/export/bookings` - Export bookings to Excel
- `GET /api/export/expenses` - Export expenses to Excel
- `GET /api/export/payments` - Export payments to Excel
- `GET /api/export/income-expense` - Export income/expense report

**Note:** 
- Public endpoints (`/api/public/*`) do not require authentication
- All admin endpoints require JWT authentication
- Public bookings automatically create customer records if they don't exist
- Public bookings automatically create payment records with status "pending"

For complete API documentation, check `Backend/README.md`

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Backend won't start
- **Check MongoDB**: Ensure MongoDB is running
- **Check Port**: Make sure port 5000 is not in use
- **Check .env**: Verify all environment variables are set correctly
- **Check Dependencies**: Run `npm install` again

#### 2. Frontend won't connect to Backend
- **Check API URL**: Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- **Check CORS**: Ensure `FRONTEND_URL` in Backend `.env` matches frontend URL
- **Check Backend**: Ensure backend server is running

#### 3. Authentication Issues
- **Check Token**: Token might be expired, try logging in again
- **Check Secret**: Verify `JWT_SECRET` is set in Backend `.env`
- **Clear Storage**: Clear browser localStorage and try again

#### 4. Database Connection Issues
- **Check MongoDB URI**: Verify connection string is correct
- **Check Network**: If using Atlas, check network access settings
- **Check Credentials**: Verify username/password if using Atlas

#### 5. Import/Export Errors
- **Check File Size**: Ensure files are within size limits
- **Check Permissions**: Verify write permissions for uploads directory
- **Check ExcelJS**: Ensure ExcelJS is installed in Backend

### Getting Help

1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure all dependencies are installed
4. Check MongoDB connection
5. Review the logs in both Backend and Frontend terminals

---

## 📝 Important Notes

### Security
- **Change JWT_SECRET**: Use a strong, random secret in production
- **Use HTTPS**: Always use HTTPS in production
- **Environment Variables**: Never commit `.env` files to version control
- **Password Hashing**: Passwords are automatically hashed using bcrypt

### Data Management
- **Backup**: Regularly backup your MongoDB database
- **Migrations**: Database schemas are managed by Mongoose
- **File Uploads**: Uploaded files are stored in `Backend/uploads`

### Performance
- **Pagination**: All list endpoints support pagination
- **Indexing**: MongoDB indexes are defined in models
- **Caching**: Consider implementing caching for production

---

## 🎓 Next Steps

### Recommended Enhancements
1. Add user roles and permissions
2. Implement email notifications
3. Add SMS notifications for bookings
4. Create customer portal
5. Add payment gateway integration
6. Implement advanced analytics
7. Add mobile app support

### Production Deployment
1. Set up production MongoDB (Atlas recommended)
2. Configure production environment variables
3. Set up reverse proxy (Nginx)
4. Enable HTTPS
5. Set up monitoring and logging
6. Configure automated backups

---

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review error messages in console
3. Check Backend and Frontend logs
4. Verify all setup steps are completed

---

## ✅ System Status

**All Phases Complete:**
- ✅ Phase 1: Backend Foundation
- ✅ Phase 2: Database Models
- ✅ Phase 3: Core Business Logic
- ✅ Phase 4: Admin Dashboard
- ✅ Phase 5: Reporting & Export
- ✅ Phase 6: Integration
- ✅ Phase 7: Public-Facing Website
  - Homepage with booking form
  - Vehicle browsing and filtering
  - Vehicle details pages
  - Public booking system
  - About Us and Contact Us pages
  - Responsive design

**The system is fully functional with both public website and admin dashboard!**

---

*Last Updated: December 2024*

