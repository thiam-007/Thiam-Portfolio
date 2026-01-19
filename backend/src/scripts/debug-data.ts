
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

async function debugData() {
    try {
        await mongoose.connect(MONGODB_URI as string);
        console.log('✅ Connected to MongoDB');

        // Check Experiences
        const experiences = await mongoose.connection.db.collection('experiences').find({}).toArray();
        console.log('\n--- EXPERIENCES ---');
        experiences.forEach((e: any) => {
            console.log(`Title: ${e.title}`);
            console.log('Tags:', e.tags, 'Type:', typeof e.tags, 'IsArray:', Array.isArray(e.tags));
            if (Array.isArray(e.tags)) {
                e.tags.forEach((t: any, i: number) => {
                    console.log(`  Tag[${i}]: '${t}' (${typeof t})`);
                });
            }
        });

        // Check Projects
        const projects = await mongoose.connection.db.collection('projects').find({}).toArray();
        console.log('\n--- PROJECTS ---');
        projects.forEach((p: any) => {
            console.log(`Title: ${p.title}`);
            console.log('Tech:', p.tech, 'Type:', typeof p.tech, 'IsArray:', Array.isArray(p.tech));
            if (Array.isArray(p.tech)) {
                p.tech.forEach((t: any, i: number) => {
                    console.log(`  Tech[${i}]: '${t}' (${typeof t})`);
                });
            }
        });

        // Check Certifications
        const certs = await mongoose.connection.db.collection('certifications').find({}).toArray();
        console.log('\n--- CERTIFICATIONS ---');
        certs.forEach((c: any) => {
            console.log(`Title: ${c.title}`);
            console.log('Tags:', c.tags, 'Type:', typeof c.tags, 'IsArray:', Array.isArray(c.tags));
            if (Array.isArray(c.tags)) {
                c.tags.forEach((t: any, i: number) => {
                    console.log(`  Tag[${i}]: '${t}' (${typeof t})`);
                });
            }
        });

    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

debugData();
