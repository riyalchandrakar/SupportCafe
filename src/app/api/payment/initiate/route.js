import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import Payment from '@/models/Payment';
import connectDB from '@/db/connectDB';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    await connectDB();
    const { amount, to_username, paymentform } = await request.json();

    console.debug('[DEV] Payment initiation started:', {
      amount,
      to_username,
      paymentform
    });

    // 1. Create Stripe session first
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: {
            name: `Support ${to_username}`
           },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/${to_username}?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/${to_username}?payment=cancel`,
      metadata: {
        to_username,
        payer_name: paymentform?.name || 'Anonymous'
      }
    });

    // 2. Now create payment with session ID
    const payment = await Payment.create({
      oid: `ord_${Date.now()}`,
      to_user: to_username,
      name: paymentform?.name || 'Anonymous',
      message: paymentform?.message || '',
      amount: amount,
      paymentId: session.id, // Now we have this value
      done: false
    });

    // 3. Update session with payment ID
    await stripe.checkout.sessions.update(session.id, {
      metadata: {
        ...session.metadata,
        payment_id: payment._id.toString()
      }
    });

    console.debug('[DEV] Payment created:', {
      paymentId: payment._id,
      sessionId: session.id,
      amount: amount / 100
    });

    return NextResponse.json({ 
      sessionId: session.id,
      paymentId: payment._id 
    });

  } catch (error) {
    console.error('[DEV] Payment failed:', {
      error: error.message,
      stack: process.env.DEBUG_PAYMENTS ? error.stack : undefined
    });
    return NextResponse.json(
      { error: 'Payment failed. Please try again.' },
      { status: 500 }
    );
  }
}