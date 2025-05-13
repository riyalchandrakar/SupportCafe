'use client'
import React, { useEffect } from 'react'
import { useSession, signIn } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { ToastContainer, toast, Slide } from 'react-toastify'
import Image from 'next/image'

const Login = () => {
    const { data: session } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (session) {
            router.push('/dashboard')
        }
    }, [session, router])

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 text-white">
            <ToastContainer />
            <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
                {/* Hero Section */}
                <div className="text-center mb-12 max-w-2xl">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">
                        Welcome Back to Support Cafe
                    </h1>
                    <p className="text-lg text-purple-100">
                        Join our community of creators and supporters. Login to manage your campaigns or support your favorite creators.
                    </p>
                </div>

                {/* Login Cards */}
                <div className="w-full max-w-md space-y-6">
                    <div className="bg-gradient-to-b from-purple-800/30 to-indigo-800/30 p-8 rounded-xl backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/40 transition-all hover:shadow-lg hover:shadow-purple-500/10">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-white mb-2">Get Started</h2>
                            <p className="text-purple-200">Choose your preferred login method</p>
                        </div>

                        <div className="space-y-4">
                            {/* Google Login */}
                            <button
                                onClick={() => signIn("google")}
                                className="w-full flex items-center justify-center gap-3 bg-white/90 hover:bg-white transition-all text-gray-800 font-medium py-3 px-4 rounded-lg border border-gray-200/50 shadow-sm"
                            >
                                <div className="w-6 h-6 relative">
                                    <Image 
                                        src="https://authjs.dev/img/providers/google.svg" 
                                        alt="Google logo" 
                                        width={24} 
                                        height={24} 
                                    />
                                </div>
                                <span>Continue with Google</span>
                            </button>

                            {/* GitHub Login */}
                            <button
                                onClick={() => signIn("github")}
                                className="w-full flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-700 transition-all text-white font-medium py-3 px-4 rounded-lg border border-gray-700 shadow-sm"
                            >
                                <div className="w-6 h-6 relative">
                                    <Image 
                                        src="https://authjs.dev/img/providers/github.svg" 
                                        alt="GitHub logo" 
                                        width={24} 
                                        height={24} 
                                    />
                                </div>
                                <span>Continue with GitHub</span>
                            </button>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-purple-200">
                                By continuing, you agree to our <a href="#" className="text-purple-300 hover:underline">Terms</a> and <a href="#" className="text-purple-300 hover:underline">Privacy Policy</a>
                            </p>
                        </div>
                    </div>

                    {/* Guest Option */}
                    <div className="text-center">
                        <p className="text-purple-200">
                            Want to explore first?{' '}
                            <button 
                                onClick={() => router.push('/profiles')} 
                                className="text-purple-300 font-medium hover:underline"
                            >
                                Browse as guest
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login