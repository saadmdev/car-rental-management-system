/**
 * API Client
 * Handles all HTTP requests to the backend API
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

/**
 * Get auth token from localStorage
 */
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken')
  }
  return null
}

/**
 * Make API request
 */
const apiRequest = async (endpoint, options = {}, isPublic = false) => {
  const token = getAuthToken()
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      // Only add auth token if not a public endpoint
      ...(!isPublic && token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    const data = await response.json()

    if (!response.ok) {
      const error = new Error(data.message || 'An error occurred')
      error.response = { status: response.status, data }
      throw error
    }

    return data
  } catch (error) {
    // Re-throw with response info if available
    if (error.response) {
      throw error
    }
    // Network or other errors
    const networkError = new Error(error.message || 'Network error')
    networkError.request = true
    throw networkError
  }
}

/**
 * API Methods
 */
export const api = {
  // Auth
  login: (email, password) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getCurrentUser: () => apiRequest('/auth/me'),

  // Bookings
  getBookings: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/bookings?${queryString}`)
  },
  getBookingById: (id) => apiRequest(`/bookings/${id}`),
  createBooking: (data) =>
    apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateBooking: (id, data) =>
    apiRequest(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  updateBookingStatus: (id, status, reason) =>
    apiRequest(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reason }),
    }),
  calculatePricing: (data) =>
    apiRequest('/bookings/calculate-pricing', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Vehicles
  getVehicles: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/vehicles?${queryString}`)
  },
  getAvailableVehicles: () => apiRequest('/public/vehicles/available', {}, true), // Public endpoint
  getVehicleById: (id) => apiRequest(`/public/vehicles/${id}`, {}, true), // Public endpoint
  createPublicBooking: (data) =>
    apiRequest('/public/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true), // Public endpoint
  getVehicleByIdAdmin: (id) => apiRequest(`/vehicles/${id}`), // Admin endpoint
  createVehicle: (data) =>
    apiRequest('/vehicles', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateVehicle: (id, data) =>
    apiRequest(`/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  updateVehicleStatus: (id, status) =>
    apiRequest(`/vehicles/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  deleteVehicle: (id) =>
    apiRequest(`/vehicles/${id}`, {
      method: 'DELETE',
    }),

  // Drivers
  getDrivers: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/drivers?${queryString}`)
  },
  getActiveDrivers: () => apiRequest('/drivers/active'),
  getDriverById: (id) => apiRequest(`/drivers/${id}`),
  createDriver: (data) =>
    apiRequest('/drivers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateDriver: (id, data) =>
    apiRequest(`/drivers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  updateDriverStatus: (id, status) =>
    apiRequest(`/drivers/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  deleteDriver: (id) =>
    apiRequest(`/drivers/${id}`, {
      method: 'DELETE',
    }),

  // Customers
  getCustomers: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/customers?${queryString}`)
  },
  getCustomerById: (id) => apiRequest(`/customers/${id}`),
  getCustomerBookings: (id) => apiRequest(`/customers/${id}/bookings`),
  createCustomer: (data) =>
    apiRequest('/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCustomer: (id, data) =>
    apiRequest(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deactivateCustomer: (id) =>
    apiRequest(`/customers/${id}/deactivate`, {
      method: 'PATCH',
    }),

  // Vendors
  getVendors: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/vendors?${queryString}`)
  },
  getActiveVendors: () => apiRequest('/vendors/active'),
  getVendorById: (id) => apiRequest(`/vendors/${id}`),
  createVendor: (data) =>
    apiRequest('/vendors', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateVendor: (id, data) =>
    apiRequest(`/vendors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deactivateVendor: (id) =>
    apiRequest(`/vendors/${id}/deactivate`, {
      method: 'PATCH',
    }),

  // Expenses
  getExpenses: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/expenses?${queryString}`)
  },
  getExpenseById: (id) => apiRequest(`/expenses/${id}`),
  getExpenseSummary: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/expenses/summary?${queryString}`)
  },
  getTotalExpenses: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/expenses/total?${queryString}`)
  },
  createExpense: (data) =>
    apiRequest('/expenses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Payments
  getPayments: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/payments?${queryString}`)
  },
  getPaymentById: (id) => apiRequest(`/payments/${id}`),
  getReceivablesSummary: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/payments/receivables/summary?${queryString}`)
  },
  getPayablesSummary: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/payments/payables/summary?${queryString}`)
  },
  getOutstandingReceivables: () =>
    apiRequest('/payments/receivables/outstanding'),
  createPayment: (data) =>
    apiRequest('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  markPaymentAsReceived: (id) =>
    apiRequest(`/payments/${id}/received`, {
      method: 'PATCH',
    }),

  // Maintenance
  getMaintenanceLogs: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/maintenance?${queryString}`)
  },
  getMaintenanceLogById: (id) => apiRequest(`/maintenance/${id}`),
  getUpcomingMaintenance: () => apiRequest('/maintenance/upcoming'),
  getVehicleMaintenanceHistory: (vehicleId) =>
    apiRequest(`/maintenance/vehicle/${vehicleId}`),
  createMaintenanceLog: (data) =>
    apiRequest('/maintenance', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateMaintenanceLog: (id, data) =>
    apiRequest(`/maintenance/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Reports
  getDashboardSummary: () => apiRequest('/reports/dashboard'),
  getMonthlyIncomeExpenseReport: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/reports/income-expense?${queryString}`)
  },
  getIncomeExpenseReportByDateRange: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/reports/income-expense/range?${queryString}`)
  },
  getVehiclePerformanceReport: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/reports/vehicle-performance?${queryString}`)
  },
  getAllVehiclesPerformanceReport: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/reports/vehicles-performance?${queryString}`)
  },
  getDriverPerformanceReport: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/reports/driver-performance?${queryString}`)
  },
  getAllDriversPerformanceReport: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/reports/drivers-performance?${queryString}`)
  },
  // Export
  exportBookings: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return `${API_BASE_URL}/export/bookings?${queryString}`
  },
  exportExpenses: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return `${API_BASE_URL}/export/expenses?${queryString}`
  },
  exportPayments: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return `${API_BASE_URL}/export/payments?${queryString}`
  },
  exportIncomeExpense: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return `${API_BASE_URL}/export/income-expense?${queryString}`
  },
}

export default api

