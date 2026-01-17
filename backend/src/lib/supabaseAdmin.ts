import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL!;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!url || !serviceRole) {
  throw new Error("Supabase server env vars missing");
}

export const supabaseAdmin = createClient(url, serviceRole, {
  auth: {
    persistSession: false,
    detectSessionInUrl: false
  }
});

export async function uploadCertificationFile(path: string, buffer: Buffer, contentType: string) {
  const { data, error } = await supabaseAdmin.storage
    .from("certifications")
    .upload(path, buffer, { contentType, upsert: true });

  if (error) throw error;

  return data.path; // store the storage path in DB
}

export async function createSignedCertificationUrl(path: string, expiresIn = 300) {
  const { data, error } = await supabaseAdmin.storage
    .from("certifications")
    .createSignedUrl(path, expiresIn);

  if (error) throw error;
  return data.signedUrl;
}