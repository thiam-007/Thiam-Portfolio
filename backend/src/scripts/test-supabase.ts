
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Testing Supabase Connection...');
console.log('URL:', supabaseUrl);
console.log('Key length:', supabaseServiceKey ? supabaseServiceKey.length : 0);

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
    try {
        console.log('Listing buckets...');
        const { data, error } = await supabase.storage.listBuckets();

        if (error) {
            console.error('❌ Error listing buckets:', error.message);
            console.error('Full Error:', error);
        } else {
            console.log('✅ Success! Buckets:', data.map(b => b.name));

            // Test Upload
            console.log('Testing Upload to images/test-cv.pdf...');
            const dummyPdf = Buffer.from('%PDF-1.0\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 3 3]>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000010 00000 n\n0000000060 00000 n\n0000000111 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n178\n%%EOF');

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('images')
                .upload('cv/test-cv-script.pdf', dummyPdf, {
                    contentType: 'application/pdf',
                    upsert: true
                });

            if (uploadError) {
                console.error('❌ Upload Error:', uploadError);
            } else {
                console.log('✅ Upload Success!', uploadData);
                const { data: publicUrl } = supabase.storage.from('images').getPublicUrl(uploadData.path);
                console.log('Note: Public URL:', publicUrl.publicUrl);
            }
        }
    } catch (err) {
        console.error('❌ Exception:', err);
    }
}

testConnection();
