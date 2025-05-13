// src/app/[username]/page.js
import { HashLoader } from 'react-spinners'
import PaymentPage from '../components/PaymentPage'
import { fetchUser } from '@/actions/userActions'
import Image from 'next/image'

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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 text-white">
        <div className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">
          Creator not found
        </div>
        <p className="text-purple-200 mb-8">@{params.username} doesn't exist yet</p>
        <HashLoader color="#d8b4fe" size={50} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-8 items-center mb-12 bg-gradient-to-b from-purple-800/30 to-indigo-800/30 p-8 rounded-xl backdrop-blur-sm border border-purple-500/20">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-purple-400/50">
            <Image
              src={user.avatar || '/icons/user-default.svg'}
              alt={user.name}
              width={118}
              height={110}
              className="object-cover"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">
              {user.name}
            </h1>
            <p className="text-xl text-purple-200 mb-4">@{user.username}</p>
            {user.project && (
              <p className="text-lg text-purple-100 max-w-2xl">
                {user.project}
              </p>
            )}
          </div>
        </div>

        {/* Payment Component */}
        <PaymentPage 
          username={params.username} 
          payments={payments}
          userData={user}
        />

        {/* Supporters Section */}
        <div className="mt-16 bg-gradient-to-b from-purple-800/30 to-indigo-800/30 p-8 rounded-xl backdrop-blur-sm border border-purple-500/20">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">
            Recent Supporters
          </h2>
          
          {payments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {payments.map(payment => (
                <div 
                  key={payment._id}
                  className="bg-purple-900/30 p-6 rounded-lg border border-purple-500/20 hover:border-purple-400/40 transition-all hover:shadow-lg hover:shadow-purple-500/10"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-lg text-white">
                        {payment.name || 'Anonymous'}
                      </p>
                      {payment.message && (
                        <p className="text-purple-200 mt-2 italic">"{payment.message}"</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">
                        ₹{(payment.amount/100).toFixed(2)}
                      </p>
                      <p className="text-sm text-purple-300 mt-1">
                        {new Date(payment.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-block p-6 bg-purple-800/30 rounded-full mb-4">
                <svg className="w-12 h-12 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-purple-100 mb-2">No supporters yet</h3>
              <p className="text-purple-200">Be the first to support this creator!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}