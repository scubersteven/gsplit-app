import { openDB, DBSchema, IDBPDatabase } from 'idb';

// Define database schema
interface PintDB extends DBSchema {
  pints: {
    key: number;
    value: {
      id: number;
      date: string;
      splitScore: number;
      splitImage: string;
      splitDetected: boolean;
      feedback: string;
      location?: string | null;
      place_id?: string;
      pub_name?: string;
      pub_address?: string;
      pub_lat?: number;
      pub_lng?: number;
      ranking?: string;
      overallRating?: number | null;
      price?: number | null;
      taste?: number | null;
      temperature?: number | null;
      creaminess?: number | null;
      lacing?: number | null;
      pourTechnique?: string[] | null;
      roast?: string | null;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<PintDB>>;

// Initialize database with error handling
export const initDB = async () => {
  if (!dbPromise) {
    dbPromise = openDB<PintDB>('gsplit-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('pints')) {
          db.createObjectStore('pints', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
};

// Save a pint with quota error handling
export const savePint = async (pint: PintDB['pints']['value']) => {
  try {
    const db = await initDB();
    await db.put('pints', pint);
  } catch (error: any) {
    if (error.name === 'QuotaExceededError') {
      throw new Error('Storage quota exceeded. Please delete old pints.');
    }
    throw error;
  }
};

// Get all pints (sorted by date, newest first)
export const getAllPints = async (): Promise<PintDB['pints']['value'][]> => {
  try {
    const db = await initDB();
    const pints = await db.getAll('pints');
    return pints.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Failed to load pints:', error);
    return [];
  }
};

// Get a single pint by ID
export const getPintById = async (id: number): Promise<PintDB['pints']['value'] | undefined> => {
  const db = await initDB();
  return db.get('pints', id);
};

// Delete a pint
export const deletePint = async (id: number) => {
  const db = await initDB();
  await db.delete('pints', id);
};

// Get total pint count
export const getPintCount = async (): Promise<number> => {
  const db = await initDB();
  return db.count('pints');
};

// Calculate stats
export const getPintStats = async () => {
  const pints = await getAllPints();

  if (pints.length === 0) {
    return {
      averageScore: 0,
      bestScore: 0,
      totalPints: 0,
    };
  }

  const scores = pints.map(p => p.splitScore);
  const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  const bestScore = Math.max(...scores);

  return {
    averageScore,
    bestScore,
    totalPints: pints.length,
  };
};

// Check storage quota using StorageManager API
export const checkStorageQuota = async () => {
  if (navigator.storage && navigator.storage.estimate) {
    const estimate = await navigator.storage.estimate();
    const percentUsed = ((estimate.usage || 0) / (estimate.quota || 1)) * 100;
    return {
      usage: estimate.usage || 0,
      quota: estimate.quota || 0,
      percentUsed
    };
  }
  return null;
};

// Fallback check for IndexedDB support
export const isIndexedDBSupported = (): boolean => {
  try {
    return !!window.indexedDB;
  } catch {
    return false;
  }
};
