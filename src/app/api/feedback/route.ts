import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

interface FeedbackData {
  name: string;
  email: string;
  category: string;
  rating?: number;
  message: string;
  timestamp: string;
  userAgent?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: FeedbackData = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.category || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate message length
    if (body.message.length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters long' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_CONNECTION_STRING;
    
    if (!mongoUri) {
      console.error('MongoDB URI not configured');
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 500 }
      );
    }

    const client = new MongoClient(mongoUri);
    
    try {
      await client.connect();
      const db = client.db('github_readme_feedback');      const collection = db.collection('feedback_submissions');
      
      // Get client IP address
      const forwarded = request.headers.get('x-forwarded-for');
      const ipAddress = forwarded ? forwarded.split(',')[0] : 
                       request.headers.get('x-real-ip') || 
                       'unknown';

      // Prepare feedback document
      const feedbackDoc = {
        ...body,
        submittedAt: new Date(),
        ipAddress,
        processed: false,
        tags: [body.category],
        source: 'github_readme_generator'
      };

      const result = await collection.insertOne(feedbackDoc);

      if (!result.insertedId) {
        throw new Error('Failed to insert feedback');
      }

      await collection.createIndex({ submittedAt: -1 });
      await collection.createIndex({ category: 1 });
      await collection.createIndex({ processed: 1 });
      await collection.createIndex({ email: 1 });
      await collection.createIndex({ rating: 1 });

      console.log(`✅ Feedback submitted successfully: ${result.insertedId}`);

      return NextResponse.json(
        { 
          success: true, 
          message: 'Feedback submitted successfully',
          id: result.insertedId
        },
        { status: 201 }
      );

    } finally {
      await client.close();
    }

  } catch (error) {
    console.error('Error processing feedback:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to submit feedback',
        message: 'Please try again later'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const adminToken = process.env.ADMIN_TOKEN;

    if (!adminToken || authHeader !== `Bearer ${adminToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_CONNECTION_STRING;
    
    if (!mongoUri) {
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 500 }
      );
    }

    const client = new MongoClient(mongoUri);
    
    try {
      await client.connect();
      const db = client.db('github_readme_feedback');
      const collection = db.collection('feedback_submissions');

      const { searchParams } = new URL(request.url);
      const limit = parseInt(searchParams.get('limit') || '50');
      const skip = parseInt(searchParams.get('skip') || '0');
      const category = searchParams.get('category');
      const processed = searchParams.get('processed');

      const filter: any = {};
      if (category) filter.category = category;
      if (processed !== null) filter.processed = processed === 'true';

      const feedback = await collection
        .find(filter)
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      const total = await collection.countDocuments(filter);

      const categoryStats = await collection.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]).toArray();

      const ratingStats = await collection.aggregate([
        { $match: { rating: { $exists: true, $gt: 0 } } },
        { $group: { 
          _id: null, 
          averageRating: { $avg: '$rating' },
          totalRatings: { $sum: 1 },
          ratingDistribution: {
            $push: '$rating'
          }
        }}
      ]).toArray();

      return NextResponse.json({
        feedback,
        pagination: {
          total,
          limit,
          skip,
          hasMore: skip + limit < total
        },
        statistics: {
          categories: categoryStats,
          ratings: ratingStats[0] || null
        }
      });

    } finally {
      await client.close();
    }

  } catch (error) {
    console.error('Error retrieving feedback:', error);
    
    return NextResponse.json(
      { error: 'Failed to retrieve feedback' },
      { status: 500 }
    );
  }
}
