'use server'

import Payment from '@/models/Payment'
import connectDB from '@/db/connectDB'
import User from '@/models/User'
import Stripe from 'stripe'
import { sanitizeUser } from '@/utils/sanitizeUser'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)



export const initiate = async (amount, to_username, paymentform) => {
  try {
    await connectDB();

    // STEP 1: Create payment record first
    const newPayment = await Payment.create({
      amount: amount / 100,
      to_user: to_username,
      name: paymentform.name,
      message: paymentform.message,
      done: false,
    });

    // STEP 2: Pass the payment _id in metadata
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: {
            name: `Payment to ${to_username}`,
          },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/${to_username}?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/${to_username}?payment=cancel`,
      metadata: {
        payment_id: newPayment._id.toString(), // ⭐ Add this
        to_username,
        name: paymentform.name,
        message: paymentform.message || '',
      },
    });

    // STEP 3: Optionally update oid (Stripe session ID)
    newPayment.oid = session.id;
    await newPayment.save();

    return { id: session.id };
  } catch (error) {
    console.error('Error initiating Stripe payment:', error);
    throw new Error('Payment initiation failed');
  }
};





export const fetchUser = async (username) => {
  await connectDB()
  const user = await User.findOne({ username }).lean()
  return sanitizeUser(user)
}

export const fetchUser2 = async (email) => {
  await connectDB()
  const user = await User.findOne({ email }).lean()
  return sanitizeUser(user)
}

const totalRaisedAmount = async (usernames) => {
  try {
    const payments = await Payment.aggregate([
      {
        $match: {
          to_user: { $in: usernames },
          done: true,
        },
      },
      {
        $group: {
          _id: '$to_user',
          totalAmount: { $sum: '$amount' },
        },
      },
    ])

    return new Map(payments.map(p => [p._id, p.totalAmount]))
  } catch (error) {
    console.error('Error calculating total raised amount:', error)
    return new Map()
  }
}

export const fetchTopUsers = async () => {
  await connectDB()
  try {
    const users = await User.find({}).lean()
    const usernames = users.map(user => user.username)
    const paymentsMap = await totalRaisedAmount(usernames)

    const usersWithPayments = users.map(user => ({
      ...sanitizeUser(user),
      raisedFunds: paymentsMap.get(user.username) || 0,
    }))

    return usersWithPayments
      .sort((a, b) => b.raisedFunds - a.raisedFunds)
      .slice(0, 10)
  } catch (error) {
    console.error('Error fetching top users:', error)
    return []
  }
}

export const searchUser = async (searchTerm) => {
  await connectDB()
  try {
    const regex = new RegExp(searchTerm.trim(), 'i')
    const users = await User.find({
      $or: [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
        { project: { $regex: regex } },
      ],
    }).lean()

    const usernames = users.map(user => user.username)
    const paymentsMap = await totalRaisedAmount(usernames)

    return users.map(user => ({
      ...sanitizeUser(user),
      raisedFunds: paymentsMap.get(user.username) || 0,
    }))
  } catch (error) {
    console.error('Error searching users:', error)
    return []
  }
}

export const fetchPayments = async (username) => {
  await connectDB()
  const payments = await Payment.find({
    to_user: username,
    done: true,
  }).sort({ amount: -1 }).lean()
  return payments
}

export const updateUser = async (newData, oldUsername) => {
  try {
    await connectDB()

    if (oldUsername !== newData.username) {
      const usernameExist = await User.exists({ username: newData.username })
      if (usernameExist) {
        return { error: 'Username already exists' }
      }
    }

    await User.updateOne({ email: newData.email }, newData)
    await Payment.updateMany({ to_user: oldUsername }, { to_user: newData.username })

    return { success: true }
  } catch (error) {
    console.error('Error updating Profile:', error)
    return { error: 'Update failed' }
  }
}
