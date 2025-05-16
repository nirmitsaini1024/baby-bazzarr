import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// This is a simple API endpoint to test your MongoDB connection
// Access this at /api/test-mongodb
export async function GET() {
  // Start with basic info
  const response = {
    timestamp: new Date().toISOString(),
    nodejs_version: process.version,
    env: process.env.NODE_ENV || 'unknown',
    environment_check: {
      mongodb_uri_set: Boolean(process.env.MONGODB_URI),
      clerk_webhook_secret_set: Boolean(process.env.CLERK_WEBHOOK_SECRET)
    },
    connection_test: {
      success: false,
      error: null as string | null,
      details: null as string | null,
      stack?: string
    },
    database_info: {
      name: null as string | null,
      collections: [] as string[],
      users_collection: {
        exists: false,
        count: null as number | null,
        sample_structure?: string[]
      }
    }
  };
  
  // Test MongoDB connection
  try {
    const client = await clientPromise;
    response.connection_test.success = true;
    
    // Get database info
    const db = client.db();
    response.database_info.name = db.databaseName;
    
    // List collections
    const collections = await db.listCollections().toArray();
    response.database_info.collections = collections.map(c => c.name);
    
    // Check users collection
    const hasUsersCollection = response.database_info.collections.includes('users');
    response.database_info.users_collection.exists = hasUsersCollection;
    
    if (hasUsersCollection) {
      // Count documents in users collection
      const usersCount = await db.collection('users').countDocuments();
      response.database_info.users_collection.count = usersCount;
      
      // If there are users, get a sample
      if (usersCount > 0) {
        const sample = await db.collection('users').find().limit(1).toArray();
        // Sanitize sample (remove sensitive data)
        if (sample.length > 0) {
          const sanitizedSample = { ...sample[0] };
          // Keep only schema structure, not actual data
          response.database_info.users_collection.sample_structure = Object.keys(sanitizedSample);
        }
      }
    }
    
    // Test insert operation
    const testCollection = db.collection('webhooktest');
    await testCollection.insertOne({
      test: true,
      timestamp: new Date(),
      message: 'MongoDB connection test'
    });
    response.connection_test.details = 'Insert operation successful';
    
    // Cleanup test document
    await testCollection.deleteMany({ test: true });
    
  } catch (error) {
    response.connection_test.success = false;
    response.connection_test.error = error instanceof Error ? error.message : String(error);
    
    // Include stack trace if in development
    if (process.env.NODE_ENV === 'development' && error instanceof Error) {
      response.connection_test.stack = error.stack;
    }
  }
  
  return NextResponse.json(response);
}