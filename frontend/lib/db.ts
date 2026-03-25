/**
 * Database Configuration
 * MongoDB connection w utilities
 */

import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/solar-monitoring';
const MONGODB_DB = process.env.MONGODB_DB || 'solar-monitoring';

const MONGODB_SERVER_SELECTION_TIMEOUT_MS = Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS || '800');
const MONGODB_CONNECT_TIMEOUT_MS = Number(process.env.MONGODB_CONNECT_TIMEOUT_MS || '800');
const MONGODB_SOCKET_TIMEOUT_MS = Number(process.env.MONGODB_SOCKET_TIMEOUT_MS || '2000');
const MONGODB_RETRY_COOLDOWN_MS = Number(process.env.MONGODB_RETRY_COOLDOWN_MS || '30000');

if (!MONGODB_URI) {
  throw new Error('Ma-lqinach MONGODB_URI f .env.local');
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;
let inFlightConnection: Promise<{ client: MongoClient; db: Db }> | null = null;
let lastConnectionFailureAt: number | null = null;

function isRetryCooldownActive(now: number): boolean {
  if (lastConnectionFailureAt === null) return false;
  return now - lastConnectionFailureAt < MONGODB_RETRY_COOLDOWN_MS;
}

export async function connectToDatabase() {
  // Ila kan connection mawjoud, rej3o
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const now = Date.now();
  if (isRetryCooldownActive(now)) {
    throw new Error('MongoDB unavailable (retry cooldown active)');
  }

  // Avoid opening many parallel connection attempts under load.
  if (inFlightConnection) {
    return inFlightConnection;
  }

  inFlightConnection = (async () => {
    try {
      // Create connection jdida
      const client = await MongoClient.connect(MONGODB_URI, {
        maxPoolSize: 10,
        minPoolSize: 0,
        serverSelectionTimeoutMS: MONGODB_SERVER_SELECTION_TIMEOUT_MS,
        connectTimeoutMS: MONGODB_CONNECT_TIMEOUT_MS,
        socketTimeoutMS: MONGODB_SOCKET_TIMEOUT_MS,
      });

      const db = client.db(MONGODB_DB);

      // Cache lconnection
      cachedClient = client;
      cachedDb = db;
      lastConnectionFailureAt = null;

      return { client, db };
    } catch (error) {
      lastConnectionFailureAt = Date.now();
      throw error;
    } finally {
      inFlightConnection = null;
    }
  })();

  return inFlightConnection;
}

// Helper function bach tjib collection
export async function getCollection(collectionName: string) {
  const { db } = await connectToDatabase();
  return db.collection(collectionName);
}

// Collections dial application
export const COLLECTIONS = {
  SENSOR_DATA: 'sensor_data',
  TEMPERATURE_LOGS: 'temperature_logs', 
  SYSTEM_STATUS: 'system_status',
  ALERTS: 'alerts',
  USER_LOGS: 'user_logs',
  FEEDBACK: 'feedback',
};
