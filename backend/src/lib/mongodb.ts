import mongoose from 'mongoose';

let isConnecting = false;

const connectToDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState >= 1) {
    console.log('Already connected to MongoDB');
    return;
  }

  if (isConnecting) {
    console.log('Connection attempt already in progress...');
    return;
  }

  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    // Safe logging of URI format
    const uriMasked = mongoUri.startsWith('mongodb')
      ? `${mongoUri.split(':')[0]}://***@***`
      : 'INVALID_FORMAT';
    console.log(`Attempting to connect to MongoDB. URL format: ${uriMasked}`);

    if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
      throw new Error(`Invalid MONGODB_URI scheme. Should start with mongodb:// or mongodb+srv://. Found: ${mongoUri.substring(0, 10)}...`);
    }

    isConnecting = true;
    await mongoose.connect(mongoUri);
    isConnecting = false;
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    isConnecting = false;
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectToDatabase;