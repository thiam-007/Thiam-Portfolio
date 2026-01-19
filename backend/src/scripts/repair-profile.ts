
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found');
    process.exit(1);
}

async function repairProfile() {
    try {
        await mongoose.connect(MONGODB_URI as string);
        console.log('✅ Connected to MongoDB');

        const collection = mongoose.connection.db.collection('profiles');

        // Check finding
        const profile = await collection.findOne({});
        if (!profile) {
            console.log('No profile found.');
            return;
        }

        console.log('Found profile:', profile._id);

        // Update bio if missing
        if (!profile.bio) {
            console.log('Bio is missing. Repairing...');
            await collection.updateOne(
                { _id: profile._id },
                {
                    $set: {
                        bio: "Expert en pilotage de projets transversaux et analyse stratégique, diplômé en Entrepreneuriat. Je combine une rigueur méthodologique avec des compétences techniques pour concevoir des solutions innovantes."
                    }
                }
            );
            console.log('✅ Bio repaired.');
        } else {
            console.log('Bio exists. No repair needed.');
        }

        // Verify result
        const updated = await collection.findOne({ _id: profile._id });
        console.log('Updated Profile state:', {
            id: updated?._id,
            bio_exists: !!updated?.bio,
            cvUrl: updated?.cvUrl
        });

    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

repairProfile();
