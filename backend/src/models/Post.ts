import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IPost extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  category?: Types.ObjectId;
  tags: string[];
  author: string;
  status: 'draft' | 'published';
  views: number;
  readTime: number;
  isPinned: boolean;
  metaTitle?: string;
  metaDescription?: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    content: { type: String, required: true },
    excerpt: { type: String, trim: true },
    coverImage: { type: String },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    tags: [{ type: String, trim: true }],
    author: { type: String, default: 'Cheick Ahmed Thiam' },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    views: { type: Number, default: 0 },
    readTime: { type: Number, default: 1 },
    isPinned: { type: Boolean, default: false },
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

PostSchema.index({ slug: 1 });
PostSchema.index({ status: 1, publishedAt: -1 });
PostSchema.index({ title: 'text', content: 'text', tags: 'text' });

export default mongoose.model<IPost>('Post', PostSchema);
