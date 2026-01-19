import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
    name: string;
    title: string;
    bio: string;
    email: string;
    phone: string;
    location: string;
    profileImageUrl: string; // Supabase URL
    cvUrl?: string;
    typingTexts: string[];
    socialLinks: {
        linkedin?: string;
        github?: string;
        twitter?: string;
    };
    updatedAt: Date;
}

const ProfileSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
            default: 'Cheick Ahmed Thiam',
        },
        title: {
            type: String,
            required: true,
            default: 'Consultant en Stratégie & Développement de Projets | Développeur Full Stack',
        },
        bio: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            default: 'contact@cheickthiam.com',
        },
        phone: {
            type: String,
            default: '+33 6 00 00 00 00',
        },
        location: {
            type: String,
            default: 'Paris, France',
        },
        profileImageUrl: {
            type: String,
            default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
        },
        cvUrl: {
            type: String,
            required: false,
        },
        typingTexts: [{
            type: String,
        }],
        socialLinks: {
            linkedin: String,
            github: String,
            twitter: String,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IProfile>('Profile', ProfileSchema);
