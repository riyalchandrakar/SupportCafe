'use client'
import { useSession, signOut } from "next-auth/react"
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import HashLoader from "react-spinners/HashLoader"

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const dropdownRef = useRef(null)
  const { data: session } = useSession()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSignOut = async () => {
    setIsLoading(true)
    await signOut()
    setIsLoading(false)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-16 bg-gradient-to-br from-purple-900 to-indigo-800">
        <HashLoader color="#d8b4fe" size={30} />
      </div>
    )
  }

  return (
    <nav className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 hover:scale-105 transition-transform"
          >
            <div className="p-1.5 rounded-md bg-white/10 backdrop-blur-sm border border-purple-400/30 shadow-lg">
              <Image 
                src="/icons/cafe.svg" 
                alt="SupportCafe Logo" 
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
              SupportCafe
            </span>
          </Link>

          {/* Auth Section */}
          <div className="flex items-center space-x-4" ref={dropdownRef}>
            {session ? (
              <>
                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 bg-purple-800/40 hover:bg-purple-700/60 transition-colors px-4 py-2 rounded-full border border-purple-500/30"
                  >
                    {session.user.image && (
                      <Image
                        src={session.user.image}
                        width={32}
                        height={32}
                        alt="User avatar"
                        className="rounded-full"
                      />
                    )}
                    <span className="font-medium">
                      {session.user.username || session.user.name}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-gradient-to-b from-purple-900/95 to-indigo-900/95 backdrop-blur-lg shadow-lg ring-1 ring-purple-500/30 z-50 overflow-hidden">
                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          className="flex items-center px-4 py-3 text-sm text-purple-100 hover:bg-purple-800/50 transition-colors"
                        >
                         
                          Dashboard
                        </Link>
                        <Link
                          href={`/${session.user.username}`}
                          className="flex items-center px-4 py-3 text-sm text-purple-100 hover:bg-purple-800/50 transition-colors"
                        >
                          
                          My Profile
                        </Link>
                        
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left flex items-center px-4 py-3 text-sm text-pink-300 hover:bg-purple-800/50 transition-colors"
                        >
                          
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>

               
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl flex items-center"
                >
                
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar