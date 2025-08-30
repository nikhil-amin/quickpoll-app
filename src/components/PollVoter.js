'use client';
import { useState, useEffect } from 'react';
import { appwriteService } from '@/lib/appwrite';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function PollVoter({ pollId }) {
  const [poll, setPoll] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadPollData();
    setupRealtimeSubscription();
  }, [pollId]);

  const loadPollData = async () => {
    try {
      setLoading(true);
      
      // Get current user
      let currentUser = await appwriteService.getCurrentUser();
      if (!currentUser) {
        currentUser = await appwriteService.createAnonymousSession();
      }
      setUser(currentUser);

      // Load poll data
      const [pollData, optionsData] = await Promise.all([
        appwriteService.getPoll(pollId),
        appwriteService.getPollOptions(pollId)
      ]);

      setPoll(pollData);
      setOptions(optionsData);

      // Check if user has already voted
      const existingVote = await appwriteService.checkExistingVote(pollId, currentUser.$id);
      if (existingVote) {
        setHasVoted(true);
        setSelectedOption(existingVote.option_id);
      }

    } catch (error) {
      console.error('Failed to load poll data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const unsubscribe = appwriteService.subscribeToPolls(pollId, (response) => {
      if (response.events.includes('databases.*.collections.*.documents.*.update')) {
        // Update poll options with new vote counts
        if (response.payload.$collectionId === process.env.NEXT_PUBLIC_APPWRITE_OPTIONS_COLLECTION_ID) {
          setOptions(prevOptions => 
            prevOptions.map(option => 
              option.$id === response.payload.$id 
                ? { ...option, vote_count: response.payload.vote_count }
                : option
            )
          );
        }
        
        // Update poll total votes
        if (response.payload.$collectionId === process.env.NEXT_PUBLIC_APPWRITE_POLLS_COLLECTION_ID) {
          setPoll(prevPoll => ({ ...prevPoll, total_votes: response.payload.total_votes }));
        }
      }
    });

    return unsubscribe;
  };

  const handleVote = async (optionId) => {
    if (hasVoted || voting) return;

    setVoting(true);
    try {
      // Create vote record
      const voteData = {
        poll_id: pollId,
        option_id: optionId,
        voter_id: user.$id,
        voter_session: user.session || 'anonymous',
        is_anonymous: poll.is_anonymous,
        timestamp: new Date().toISOString()
      };

      await appwriteService.createVote(voteData);

      // Update option vote count (optimistic update)
      setOptions(prevOptions =>
        prevOptions.map(option =>
          option.$id === optionId
            ? { ...option, vote_count: option.vote_count + 1 }
            : option
        )
      );

      // Update poll total votes
      await appwriteService.updatePoll(pollId, {
        total_votes: (poll.total_votes || 0) + 1
      });

      // Update option vote count in database
      const selectedOptionData = options.find(opt => opt.$id === optionId);
      await appwriteService.updatePollOption(optionId, {
        vote_count: (selectedOptionData.vote_count || 0) + 1
      });

      setSelectedOption(optionId);
      setHasVoted(true);

    } catch (error) {
      console.error('Voting failed:', error);
      alert('Failed to vote. Please try again.');
    } finally {
      setVoting(false);
    }
  };

  const getChartData = () => {
    return {
      labels: options.map(option => option.text.substring(0, 30) + (option.text.length > 30 ? '...' : '')),
      datasets: [{
        label: 'Votes',
        data: options.map(option => option.vote_count || 0),
        backgroundColor: options.map((_, index) => 
          `hsl(${(index * 360) / options.length}, 70%, 60%)`
        ),
        borderColor: options.map((_, index) => 
          `hsl(${(index * 360) / options.length}, 70%, 50%)`
        ),
        borderWidth: 1
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center text-red-600">
          <h2 className="text-xl font-semibold mb-2">Poll Not Found</h2>
          <p>This poll doesn&apos;t exist or has been deleted.</p>
        </div>
      </div>
    );
  }

  const isExpired = poll.expires_at && new Date() > new Date(poll.expires_at);
  const totalVotes = poll.total_votes || 0;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Poll Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{poll.title}</h1>
        {poll.description && (
          <p className="text-gray-600 mb-4">{poll.description}</p>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Total votes: {totalVotes}</span>
          {poll.expires_at && (
            <span className={isExpired ? 'text-red-500' : ''}>
              {isExpired ? 'Expired' : `Expires: ${new Date(poll.expires_at).toLocaleDateString()}`}
            </span>
          )}
        </div>
      </div>

      {/* Voting Interface */}
      {!hasVoted && !isExpired && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Choose your option:</h3>
          <div className="space-y-2">
            {options.map((option, index) => (
              <button
                key={option.$id}
                onClick={() => handleVote(option.$id)}
                disabled={voting}
                className="w-full p-4 text-left bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-900"
              >
                <div className="flex items-center">
                  <span className="flex-1 font-medium">{option.text}</span>
                  {option.emoji && <span className="text-xl">{option.emoji}</span>}
                </div>
              </button>
            ))}
          </div>
          
          {voting && (
            <p className="text-center text-blue-600 mt-4">Submitting your vote...</p>
          )}
        </div>
      )}

      {/* Results */}
      {(hasVoted || isExpired) && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Results</h3>
            {hasVoted && !isExpired && (
              <span className="text-green-600 text-sm font-medium">✓ You voted</span>
            )}
          </div>

          {/* Results List */}
          <div className="space-y-3 mb-6">
            {options.map((option, index) => {
              const percentage = totalVotes > 0 ? ((option.vote_count || 0) / totalVotes * 100).toFixed(1) : 0;
              const isSelected = option.$id === selectedOption;
              
              return (
                <div 
                  key={option.$id} 
                  className={`p-3 rounded-lg border ${
                    isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className={`font-medium ${isSelected ? 'text-blue-800' : 'text-gray-800'}`}>
                      {option.text}
                      {isSelected && ' ✓'}
                    </span>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{percentage}%</div>
                      <div className="text-xs text-gray-500">{option.vote_count || 0} votes</div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-1000 ${
                        isSelected ? 'bg-blue-600' : 'bg-gray-400'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chart Visualization */}
          {totalVotes > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-md font-medium mb-3 text-center">Visual Results</h4>
              <Bar data={getChartData()} options={chartOptions} />
            </div>
          )}
        </div>
      )}

      {/* Share Poll */}
      <div className="border-t pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Share this poll:</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={typeof window !== 'undefined' ? window.location.href : ''}
                readOnly
                className="flex-1 px-3 py-2 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                style={{ minWidth: 0 }}
              />
              <button
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                className="px-3 py-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                aria-label="Copy poll link"
              >
                Copy
              </button>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-xs text-gray-900 font-mono break-all">Poll ID: {pollId.substring(0, 8)}...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
