'use client';
import { useState } from 'react';
import { appwriteService } from '@/lib/appwrite';
import { Plus, X, Smile } from 'lucide-react';

export default function PollCreator({ onPollCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [expiresIn, setExpiresIn] = useState('1'); // hours
  const [loading, setLoading] = useState(false);

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Ensure user session
      let user = await appwriteService.getCurrentUser();
      if (!user) {
        user = await appwriteService.createAnonymousSession();
      }

      // Calculate expiry date
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + parseInt(expiresIn));

      // Create poll
      const pollData = {
        title: title.trim(),
        description: description.trim(),
        creator_id: user.$id,
        poll_type: 'single_choice',
        is_anonymous: isAnonymous,
        is_public: true,
        expires_at: expiresAt.toISOString(),
        status: 'active',
        total_votes: 0
      };

      const poll = await appwriteService.createPoll(pollData);

      // Create poll options
      const validOptions = options.filter(opt => opt.trim() !== '');
      const optionPromises = validOptions.map((option, index) =>
        appwriteService.createPollOption({
          poll_id: poll.$id,
          text: option.trim(),
          emoji: '', // Can add emoji selection later
          vote_count: 0,
          order_index: index
        })
      );

      await Promise.all(optionPromises);

      // Reset form
      setTitle('');
      setDescription('');
      setOptions(['', '']);
      setExpiresIn('1');

      if (onPollCreated) {
        onPollCreated(poll);
      }

      alert('Poll created successfully!');
    } catch (error) {
      console.error('Poll creation error:', error);
      alert('Failed to create poll. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Poll</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Poll Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Poll Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's your question?"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            maxLength={200}
          />
        </div>

        {/* Poll Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more context to your poll..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={1000}
          />
        </div>

        {/* Poll Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Poll Options *
          </label>
          {options.map((option, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={index < 2}
                maxLength={500}
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-md"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
          
          {options.length < 10 && (
            <button
              type="button"
              onClick={addOption}
              className="flex items-center text-blue-600 hover:text-blue-800 mt-2"
            >
              <Plus size={16} className="mr-1" />
              Add Option
            </button>
          )}
        </div>

        {/* Poll Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expires In
            </label>
            <select
              value={expiresIn}
              onChange={(e) => setExpiresIn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">1 Hour</option>
              <option value="6">6 Hours</option>
              <option value="24">1 Day</option>
              <option value="168">1 Week</option>
              <option value="720">1 Month</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="anonymous" className="text-sm text-gray-700">
              Anonymous voting
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !title.trim() || options.filter(opt => opt.trim()).length < 2}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {loading ? 'Creating Poll...' : 'Create Poll'}
        </button>
      </form>
    </div>
  );
}
