// DEPRECATED: This mock data is no longer used.
// Vehicles are now fetched from the backend API.
// Keeping this file for reference only - vehicleTypes, facts, and features are still used.

// Helper function to get car by ID (DEPRECATED - use API instead)
export const getCarById = (id) => {
  return null // Always return null - use API.getVehicleById() instead
}

// Mock data for cars (DEPRECATED - not used anymore)
// Vehicles should be created via Admin Dashboard and fetched from backend
export const cars = [
  {
    id: 1,
    brand: 'Mercedes',
    type: 'Sedan',
    price: 25,
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1617531653332-bd46c24f0068?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop',
    ],
    features: {
      transmission: 'Automat',
      fuel: 'PB 95',
      airConditioner: true,
    },
    specifications: {
      gearBox: 'Automat',
      fuel: 'Petrol',
      doors: 4,
      airConditioner: 'Yes',
      seats: 5,
      distance: '500',
    },
    equipment: ['ABS', 'Air Bags', 'Cruise Control', 'Air Conditioner', 'Bluetooth', 'GPS Navigation'],
  },
  {
    id: 2,
    brand: 'Mercedes',
    type: 'Sport',
    price: 50,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop',
    ],
    features: {
      transmission: 'Manual',
      fuel: 'PB 95',
      airConditioner: true,
    },
    specifications: {
      gearBox: 'Manual',
      fuel: 'Petrol',
      doors: 2,
      airConditioner: 'Yes',
      seats: 4,
      distance: '300',
    },
    equipment: ['ABS', 'Air Bags', 'Cruise Control', 'Air Conditioner', 'Sport Mode'],
  },
  {
    id: 3,
    brand: 'Mercedes',
    type: 'Sedan',
    price: 45,
    image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f0068?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1617531653332-bd46c24f0068?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1617531653332-bd46c24f0068?w=800&h=600&fit=crop',
    ],
    features: {
      transmission: 'Automat',
      fuel: 'PB 95',
      airConditioner: true,
    },
    specifications: {
      gearBox: 'Automat',
      fuel: 'Petrol',
      doors: 4,
      airConditioner: 'Yes',
      seats: 5,
      distance: '450',
    },
    equipment: ['ABS', 'Air Bags', 'Cruise Control', 'Air Conditioner', 'Leather Seats'],
  },
  {
    id: 4,
    brand: 'Porsche',
    type: 'SUV',
    price: 40,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
    ],
    features: {
      transmission: 'Automat',
      fuel: 'PB 95',
      airConditioner: true,
    },
    specifications: {
      gearBox: 'Automat',
      fuel: 'Petrol',
      doors: 5,
      airConditioner: 'Yes',
      seats: 7,
      distance: '600',
    },
    equipment: ['ABS', 'Air Bags', 'Cruise Control', 'Air Conditioner', '4WD', 'Roof Rack'],
  },
  {
    id: 5,
    brand: 'Toyota',
    type: 'Sedan',
    price: 35,
    image: 'https://images.unsplash.com/photo-1525609004556-c46c7d05cf01?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1525609004556-c46c7d05cf01?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1525609004556-c46c7d05cf01?w=800&h=600&fit=crop',
    ],
    features: {
      transmission: 'Manual',
      fuel: 'PB 95',
      airConditioner: true,
    },
    specifications: {
      gearBox: 'Manual',
      fuel: 'Petrol',
      doors: 4,
      airConditioner: 'Yes',
      seats: 5,
      distance: '400',
    },
    equipment: ['ABS', 'Air Bags', 'Air Conditioner', 'Bluetooth'],
  },
  {
    id: 6,
    brand: 'Porsche',
    type: 'SUV',
    price: 50,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
    ],
    features: {
      transmission: 'Automat',
      fuel: 'PB 95',
      airConditioner: true,
    },
    specifications: {
      gearBox: 'Automat',
      fuel: 'Petrol',
      doors: 5,
      airConditioner: 'Yes',
      seats: 7,
      distance: '550',
    },
    equipment: ['ABS', 'Air Bags', 'Cruise Control', 'Air Conditioner', '4WD', 'Premium Sound'],
  },
  {
    id: 7,
    brand: 'Mercedes',
    type: 'Van',
    price: 50,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
    ],
    features: {
      transmission: 'Automat',
      fuel: 'PB 95',
      airConditioner: true,
    },
    specifications: {
      gearBox: 'Automat',
      fuel: 'Petrol',
      doors: 4,
      airConditioner: 'Yes',
      seats: 8,
      distance: '700',
    },
    equipment: ['ABS', 'Air Bags', 'Cruise Control', 'Air Conditioner', 'Large Cargo Space'],
  },
  {
    id: 8,
    brand: 'Toyota',
    type: 'Sport',
    price: 60,
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop',
    ],
    features: {
      transmission: 'Manual',
      fuel: 'PB 95',
      airConditioner: true,
    },
    specifications: {
      gearBox: 'Manual',
      fuel: 'Petrol',
      doors: 2,
      airConditioner: 'Yes',
      seats: 4,
      distance: '350',
    },
    equipment: ['ABS', 'Air Bags', 'Cruise Control', 'Air Conditioner', 'Sport Mode', 'Racing Seats'],
  },
  {
    id: 9,
    brand: 'Maybach',
    type: 'Sedan',
    price: 70,
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1617531653332-bd46c24f0068?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop',
    ],
    features: {
      transmission: 'Automat',
      fuel: 'PB 95',
      airConditioner: true,
    },
    specifications: {
      gearBox: 'Automat',
      fuel: 'Petrol',
      doors: 4,
      airConditioner: 'Yes',
      seats: 5,
      distance: '650',
    },
    equipment: ['ABS', 'Air Bags', 'Cruise Control', 'Air Conditioner', 'Leather Seats', 'Premium Sound', 'Massage Seats'],
  },
  {
    id: 10,
    brand: 'BMW',
    type: 'Sedan',
    price: 25,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
    ],
    features: {
      transmission: 'Automat',
      fuel: 'Petrol',
      airConditioner: true,
    },
    specifications: {
      gearBox: 'Automat',
      fuel: 'Petrol',
      doors: 2,
      airConditioner: 'Yes',
      seats: 5,
      distance: '500',
    },
    equipment: ['ABS', 'Air Bags', 'Cruise Control', 'Air Conditioner', 'Convertible Top'],
  },
  {
    id: 11,
    brand: 'Ford',
    type: 'Pickup',
    price: 45,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
    ],
    features: {
      transmission: 'Manual',
      fuel: 'PB 95',
      airConditioner: true,
    },
    specifications: {
      gearBox: 'Manual',
      fuel: 'Petrol',
      doors: 4,
      airConditioner: 'Yes',
      seats: 5,
      distance: '550',
    },
    equipment: ['ABS', 'Air Bags', 'Cruise Control', 'Air Conditioner', 'Towing Package', 'Bed Liner'],
  },
  {
    id: 12,
    brand: 'Jeep',
    type: 'SUV',
    price: 42,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
    ],
    features: {
      transmission: 'Automat',
      fuel: 'PB 95',
      airConditioner: true,
    },
    specifications: {
      gearBox: 'Automat',
      fuel: 'Petrol',
      doors: 5,
      airConditioner: 'Yes',
      seats: 7,
      distance: '580',
    },
    equipment: ['ABS', 'Air Bags', 'Cruise Control', 'Air Conditioner', '4WD', 'Off-Road Package'],
  },
  {
    id: 13,
    brand: 'Toyota',
    type: 'Minivan',
    price: 38,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
    ],
    features: {
      transmission: 'Automat',
      fuel: 'PB 95',
      airConditioner: true,
    },
    specifications: {
      gearBox: 'Automat',
      fuel: 'Petrol',
      doors: 5,
      airConditioner: 'Yes',
      seats: 8,
      distance: '500',
    },
    equipment: ['ABS', 'Air Bags', 'Cruise Control', 'Air Conditioner', 'Sliding Doors', 'Third Row Seating'],
  },
  {
    id: 14,
    brand: 'Audi',
    type: 'Sedan',
    price: 48,
    image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f0068?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1617531653332-bd46c24f0068?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1617531653332-bd46c24f0068?w=800&h=600&fit=crop',
    ],
    features: {
      transmission: 'Automat',
      fuel: 'PB 95',
      airConditioner: true,
    },
    specifications: {
      gearBox: 'Automat',
      fuel: 'Petrol',
      doors: 4,
      airConditioner: 'Yes',
      seats: 5,
      distance: '520',
    },
    equipment: ['ABS', 'Air Bags', 'Cruise Control', 'Air Conditioner', 'Leather Seats', 'Premium Audio'],
  },
  {
    id: 15,
    brand: 'Mercedes',
    type: 'Cabriolet',
    price: 65,
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop',
    ],
    features: {
      transmission: 'Automat',
      fuel: 'PB 95',
      airConditioner: true,
    },
    specifications: {
      gearBox: 'Automat',
      fuel: 'Petrol',
      doors: 2,
      airConditioner: 'Yes',
      seats: 4,
      distance: '450',
    },
    equipment: ['ABS', 'Air Bags', 'Cruise Control', 'Air Conditioner', 'Convertible Top', 'Wind Deflector'],
  },
]

