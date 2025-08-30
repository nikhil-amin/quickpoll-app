'use client';
import PollVoter from '@/components/PollVoter';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import React from 'react';

export default function PollPage({ params }) {
  const { id } = React.use(params); // Unwrap params

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link 
                href="/" 
                className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
              >
                <ArrowLeft size={20} className="mr-1" />
                Back to Home
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">QuickPoll</h1>
                <p className="text-gray-900 font-mono">Poll ID: {id.substring(0, 8)}...</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PollVoter pollId={id} />
      </main>
    </div>
  );
}
