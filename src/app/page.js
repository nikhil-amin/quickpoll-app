'use client';
import { useState } from 'react';
import PollCreator from '@/components/PollCreator';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const [pollCode, setPollCode] = useState('');
  const router = useRouter();

  const handlePollCreated = (poll) => {
    router.push(`/poll/${poll.$id}`);
  };

  const handleJoinPoll = (e) => {
    e.preventDefault();
    if (pollCode.trim()) {
      router.push(`/poll/${pollCode.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">QuickPoll</h1>
              <p className="text-gray-600">Instant opinion collection made simple</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Join Poll Section */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Join a Poll</h2>
              <p className="text-gray-600 mb-6">Have a poll code? Enter it below to participate:</p>
              
              <form onSubmit={handleJoinPoll} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poll Code
                  </label>
                  <input
                    type="text"
                    value={pollCode}
                    onChange={(e) => setPollCode(e.target.value.toUpperCase())}
                    placeholder="Enter poll ID..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-mono tracking-wider"
                    maxLength={50}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!pollCode.trim()}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium text-lg"
                >
                  Join Poll
                </button>
              </form>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Why QuickPoll?</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-blue-600 font-bold text-sm">⚡</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Instant Results</h4>
                    <p className="text-gray-600 text-sm">See results update in real-time as people vote</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-green-600 font-bold text-sm">🔒</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Anonymous Voting</h4>
                    <p className="text-gray-600 text-sm">Protect voter privacy with anonymous options</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-purple-600 font-bold text-sm">📱</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">No Registration Required</h4>
                    <p className="text-gray-600 text-sm">Participants can vote instantly without signing up</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Create Poll Section */}
          <div className="order-1 lg:order-2">
            <PollCreator onPollCreated={handlePollCreated} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>Built with ❤️ using Next.js and Appwrite</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
