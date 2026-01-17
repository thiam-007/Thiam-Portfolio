import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  title: string;
  description?: string;
  tech?: string[];
  cover_url?: string;
  project_url?: string;
  createdAt: Date;
}

const ProjectSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: String,
  tech: [String],
  cover_url: String,
  project_url: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);