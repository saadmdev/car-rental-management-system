import { Inter } from 'next/font/google'
import './globals.css'
import ToastProvider from '@/components/admin/ui/ToastProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Car Rental - Experience the road like never before',
  description: 'Premium car rental service with a wide selection of vehicles',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <ToastProvider />
      </body>
    </html>
  )
}

