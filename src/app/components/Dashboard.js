'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { fetchUser2, updateUser } from '@/actions/userActions'
import { ToastContainer, toast, Slide } from 'react-toastify'
import { PuffLoader } from 'react-spinners'

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
            <div className="flex justify-center items-center h-screen">
                <PuffLoader color="#3B82F6" size={60} />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <ToastContainer />
            <div className="container mx-auto py-8 px-4 md:px-6">
                <h1 className='text-center my-6 text-3xl font-bold text-gray-900 dark:text-white'>
                    Welcome to Your Dashboard
                </h1>

                <form className='max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md' onSubmit={handleSave}>
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-4 text-text dark:text-white">
                            Stripe Integration
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                            Add your Stripe credentials to accept payments
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="stripeAccountId" className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                                    Stripe Account ID
                                </label>
                                <input 
                                    type="text" 
                                    value={form.stripeAccountId} 
                                    onChange={handleChange} 
                                    name='stripeAccountId' 
                                    id='stripeAccountId' 
                                    className='block w-full p-2.5 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' 
                                    placeholder="acct_xxxxxxxxxxxxx"
                                />
                            </div>

                            <div>
                                <label htmlFor="stripePublishableKey" className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                                    Stripe Publishable Key
                                </label>
                                <input 
                                    type="text" 
                                    value={form.stripePublishableKey} 
                                    onChange={handleChange} 
                                    name='stripePublishableKey' 
                                    id='stripePublishableKey' 
                                    className='block w-full p-2.5 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' 
                                    placeholder="pk_test_xxxxxxxxxxxxx"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center mt-8">
                        <button
                            type="submit"
                            disabled={!isChange || isSaving}
                            className={`w-full md:w-48 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center flex justify-center items-center transition-all
                                ${isSaving 
                                    ? 'bg-gray-500 cursor-not-allowed' 
                                    : isChange 
                                        ? 'bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 cursor-pointer'
                                        : 'bg-gray-800 hover:bg-primary focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-800 dark:hover:bg-primary dark:focus:ring-gray-700'
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
    )
}

export default Dashboard