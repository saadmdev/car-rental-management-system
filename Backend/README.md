# Car Rental Admin Management System - Backend

Backend API for the Car Rental Admin Management System built with Node.js, Express, and MongoDB.

## Tech Stack

- **Runtime**: Node.js (ES6 Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **File Uploads**: Multer
- **Validation**: express-validator

## Project Structure

```
Backend/
├── src/
│   ├── config/          # Configuration files (database, env)
│   ├── models/          # MongoDB schemas
│   ├── controllers/     # Route controllers
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── middleware/      # Custom middleware
│   └── utils/           # Utility functions
├── uploads/             # File uploads directory
├── .env                 # Environment variables (create from .env.example)
├── .gitignore
├── package.json
├── server.js            # Entry point
└── README.md
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd Backend
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Update the following variables in `.env`:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A strong secret key for JWT tokens
- `PORT`: Server port (default: 5000)
- `FRONTEND_URL`: Frontend URL for CORS

### 3. Start MongoDB

Make sure MongoDB is running on your system or use MongoDB Atlas.

### 4. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user (protected)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get all bookings (with filters & pagination)
- `GET /api/bookings/:id` - Get booking by ID
- `PUT /api/bookings/:id` - Update booking
- `PATCH /api/bookings/:id/status` - Update booking status
- `GET /api/bookings/calculate-pricing` - Preview booking pricing

### Vehicles
- `POST /api/vehicles` - Create vehicle
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/available` - Get available vehicles
- `GET /api/vehicles/:id` - Get vehicle by ID
- `PUT /api/vehicles/:id` - Update vehicle
- `PATCH /api/vehicles/:id/status` - Update vehicle status

### Drivers
- `POST /api/drivers` - Create driver
- `GET /api/drivers` - Get all drivers
- `GET /api/drivers/active` - Get active drivers
- `GET /api/drivers/:id` - Get driver by ID
- `PUT /api/drivers/:id` - Update driver
- `PATCH /api/drivers/:id/status` - Update driver status

### Customers
- `POST /api/customers` - Create customer
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get customer by ID
- `GET /api/customers/:id/bookings` - Get customer booking history
- `PUT /api/customers/:id` - Update customer

### Vendors
- `POST /api/vendors` - Create vendor
- `GET /api/vendors` - Get all vendors
- `GET /api/vendors/active` - Get active vendors
- `GET /api/vendors/:id` - Get vendor by ID
- `PUT /api/vendors/:id` - Update vendor

### Expenses
- `POST /api/expenses` - Create expense
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/summary` - Get expense summary by category
- `GET /api/expenses/total` - Get total expenses
- `GET /api/expenses/:id` - Get expense by ID

### Payments
- `POST /api/payments` - Create payment
- `GET /api/payments` - Get all payments
- `GET /api/payments/receivables/summary` - Get receivables summary
- `GET /api/payments/payables/summary` - Get payables summary
- `GET /api/payments/receivables/outstanding` - Get outstanding receivables
- `GET /api/payments/:id` - Get payment by ID

### Maintenance
- `POST /api/maintenance` - Create maintenance log
- `GET /api/maintenance` - Get all maintenance logs
- `GET /api/maintenance/upcoming` - Get upcoming maintenance
- `GET /api/maintenance/vehicle/:vehicleId` - Get vehicle maintenance history
- `GET /api/maintenance/:id` - Get maintenance log by ID
- `PUT /api/maintenance/:id` - Update maintenance log

### Reports
- `GET /api/reports/dashboard` - Get dashboard summary
- `GET /api/reports/income-expense` - Get monthly income vs expenses
- `GET /api/reports/vehicle-performance` - Get vehicle performance report
- `GET /api/reports/driver-performance` - Get driver performance report

### Health Check
- `GET /api/health` - Check if API is running

**Note:** All endpoints except `/api/auth/login` and `/api/health` require authentication (JWT token in Authorization header).

## Development Status

**Phase 1: Backend Foundation** ✅
- Express server setup
- MongoDB connection
- Environment configuration
- JWT authentication utilities
- Password hashing utilities
- File upload configuration
- Error handling middleware
- Authentication middleware

**Phase 2: Database Models** ✅
- AdminUser model (admin authentication & management)
- Vehicle model (own/vendor/outsourced vehicles with full specs)
- Vendor model (external vehicle providers)
- Customer model (individual & company customers)
- Driver model (driver management with allowances)
- Booking model (rental bookings with pricing & tracking)
- Expense model (operational expenses)
- Payment model (receivables & payables)
- MaintenanceLog model (vehicle service history)

**Phase 3: Core Business Logic** ✅
- Booking Service (pricing calculations, driver charges, allowances)
- Expense Service (expense tracking, summaries)
- Payment Service (receivables, payables, balance tracking)
- Reporting Service (dashboard, income/expense reports, vehicle/driver performance)
- Vehicle Service (CRUD, status management)
- Driver Service (CRUD, allowance configuration)
- Customer Service (CRUD, booking history)
- Vendor Service (CRUD, active vendors)
- Maintenance Service (maintenance logs, upcoming services)
- Auth Service (admin login, JWT authentication)
- All routes protected with authentication & admin role middleware

**Phase 4: Admin Dashboard (Frontend)** ✅
- Protected admin routes with authentication
- Responsive sidebar navigation
- Dashboard with real-time KPIs
- Data tables with pagination
- All entity listing pages (Vehicles, Drivers, Customers, Vendors, Bookings, Payments, Expenses)
- Reports page with tabs and filters

**Phase 5: Reporting & Export** ✅
- Excel export functionality (ExcelJS)
- Date range filtering
- Advanced aggregation pipelines
- Export buttons on all relevant pages
- Income vs Expenses reports
- Vehicle and Driver performance reports

**Phase 6: Integration** ✅
- Toast notification system (react-hot-toast)
- Modal component
- Reusable form components (Input, Select, Textarea, FileUpload)
- Form validation utilities
- Create/Edit pages for all entities
- Centralized error handling
- Success/error notifications
- File upload support

## Notes

- All routes will be prefixed with `/api`
- JWT tokens are required for protected routes
- Admin routes require `role: 'admin'` in JWT payload
- File uploads are stored in `/uploads` directory
- Maximum file size: 5MB (configurable)

