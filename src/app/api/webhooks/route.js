// app/api/payment/webhook/route.js
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import Payment from '@/models/Payment'
import connectDB from '@/db/connectDB'

export const config = {
  api: {
    bodyParser: false, // Important: required for Stripe
  },
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(request) {
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
        }
      )
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