// Vehicle types for filtering
export const vehicleTypes = [
  { id: 'all', label: 'All vehicles', icon: 'car' },
  { id: 'sedan', label: 'Sedan', icon: 'sedan' },
  { id: 'cabriolet', label: 'Cabriolet', icon: 'cabriolet' },
  { id: 'pickup', label: 'Pickup', icon: 'pickup' },
  { id: 'suv', label: 'SUV', icon: 'suv' },
  { id: 'minivan', label: 'Minivan', icon: 'minivan' },
]

// Facts in numbers data
export const facts = [
  {
    id: 1,
    icon: 'car',
    number: '540+',
    label: 'Cars',
  },
  {
    id: 2,
    icon: 'users',
    number: '20k+',
    label: 'Customers',
  },
  {
    id: 3,
    icon: 'calendar',
    number: '25+',
    label: 'Years',
  },
  {
    id: 4,
    icon: 'map-pin',
    number: '20m+',
    label: 'Miles',
  },
]

// Features data
export const features = [
  {
    id: 1,
    icon: 'map-pin',
    title: 'Availability',
    description:
      'Cars available at multiple locations throughout the city. Pick up and drop off at your convenience with our extensive network of rental locations.',
  },
  {
    id: 2,
    icon: 'car',
    title: 'Comfort',
    description:
      'Drive in style and comfort with our premium fleet. All vehicles are regularly maintained and equipped with modern amenities for your journey.',
  },
  {
    id: 3,
    icon: 'wallet',
    title: 'Savings',
    description:
      'Competitive pricing with no hidden fees. Get the best value for your money with our transparent pricing and special offers for extended rentals.',
  },
]

