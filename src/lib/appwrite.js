import { Client, Account, Databases, ID, Query, Functions } from 'appwrite';

// Initialize Appwrite Client
export const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

// Initialize Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const functions = new Functions(client);

// Database configuration
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
export const COLLECTIONS = {
  POLLS: process.env.NEXT_PUBLIC_APPWRITE_POLLS_COLLECTION_ID,
  POLL_OPTIONS: process.env.NEXT_PUBLIC_APPWRITE_OPTIONS_COLLECTION_ID,
  VOTES: process.env.NEXT_PUBLIC_APPWRITE_VOTES_COLLECTION_ID
};

// Export ID for document creation
export { ID, Query };

// Utility functions
export const appwriteService = {
  // Authentication
  async createAnonymousSession() {
    try {
      return await account.createAnonymousSession();
    } catch (error) {
      console.error('Anonymous session creation failed:', error);
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      return await account.get();
    } catch (error) {
      return null;
    }
  },

  // Poll operations
  async createPoll(pollData) {
    try {
      return await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.POLLS,
        ID.unique(),
        pollData
      );
    } catch (error) {
      console.error('Poll creation failed:', error);
      throw error;
    }
  },

  async getPoll(pollId) {
    try {
      return await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.POLLS,
        pollId
      );
    } catch (error) {
      console.error('Get poll failed:', error);
      throw error;
    }
  },

  async updatePoll(pollId, data) {
    try {
      return await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.POLLS,
        pollId,
        data
      );
    } catch (error) {
      console.error('Poll update failed:', error);
      throw error;
    }
  },

  // Poll options operations
  async createPollOption(optionData) {
    try {
      return await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.POLL_OPTIONS,
        ID.unique(),
        optionData
      );
    } catch (error) {
      console.error('Poll option creation failed:', error);
      throw error;
    }
  },

  async getPollOptions(pollId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.POLL_OPTIONS,
        [
          Query.equal('poll_id', pollId),
          Query.orderAsc('order_index')
        ]
      );
      return response.documents;
    } catch (error) {
      console.error('Get poll options failed:', error);
      throw error;
    }
  },

  async updatePollOption(optionId, data) {
    try {
      return await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.POLL_OPTIONS,
        optionId,
        data
      );
    } catch (error) {
      console.error('Poll option update failed:', error);
      throw error;
    }
  },

  // Voting operations
  async createVote(voteData) {
    try {
      return await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.VOTES,
        ID.unique(),
        voteData
      );
    } catch (error) {
      console.error('Vote creation failed:', error);
      throw error;
    }
  },

  async checkExistingVote(pollId, voterId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.VOTES,
        [
          Query.equal('poll_id', pollId),
          Query.equal('voter_id', voterId)
        ]
      );
      return response.documents.length > 0 ? response.documents : null;
    } catch (error) {
      console.error('Check existing vote failed:', error);
      return null;
    }
  },

  // Realtime subscriptions
  subscribeToPolls(pollId, callback) {
    return client.subscribe([
      `databases.${DATABASE_ID}.collections.${COLLECTIONS.POLLS}.documents.${pollId}`,
      `databases.${DATABASE_ID}.collections.${COLLECTIONS.POLL_OPTIONS}.documents`,
      `databases.${DATABASE_ID}.collections.${COLLECTIONS.VOTES}.documents`
    ], callback);
  }
};
