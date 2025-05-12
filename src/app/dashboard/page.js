'use client'
import React, { useEffect, useState } from 'react'
import { HashLoader } from 'react-spinners'
import Dashboard from '../components/Dashboard'

const DashboardPage = ({ params }) => {
  const [loading, setLoading] = useState(true) // Initialize as true
  const [error, setError] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    // Cleanup function
    return () => clearTimeout(timer)
  }, [])

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error loading dashboard: {error.message}
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <HashLoader 
            color="#3B82F6" // Blue-500 instead of white for better visibility
            loading={loading}
            size={50}
            aria-label="Loading Dashboard"
          />
          <span className="sr-only">Loading Dashboard...</span>
        </div>
      ) : (
        <Dashboard />
      )}
    </div>
  )
}

export default DashboardPage