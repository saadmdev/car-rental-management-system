# Quick Start Guide - Car Rental Admin Management System

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### Step 1: Backend Setup

```bash
# Navigate to Backend folder
cd Backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
# Edit .env and set:
# - MONGODB_URI (your MongoDB connection string)
# - JWT_SECRET (any random string)
# - FRONTEND_URL=http://localhost:3000

# Start backend server
npm run dev
```

Backend runs on: `http://localhost:5000`

### Step 2: Frontend Setup

```bash
# Open a NEW terminal
# Navigate to Frontend folder
cd Frontend

# Install dependencies
npm install

# Create .env.local file with:
# NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Start frontend server
npm run dev
```

Frontend runs on: `http://localhost:3000`

### Step 3: Create Admin User

You need to create an admin user in MongoDB. Use MongoDB Compass or command line:

```javascript
// In MongoDB, insert this document in the adminusers collection:
{
  username: "admin",
  email: "admin@carrental.com",
  password: "$2a$10$...", // Use bcrypt to hash "password123"
  fullName: "Admin User",
  role: "admin",
  isActive: true
}
```

**Quick Hash Generator** (Node.js):
```javascript
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('your-password', 10);
console.log(hash);
```

### Step 4: Login

1. Open browser: `http://localhost:3000` (redirects to `/pages/home`)
2. **Public Site**: Browse vehicles, view details, make bookings
3. **Admin Panel**: Click "Login" or go to `/pages/login`
4. Enter admin credentials
5. You'll be redirected to `/admin/dashboard`

### Step 5: Start Using

**Public Website:**
1. Browse vehicles at `/pages/vehicles`
2. View vehicle details and book directly
3. Use booking form on homepage or contact page

**Admin Dashboard:**
1. **Add Vehicles**: Go to Vehicles → Add Vehicle
   - Set `status: 'available'` and `isActive: true` to show on public site
2. **Add Customers**: Go to Customers → Add Customer
   - (Customers are auto-created from public bookings)
3. **Create Booking**: Go to Bookings → New Booking
   - Or manage bookings created from public site
4. **View Reports**: Go to Reports

## 📋 Common Commands

### Backend
```bash
npm run dev    # Development mode (auto-reload)
npm start      # Production mode
```

### Frontend
```bash
npm run dev    # Development mode
npm run build  # Build for production
npm start      # Production mode
```

## ⚠️ Troubleshooting

**Backend won't start?**
- Check MongoDB is running
- Check port 5000 is free
- Verify .env file exists and has correct values

**Frontend can't connect?**
- Check backend is running on port 5000
- Verify NEXT_PUBLIC_API_URL in .env.local
- Check browser console for errors

**Can't login?**
- Verify admin user exists in database
- Check password is correctly hashed
- Clear browser localStorage

## 📚 Full Documentation

- **Complete Guide**: See `SYSTEM_DOCUMENTATION.md` for full system documentation
- **Business Logic**: See `BUSINESS_LOGIC_AUDIT_REPORT.md` for validation details
- **Main README**: See `README.md` for project overview

---

**That's it! You're ready to use the system.** 🎉

