'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, Users, MessageSquare, Eye, Flag, Ban } from 'lucide-react'
import Link from 'next/link'

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Shield className="h-16 w-16 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Community Guidelines
          </h1>
          <p className="text-xl text-gray-600">
            Help us keep VIT Random Video Chat safe and respectful for everyone
          </p>
        </div>

        <div className="grid gap-8">
          {/* Our Commitment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-6 w-6 mr-2 text-indigo-600" />
                Our Commitment
              </CardTitle>
              <CardDescription>
                We're dedicated to creating a safe and positive environment for all VIT students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                VIT Random Video Chat is designed to connect students from VIT Bhopal in a safe and 
                respectful environment. We believe that everyone deserves to feel comfortable and 
                secure while using our platform. These guidelines help us maintain that standard.
              </p>
            </CardContent>
          </Card>

          {/* Core Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-6 w-6 mr-2 text-indigo-600" />
                Core Rules
              </CardTitle>
              <CardDescription>
                Please follow these rules to ensure a positive experience for everyone
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-indigo-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Be Respectful</h4>
                  <p className="text-gray-700">
                    Treat others with kindness and respect. Harassment, bullying, or any form of 
                    discrimination will not be tolerated.
                  </p>
                </div>
                <div className="border-l-4 border-indigo-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Keep It Appropriate</h4>
                  <p className="text-gray-700">
                    No nudity, sexual content, or explicit material. This is a platform for 
                    friendly conversations and making connections.
                  </p>
                </div>
                <div className="border-l-4 border-indigo-500 pl-4">
                  <h4 className="font-semibold text-gray-900">No Illegal Activities</h4>
                  <p className="text-gray-700">
                    Do not use the platform for illegal activities or to promote harmful behavior.
                  </p>
                </div>
                <div className="border-l-4 border-indigo-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Protect Privacy</h4>
                  <p className="text-gray-700">
                    Do not share personal information or record others without their consent.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Communication Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-6 w-6 mr-2 text-indigo-600" />
                Communication Guidelines
              </CardTitle>
              <CardDescription>
                How to communicate effectively and respectfully
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Start Friendly</h4>
                  <p className="text-gray-700">
                    Begin conversations with a positive attitude. A simple "Hello" goes a long way!
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Be Patient</h4>
                  <p className="text-gray-700">
                    Not everyone will be a perfect match. It's okay to politely end a conversation 
                    and find someone new.
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Respect Boundaries</h4>
                  <p className="text-gray-700">
                    If someone seems uncomfortable or asks to end the conversation, respect their 
                    wishes and move on.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Safety Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-6 w-6 mr-2 text-indigo-600" />
                Safety Tips
              </CardTitle>
              <CardDescription>
                Stay safe while using our platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Trust Your Instincts</h4>
                  <p className="text-gray-700">
                    If something feels wrong or makes you uncomfortable, feel free to end the 
                    conversation immediately.
                  </p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Protect Your Identity</h4>
                  <p className="text-gray-700">
                    Avoid sharing personal information like your full name, address, phone number, 
                    or other sensitive details.
                  </p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Use Report Features</h4>
                  <p className="text-gray-700">
                    If you encounter someone violating these guidelines, use the report button to 
                    let us know.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reporting and Enforcement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Flag className="h-6 w-6 mr-2 text-indigo-600" />
                Reporting and Enforcement
              </CardTitle>
              <CardDescription>
                How we handle violations and keep the community safe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-semibold text-gray-900">How to Report</h4>
                  <p className="text-gray-700">
                    Click the flag icon during any chat to report inappropriate behavior. You'll need 
                    to provide a reason for the report.
                  </p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-semibold text-gray-900">What Happens Next</h4>
                  <p className="text-gray-700">
                    Our moderation team reviews all reports. Violations may result in warnings, 
                    temporary suspensions, or permanent bans.
                  </p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Appeals</h4>
                  <p className="text-gray-700">
                    If you believe your account was banned unfairly, you can contact our support 
                    team for review.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consequences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Ban className="h--6 w6 mr-2 text-indigo-600" />
                Consequences
              </CardTitle>
              <CardDescription>
                Violations may result in the following actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-semibold text-red-800">First Violation</h4>
                  <p className="text-red-700">
                    Warning and temporary suspension (24-48 hours)
                  </p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-semibold text-red-800">Second Violation</h4>
                  <p className="text-red-700">
                    Longer suspension (7 days)
                  </p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-semibold text-red-800">Third Violation</h4>
                  <p className="text-red-700">
                    Permanent ban from the platform
                  </p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-semibold text-red-800">Severe Violations</h4>
                  <p className="text-red-700">
                    Immediate permanent ban
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>
                Contact our support team if you have questions or need assistance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>Email:</strong> support@vitrandomchat.com
                </p>
                <p className="text-gray-700">
                  <strong>Hours:</strong> Monday - Friday, 9 AM - 6 PM
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Back to Home */}
          <div className="text-center">
            <Link href="/">
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}