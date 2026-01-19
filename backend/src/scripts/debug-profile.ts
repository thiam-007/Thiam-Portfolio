
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import Profile from '../models/Profile';

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found');
    process.exit(1);
}

async function debugProfile() {
    try {
        await mongoose.connect(MONGODB_URI as string);
        console.log('✅ Connected to MongoDB');

        const collection = mongoose.connection.db.collection('profiles');
        const profiles = await collection.find({}).toArray();
        console.log(`Found ${profiles.length} profiles.`);

        profiles.forEach((p: any, index: number) => {
            console.log(`\nProfile #${index + 1}:`);
            console.log(`ID: ${p._id}`);
            console.log(`Name: ${p.name}`);
            console.log(`CV URL: ${p.cvUrl || 'NULL'}`);
            console.log(`Bio: ${p.bio ? p.bio.substring(0, 20) + '...' : 'MISSING'}`);
        });

    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

debugProfile();
