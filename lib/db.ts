/**
 * Database Configuration
 * MongoDB connection w utilities
 */

import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/solar-monitoring';
const MONGODB_DB = process.env.MONGODB_DB || 'solar-monitoring';

if (!MONGODB_URI) {
  throw new Error('Ma-lqinach MONGODB_URI f .env.local');
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  // Ila kan connection mawjoud, rej3o
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Create connection jdida
  const client = await MongoClient.connect(MONGODB_URI, {
    maxPoolSize: 10,
    minPoolSize: 2,
  });

  const db = client.db(MONGODB_DB);

  // Cache lconnection
  cachedClient = client;
  cachedDb = db;

  return { client, db };
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
