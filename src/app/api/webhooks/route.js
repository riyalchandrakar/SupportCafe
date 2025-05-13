// app/api/payment/webhook/route.js
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import Payment from '@/models/Payment'
import connectDB from '@/db/connectDB'

// New Next.js 14+ route config
export const dynamic = 'force-dynamic' // Ensure this is a dynamic route
export const runtime = 'nodejs' // Required for Stripe webhooks
export const fetchCache = 'force-no-store' // Disable caching

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(request) {
  // For raw body handling (replaces bodyParser: false)
  const payload = await request.text()
  const sig = request.headers.get('stripe-signature')

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )

    if (event.type === 'checkout.session.completed') {
      await connectDB()
      const session = event.data.object

      await Payment.findOneAndUpdate(
        { _id: session.metadata.payment_id },
        {
          done: true,
          paymentAt: new Date(),
          paymentId: session.id,
        },
        { upsert: true } // Consider adding upsert if needed
      )
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err.message)
    return NextResponse.json(
      { error: err.message }, 
      { status: 400 }
    )
  }
}