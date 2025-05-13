'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { fetchUser2, updateUser } from '@/actions/userActions'
import { ToastContainer, toast, Slide } from 'react-toastify'
import { PuffLoader } from 'react-spinners'
import Image from 'next/image'

const Dashboard = () => {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [form, setForm] = useState({
        stripeAccountId: '',
        stripePublishableKey: '',
        // Add other form fields here
    })
    const [isChange, setIsChange] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [changeInUsername, setChangeInUsername] = useState(false)

    const getUserData = useCallback(async () => {
        setIsLoading(true)
        try {
            const user = await fetchUser2(session?.user?.email)
            if (user) {
                setForm(prev => ({
                    ...prev,
                    stripeAccountId: user.stripeAccountId || '',
                    stripePublishableKey: user.stripePublishableKey || '',
                    // Map other user fields
                }))
                document.title = `Dashboard - ${user.name || 'Profile'}`
            } else {
                toast.error('User data not found', toastConfig)
                document.title = "Dashboard - User Not Found"
            }
        } catch (error) {
            console.error('Error fetching user data:', error)
            toast.error('Error fetching user data', toastConfig)
        } finally {
            setIsLoading(false)
        }
    }, [session])

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        } else if (status === 'authenticated') {
            getUserData()
        }
    }, [router, getUserData, status])

    const toastConfig = {
        position: "bottom-right",
        autoClose: 2500,
        closeOnClick: true,
        pauseOnHover: false,
        theme: "dark",
        transition: Slide
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        if (name === 'username') {
            setChangeInUsername(true)
        }
        setForm(prev => ({ ...prev, [name]: value }))
        setIsChange(true)
    }

    const validateStripeKeys = () => {
        if (form.stripeAccountId && !form.stripeAccountId.startsWith('acct_')) {
            toast.error('Invalid Stripe Account ID', toastConfig)
            return false
        }
        if (form.stripePublishableKey && !form.stripePublishableKey.startsWith('pk_')) {
            toast.error('Invalid Stripe Publishable Key', toastConfig)
            return false
        }
        return true
    }

    const handleSave = async (e) => {
        e.preventDefault()
        if (!validateStripeKeys()) return
        
        setIsSaving(true)
        try {
            const result = await updateUser(form, session.user.username)
            
            if (result?.error) {
                toast.error(result.error, toastConfig)
            } else {
                toast.success(changeInUsername ? 
                    'Username and profile updated successfully' : 
                    'Profile updated successfully', 
                    toastConfig
                )
                setChangeInUsername(false)
                setIsChange(false)
                // Refresh user data after update
                await getUserData()
            }
        } catch (error) {
            console.error('Error updating user:', error)
            toast.error('Profile update failed', toastConfig)
        } finally {
            setIsSaving(false)
        }
    }

    if (status === 'loading' || isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-b from-purple-900 to-indigo-900">
                <PuffLoader color="#d8b4fe" size={60} />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 text-white">
            <ToastContainer />
            <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {/* Profile Header */}
                <div className="flex flex-col items-center mb-12">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-purple-400/50 mb-4">
                        <Image
                            src={session?.user?.image || '/icons/user-default.png'}
                            alt={session?.user?.name || 'User'}
                            width={96}
                            height={96}
                            className="object-cover"
                        />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">
                        {session?.user?.name || 'Welcome Back'}
                    </h1>
                    <p className="text-purple-200">@{session?.user?.username || 'yourusername'}</p>
                </div>

                {/* Dashboard Content */}
                <div className="max-w-3xl mx-auto">
                    <div className="bg-gradient-to-b from-purple-800/30 to-indigo-800/30 p-8 rounded-xl backdrop-blur-sm border border-purple-500/20">
                        <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">
                            Payment Settings
                        </h2>
                        <p className="text-purple-200 mb-6">
                            Connect your Stripe account to start receiving payments from your supporters
                        </p>

                        <form onSubmit={handleSave}>
                            <div className="space-y-6">
                                {/* Stripe Account ID */}
                                <div>
                                    <label htmlFor="stripeAccountId" className="block text-sm font-medium text-purple-100 mb-2">
                                        Stripe Account ID
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="stripeAccountId"
                                            name="stripeAccountId"
                                            value={form.stripeAccountId}
                                            onChange={handleChange}
                                            className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="acct_xxxxxxxxxxxxx"
                                        />
                                        {form.stripeAccountId && (
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                {form.stripeAccountId.startsWith('acct_') ? (
                                                    <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <p className="mt-2 text-xs text-purple-300">
                                        Find this in your <a href="https://dashboard.stripe.com/settings/account" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-200">Stripe Dashboard</a>
                                    </p>
                                </div>

                                {/* Stripe Publishable Key */}
                                <div>
                                    <label htmlFor="stripePublishableKey" className="block text-sm font-medium text-purple-100 mb-2">
                                        Stripe Publishable Key
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="stripePublishableKey"
                                            name="stripePublishableKey"
                                            value={form.stripePublishableKey}
                                            onChange={handleChange}
                                            className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="pk_test_xxxxxxxxxxxxx"
                                        />
                                        {form.stripePublishableKey && (
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                {form.stripePublishableKey.startsWith('pk_') ? (
                                                    <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <p className="mt-2 text-xs text-purple-300">
                                        Find this in your <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-200">Stripe API Keys</a>
                                    </p>
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="mt-8 flex justify-center">
                                <button
                                    type="submit"
                                    disabled={!isChange || isSaving}
                                    className={`px-8 py-3 rounded-full font-medium transition-all duration-300 flex items-center justify-center
                                        ${isSaving 
                                            ? 'bg-purple-800 cursor-not-allowed' 
                                            : isChange 
                                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl cursor-pointer'
                                                : 'bg-purple-800/50 border border-purple-500/30 cursor-not-allowed'
                                        }`}
                                >
                                    {isSaving ? (
                                        <>
                                            <PuffLoader size={20} color="#ffffff" className="mr-2" />
                                            Saving...
                                        </>
                                    ) : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                   
                </div>
            </div>
        </div>
    )
}

export default Dashboard