'use client';
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { fetchPayments, fetchUser } from "@/actions/userActions";
import { ToastContainer, toast, Slide } from 'react-toastify';
import { useRouter } from "next/navigation";
import { HashLoader } from "react-spinners";
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Generate metadata for the page (replaces document.title)
export function generateMetadata({ params }) {
    return {
        title: `Support - ${params.username}`, // Dynamically set the title
    };
}

const PaymentPage = ({ username }) => {
    const [loading, setLoading] = useState(true);
    const [paymentform, setPaymentform] = useState({
        name: '',
        message: '',
        amount: '',
        email: ''
    });
    const [currentUser, setCurrentUser] = useState({});
    const [payments, setPayments] = useState([]);
    const [stripeLoading, setStripeLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPaymentform({ 
            ...paymentform, 
            [name]: sanitizeInput(value) 
        });
    };

    const sanitizeInput = (input) => {
        return input.replace(/<[^>]*>?/gm, '');
    };

    const getData = useCallback(async () => {
        try {
            let getUser = await fetchUser(username);
            getUser = JSON.parse(JSON.stringify(getUser));
            setCurrentUser(getUser);
            
            let dbPayments = await fetchPayments(username);
            dbPayments = dbPayments.map(payment => JSON.parse(JSON.stringify(payment)));
            setPayments(dbPayments);
        } catch (error) {
            console.error("Error getting Data:", error);
        }
    }, [username]);

    useEffect(() => {
        getData();
    }, [getData]);

    const pay = async (amount) => {
        // Validate inputs
        if (!paymentform.name) {
            toast.error('Name is Required', {
                position: "bottom-right",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: false,
                theme: "dark",
                transition: Slide
            });
            return;
        }

        if (amount < 100) {
            toast.error('Amount must be at least ₹1', {
                position: "bottom-right",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: false,
                theme: "dark",
                transition: Slide
            });
            return;
        }

        setStripeLoading(true);
        
        try {
            // Create Stripe checkout session
            const response = await fetch('/api/payment/initiate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: amount,
                    to_username: username,
                    paymentform: {
                        name: paymentform.name,
                        message: paymentform.message || '',
                        email: paymentform.email || ''
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create payment session');
            }

            const { sessionId } = await response.json();
            const stripe = await stripePromise;
            
            // Redirect to Stripe checkout
            const { error } = await stripe.redirectToCheckout({
                sessionId: sessionId
            });

            if (error) {
                throw error;
            }
        } catch (error) {
            console.error("Payment initiation failed:", error);
            toast.error(error.message || "Payment initiation failed", {
                position: "bottom-right",
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: false,
                theme: "dark",
                transition: Slide
            });
        } finally {
            setStripeLoading(false);
        }
    };

    return (
        <>
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <HashLoader color={"#ffffff"} loading={loading} size={30} />
                </div>
            ) : (
                <>
                    <ToastContainer />
                    <div className='cover w-full relative'>
                        <img 
                            className="object-cover w-full h-48 md:h-56 lg:h-56 opacity-85" 
                            alt="" 
                            src={currentUser.coverPic || "https://cdn.dribbble.com/users/3212981/screenshots/6751662/untitled-10_4x.jpg"} 
                        />
                        <div className="absolute -bottom-10 md:-bottom-20 left-1/2 transform -translate-x-1/2 border-2 border-white rounded-full">
                            <img 
                                src={currentUser.profilePic || "/icons/avatar.gif"} 
                                className='rounded-full w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36' 
                                alt="User" 
                            />
                        </div>
                    </div>

                    <div className='info flex justify-center items-center mt-10 mb-10 md:mt-20 md:mb-24 flex-col'>
                        <div className="font-bold text-lg">@{username}</div>
                        <div className='text-slate-400'>Let's help {username} to get a Chai</div>
                        <div className='text-slate-400'>
                            {payments.length} Payments Received • ₹ {payments.reduce((a, b) => a + b.amount, 0)} raised
                        </div>
                        {currentUser.project && (
                            <div className="container font-bold flex flex-col gap-2 bg-slate-900 p-5 mt-5 rounded-xl w-[70vw]">
                                <div className="m-auto">
                                    Project: {currentUser.project} 
                                    {currentUser.projectLink && (
                                        <Link className='text-text ml-2' href={currentUser.projectLink}>
                                            [Link]
                                        </Link>
                                    )}
                                </div>
                                {currentUser.projectDescription && (
                                    <div className="m-auto">Project Description: {currentUser.projectDescription}</div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className='flex items-center justify-around'>
                        <div className="payment flex justify-center gap-5 w-[95%] mb-11 flex-col md:flex-row">
                            <div className="supporters w-full md:w-1/2 bg-slate-900 rounded-lg text-white p-10">
                                <h2 className='text-2xl font-bold my-5'>Top Supporters</h2>
                                <ul className='mx-5 text-lg max-h-72 overflow-y-scroll custom-scrollbar'>
                                    {payments.slice(0, 7).map((p, i) => (
                                        <li key={i} className="my-2 flex gap-2 items-center">
                                            <img 
                                                src="/icons/avatar.gif" 
                                                className="h-fit" 
                                                width={30} 
                                                alt="Supporter" 
                                            />
                                            <span>
                                                {p.name} <span className='font-bold'>₹{p.amount}</span>
                                                {p.message && `. Message: "${p.message}"`}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <style jsx>
                                {`
                                    .custom-scrollbar::-webkit-scrollbar {
                                        display: none;
                                    }
                                    .custom-scrollbar {
                                        -ms-overflow-style: none;
                                        scrollbar-width: none;
                                    }
                                `}
                            </style>

                            <div className="makePayment w-full md:w-1/2 bg-slate-900 rounded-lg text-white p-10">
                                <h2 className="text-2xl font-bold my-5">Make a Payment</h2>
                                <div className="flex gap-5 md:gap-2 flex-col">
                                    <div>
                                        <input 
                                            onChange={handleChange} 
                                            value={paymentform.name} 
                                            type="text" 
                                            className='w-full p-3 rounded-lg bg-slate-800' 
                                            name="name" 
                                            placeholder='Enter Name*' 
                                            required 
                                        />
                                    </div>
                                    <input 
                                        onChange={handleChange} 
                                        value={paymentform.email} 
                                        type="email" 
                                        className='w-full p-3 rounded-lg bg-slate-800' 
                                        name="email" 
                                        placeholder='Enter Email (for receipt)' 
                                    />
                                    <input 
                                        onChange={handleChange} 
                                        value={paymentform.message} 
                                        type="text" 
                                        className='w-full p-3 rounded-lg bg-slate-800' 
                                        name="message" 
                                        placeholder='Enter Message (optional)' 
                                    />
                                    <input 
                                        onChange={handleChange} 
                                        value={paymentform.amount} 
                                        type="number" 
                                        className='w-full p-3 rounded-lg bg-slate-800' 
                                        name="amount" 
                                        placeholder='Enter Amount in ₹' 
                                        min="1"
                                    />

                                    <div className='flex justify-center items-center'>
                                        <button 
                                            type="button" 
                                            onClick={() => pay(paymentform.amount * 100 || 0)} 
                                            disabled={stripeLoading}
                                            className={`text-white w-48 hover:w-[70%] bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-primary-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 transition-all duration-300 ease-in-out ${
                                                stripeLoading ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                        >
                                            {stripeLoading ? 'Processing...' : 'Pay Now'}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex gap-5 mt-5 justify-center flex-wrap">
                                    <button 
                                        className='bg-slate-800 p-3 rounded-lg hover:bg-primary transition-colors' 
                                        onClick={() => pay(1000)} 
                                        disabled={stripeLoading}
                                    >
                                        Pay ₹10
                                    </button>
                                    <button 
                                        className='bg-slate-800 p-3 rounded-lg hover:bg-primary transition-colors' 
                                        onClick={() => pay(10000)} 
                                        disabled={stripeLoading}
                                    >
                                        Pay ₹100
                                    </button>
                                    <button 
                                        className='bg-slate-800 p-3 rounded-lg hover:bg-primary transition-colors' 
                                        onClick={() => pay(50000)} 
                                        disabled={stripeLoading}
                                    >
                                        Pay ₹500
                                    </button>
                                    <button 
                                        className='bg-slate-800 p-3 rounded-lg hover:bg-primary transition-colors' 
                                        onClick={() => pay(100000)} 
                                        disabled={stripeLoading}
                                    >
                                        Pay ₹1000
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default PaymentPage;
