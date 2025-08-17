'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Video, Shield } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleStartChat = async () => {
    if (!email) {
      setError('Please enter your email')
      return
    }

    if (!email.endsWith('@vitbhopal.ac.in')) {
      setError('Please use a valid @vitbhopal.ac.in email')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Store email in localStorage for the chat page
      localStorage.setItem('userEmail', email)
      
      // Simulate API call to verify email
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect to chat page
      router.push('/chat')
    } catch (err) {
      setError('Failed to start chat. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Video className="h-12 w-12 text-indigo-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            VIT Random Video Chat
          </CardTitle>
          <CardDescription className="text-gray-600">
            Connect with fellow VIT Bhopal students through random video chats
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="your.email@vitbhopal.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>
          <Button
            onClick={handleStartChat}
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            {isLoading ? 'Connecting...' : 'Start Chatting'}
          </Button>
          <div className="text-xs text-gray-500 text-center">
            <p>No signup required • Just enter your VIT email</p>
            <p className="mt-1">By using this service, you agree to our community guidelines</p>
            <div className="mt-2">
              <Link href="/guidelines" className="text-indigo-600 hover:text-indigo-700 underline">
                View Community Guidelines
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}