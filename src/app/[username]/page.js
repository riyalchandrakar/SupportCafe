// src/app/[username]/page.js
import { HashLoader } from 'react-spinners'
import PaymentPage from '../components/PaymentPage'
import { fetchUser } from '@/actions/userActions'

async function getPayments(username) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/payment/${username}`, {
      next: { revalidate: 30 } // Revalidate every 30 seconds
    })
    if (!res.ok) throw new Error('Failed to fetch payments')
    return await res.json()
  } catch (error) {
    console.error('Payment fetch error:', error)
    return []
  }
}

async function getUserData(username) {
  try {
    return await fetchUser(username)
  } catch (error) {
    console.error('User fetch error:', error)
    return null
  }
}

export default async function Profile({ params }) {
  const [user, payments] = await Promise.all([
    getUserData(params.username),
    getPayments(params.username)
  ])

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-2xl font-bold mb-6">
          User '{params.username}' not found
        </div>
        <HashLoader color="#3B82F6" size={50} />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <PaymentPage 
          username={params.username} 
          payments={payments}
          userData={user}
        />
        
        <div className="mt-12 bg-gray-800 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-6">Recent Supporters</h2>
          {payments.length > 0 ? (
            <ul className="space-y-4">
              {payments.map(payment => (
                <li key={payment._id} className="bg-gray-700/50 p-4 rounded-lg hover:bg-gray-700 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-blue-400">
                        {payment.name}
                      </p>
                      {payment.message && (
                        <p className="text-gray-300 mt-1">"{payment.message}"</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">₹{(payment.amount/100).toFixed(2)}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(payment.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">No payments received yet</p>
              <p className="text-sm text-gray-500">Be the first to support this creator!</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}