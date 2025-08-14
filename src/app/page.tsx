'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const VIT_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@vitbhopal\.ac\.in$/

export default function Home() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const storedEmail = localStorage.getItem('vit-email')
    if (storedEmail && VIT_EMAIL_REGEX.test(storedEmail)) {
      router.push('/waiting')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!VIT_EMAIL_REGEX.test(email)) {
      setError('Please enter a valid VIT Bhopal email address (e.g., your.name@vitbhopal.ac.in)')
      setIsLoading(false)
      return
    }

    try {
      localStorage.setItem('vit-email', email)
      router.push('/waiting')
    } catch (err) {
      setError('Failed to save email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">VIT Meet</h1>
          <p className="text-gray-600 mb-6">
            Random video chat for VIT Bhopal students
          </p>
        </div>
        <div className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Enter your VIT email
              </label>
              <input
                id="email"
                type="email"
                placeholder="your.name@vitbhopal.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
            
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Enter Chat'}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Only VIT Bhopal students with valid email addresses can access this platform.</p>
          </div>
        </div>
      </div>
    </div>
  )
}