import { NextResponse } from 'next/server';
import Payment from '@/models/Payment';
import connectDB from '@/db/connectDB';

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 403 }
    );
  }

  try {
    await connectDB();
    const testPayments = await Payment.find({ environment: 'development' })
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json({
      _dev: {
        recent_payments: testPayments.map(p => ({
          id: p._id,
          amount: p.amount / 100,
          to_user: p.to_user,
          done: p.done,
          paymentId: p.paymentId,
          createdAt: p.createdAt
        })),
        stats: {
          completed: await Payment.countDocuments({ 
            environment: 'development', 
            done: true 
          }),
          pending: await Payment.countDocuments({ 
            environment: 'development', 
            done: false 
          })
        }
      }
    });

  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Dev test failed',
        _dev: { details: error.message } 
      },
      { status: 500 }
    );
  }
}