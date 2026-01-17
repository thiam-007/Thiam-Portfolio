import mongoose, { Schema, Document } from 'mongoose';

export interface IExperience extends Document {
  title: string;
  company: string;
  year: string;
  description: string;
  responsibilities: string[];
  tags: string[];
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ExperienceSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    responsibilities: [{
      type: String,
      required: true,
    }],
    tags: [{
      type: String,
    }],
    order: {
      type: Number,
      default: 0,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for ordering
ExperienceSchema.index({ order: 1 });

export default mongoose.model<IExperience>('Experience', ExperienceSchema);
