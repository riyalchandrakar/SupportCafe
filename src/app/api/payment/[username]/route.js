// src/app/api/payments/[username]/route.js
import { NextResponse } from 'next/server'
import Payment from '@/models/Payment'
import connectDB from '@/db/connectDB'

export async function GET(request, { params }) {
  try {
    await connectDB()
    
    // Correct query (matches your schema)
    const payments = await Payment.find({ 
      to_user: params.username,  // Field name in your schema
      done: true                 // Only fetch completed payments
    }).sort({ paymentAt: -1 })   // Sort by payment date (newest first)
    
    console.log("Fetched payments:", payments) // Debug log
    return NextResponse.json(payments)
    
  } catch (error) {
    console.error("Payment fetch error:", error)
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}