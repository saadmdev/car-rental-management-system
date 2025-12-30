# Car Rental Website

A modern, full-stack car rental web application with a public-facing website and comprehensive admin management system.

## 🎯 Overview

This project consists of two main parts:
- **Public Website**: Customer-facing site for browsing vehicles and making bookings
- **Admin Dashboard**: Complete management system for vehicles, bookings, customers, drivers, and financial tracking

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript
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

## 📁 Project Structure

```
car rental website/
├── Backend/                    # Backend API Server
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── models/            # MongoDB schemas
│   │   ├── controllers/       # Route controllers
│   │   ├── services/          # Business logic
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Custom middleware
│   │   └── utils/             # Utility functions
│   ├── uploads/               # File uploads directory
│   ├── .env                   # Environment variables
│   └── server.js              # Entry point
│
└── Frontend/                   # Next.js Frontend
    ├── app/
    │   ├── admin/             # Admin dashboard (protected)
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
    │   └── pages/             # Public-facing pages
    │       ├── home/          # Homepage
    │       ├── vehicles/      # Vehicle listing & details
    │       ├── about/         # About Us
    │       ├── contact/       # Contact Us
    │       ├── login/         # Admin login
    │       └── signup/        # Admin signup
    ├── components/
    │   ├── admin/             # Admin components
    │   ├── home/              # Homepage components
    │   ├── layout/            # Layout components
    │   └── ui/                # Reusable UI components
    ├── lib/
    │   ├── api/               # API client
    │   └── utils/             # Utility functions
    └── public/                # Static assets
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
cd Backend
npm install
# Create .env file with MongoDB URI, JWT_SECRET, etc.
npm run dev
```

Backend runs on: `http://localhost:5000`

### Frontend Setup

```bash
cd Frontend
npm install
# Create .env.local with NEXT_PUBLIC_API_URL=http://localhost:5000/api
npm run dev
```

Frontend runs on: `http://localhost:3000`

### Create Admin User

Create an admin user in MongoDB (see `QUICK_START.md` for details).

## ✨ Features

### Public Website
- ✅ Responsive homepage with booking form
- ✅ Vehicle browsing with filtering
- ✅ Vehicle details pages
- ✅ Public booking system
- ✅ About Us and Contact Us pages
- ✅ Modern UI with Tailwind CSS

### Admin Dashboard
- ✅ Dashboard with real-time KPIs
- ✅ Vehicle management
- ✅ Driver management with allowances
- ✅ Customer management
- ✅ Booking management with auto-pricing
- ✅ Payment tracking (receivables & payables)
- ✅ Expense management
- ✅ Reporting & Excel export
- ✅ Maintenance tracking

## 📖 Documentation

- **Quick Start**: See `QUICK_START.md` for setup instructions
- **System Documentation**: See `SYSTEM_DOCUMENTATION.md` for complete guide
- **Business Logic Audit**: See `BUSINESS_LOGIC_AUDIT_REPORT.md` for validation details

## 🔗 Routes

### Public Routes
- `/` → Redirects to `/pages/home`
- `/pages/home` → Homepage
- `/pages/vehicles` → Vehicle listing
- `/pages/vehicles/[id]` → Vehicle details
- `/pages/vehicles/[id]/book` → Booking page
- `/pages/about` → About Us
- `/pages/contact` → Contact Us
- `/pages/login` → Admin login

### Admin Routes (Protected)
- `/admin/dashboard` → Dashboard
- `/admin/vehicles` → Vehicle management
- `/admin/drivers` → Driver management
- `/admin/customers` → Customer management
- `/admin/bookings` → Booking management
- `/admin/payments` → Payment management
- `/admin/expenses` → Expense management
- `/admin/reports` → Reports & analytics

## 🔐 API Endpoints

### Public Endpoints (No Auth)
- `GET /api/public/vehicles/available` - Get available vehicles
- `GET /api/public/vehicles/:id` - Get vehicle details
- `POST /api/public/bookings` - Create public booking

### Admin Endpoints (Auth Required)
- See `Backend/README.md` for complete API documentation

## ✅ Development Status

**All Phases Complete:**
- ✅ Backend Foundation & API
- ✅ Database Models
- ✅ Core Business Logic
- ✅ Admin Dashboard
- ✅ Reporting & Export
- ✅ Public-Facing Website
- ✅ Integration & Testing

**The system is fully functional and production-ready!**

## 📝 License

ISC

