# Car Rental Website - Frontend

A modern, full-stack car rental web application built with Next.js.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Image Handling**: next/image
- **Fonts**: Next.js font optimization
- **Responsive design** (desktop first, mobile friendly)

## Getting Started

### Installation

1. Navigate to the Frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
Frontend/
├── app/
│   ├── pages/
│   │   ├── home/
│   │   │   └── page.js
│   │   ├── about/
│   │   │   └── page.js
│   │   ├── contact/
│   │   │   └── page.js
│   │   ├── vehicles/
│   │   │   ├── [id]/
│   │   │   │   └── page.js
│   │   │   └── page.js
│   │   └── details/
│   │       └── page.js
│   ├── layout.js
│   ├── globals.css
│   └── page.js (redirects to /pages/home)
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── home/
│   │   ├── Hero.jsx
│   │   ├── FeaturedCars.jsx
│   │   ├── Features.jsx
│   │   ├── InfoSection.jsx
│   │   ├── FactsInNumbers.jsx
│   │   ├── MobileApp.jsx
│   │   └── Newsletter.jsx
│   └── ui/
│       └── (all other reusable components)
├── lib/
│   └── data.js
└── public/
    └── assets/
```

## Routes

- `/` → Redirects to `/pages/home`
- `/pages/home` → Homepage
- `/pages/about` → About Us page
- `/pages/contact` → Contact Us page
- `/pages/vehicles` → Vehicles listing page
- `/pages/vehicles/[id]` → Vehicle details page
- `/pages/details` → Service details page

## Features

- ✅ Responsive design (desktop first, mobile friendly)
- ✅ Modern UI matching reference design
- ✅ Reusable component architecture
- ✅ Clean code structure
- ✅ Tailwind CSS styling
- ✅ Organized folder structure

## Development Status

**Phase 1**: Frontend setup and all pages ✅ Complete

- Homepage UI implementation
- All pages implemented
- Responsive design
- Component-based architecture
- Clean folder structure

## Next Steps

- Backend implementation
- Database integration
- Authentication
- Booking system
- Admin dashboard

