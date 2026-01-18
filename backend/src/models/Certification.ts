import mongoose, { Schema, Document } from "mongoose";

export interface ICertification extends Document {
  title: string;
  issuer?: string;
  date?: string;
  description?: string;
  file_path: string; // Supabase storage path (private bucket)
  cover_image?: string;
  tags?: string[];
  createdAt: Date;
}

const CertificationSchema: Schema = new Schema({
  title: { type: String, required: true },
  issuer: String,
  date: String,
  description: String,
  file_path: { type: String, required: true },
  cover_image: String,
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Certification || mongoose.model<ICertification>("Certification", CertificationSchema);