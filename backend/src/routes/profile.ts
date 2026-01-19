import express, { Response } from 'express';
import multer from 'multer';
import Profile from '../models/Profile';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import supabaseAdmin from '../lib/supabase';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Get profile (public)
router.get('/', async (req, res: Response) => {
    try {
        let profile = await Profile.findOne().select('-__v');

        // Create default profile if none exists
        if (!profile) {
            profile = new Profile({
                name: 'Cheick Ahmed Thiam',
                title: 'Consultant en Stratégie & Développement de Projets | Développeur Full Stack',
                bio: 'Expert en pilotage de projets transversaux et analyse stratégique, diplômé en Entrepreneuriat. Je combine une rigueur méthodologique avec des compétences techniques pour concevoir des solutions innovantes.',
                email: 'contact@cheickthiam.com',
                typingTexts: [
                    'Consultant en Stratégie & Développement',
                    'Développeur Full Stack',
                    'Expert en Gestion de Projet',
                    'Expert en Entrepreneuriat',
                ],
            });
            await profile.save();
        }

        res.json(profile);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update profile (admin only)
router.put('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        let profile = await Profile.findOne();

        if (!profile) {
            profile = new Profile(req.body);
        } else {
            Object.assign(profile, req.body);
        }

        await profile.save();
        res.json(profile);
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update profile image (admin only)
router.post(
    '/image',
    authMiddleware,
    upload.single('image'),
    async (req: AuthRequest, res: Response) => {
        try {
            if (!req.file) {
                res.status(400).json({ message: 'Image file is required' });
                return;
            }

            // Upload image to Supabase
            const fileName = `profile-${Date.now()}.${req.file.originalname.split('.').pop()}`;
            const { data, error } = await supabaseAdmin.storage
                .from('images')
                .upload(`profile/${fileName}`, req.file.buffer, {
                    contentType: req.file.mimetype,
                    upsert: true,
                });

            if (error) {
                console.error('Supabase upload error:', error);
                res.status(500).json({ message: 'Image upload failed' });
                return;
            }

            // Get public URL
            const { data: urlData } = supabaseAdmin.storage
                .from('images')
                .getPublicUrl(data.path);

            // Update profile with new image URL
            let profile = await Profile.findOne();
            if (!profile) {
                profile = new Profile({ profileImageUrl: urlData.publicUrl });
            } else {
                profile.profileImageUrl = urlData.publicUrl;
            }

            await profile.save();

            res.json({
                message: 'Profile image updated successfully',
                imageUrl: urlData.publicUrl,
            });
        } catch (error) {
            console.error('Update profile image error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

// Upload CV (admin only)
router.post(
    '/cv',
    authMiddleware,
    upload.single('cv'),
    async (req: AuthRequest, res: Response) => {
        try {
            if (!req.file) {
                res.status(400).json({ message: 'CV file is required' });
                return;
            }

            if (req.file.mimetype !== 'application/pdf') {
                res.status(400).json({ message: 'Only PDF files are allowed' });
                return;
            }

            if (!supabaseAdmin) {
                res.status(500).json({ message: 'Storage not configured' });
                return;
            }

            // Upload CV to Supabase (using 'images' bucket but inside 'documents' folder if possible, or just 'cv')
            const fileName = `cv-${Date.now()}.pdf`;
            const { data, error } = await supabaseAdmin.storage
                .from('images') // Reusing images bucket as it's likely the only one configured/public. Ideally should be 'documents'
                .upload(`cv/${fileName}`, req.file.buffer, {
                    contentType: 'application/pdf',
                    upsert: true,
                });

            if (error) {
                console.error('Supabase CV upload error:', error);
                res.status(500).json({ message: 'CV upload failed' });
                return;
            }

            // Get public URL
            const { data: urlData } = supabaseAdmin.storage
                .from('images')
                .getPublicUrl(data.path);

            // Update profile with new CV URL using findOneAndUpdate to avoid validation errors on other fields
            const profile = await Profile.findOneAndUpdate(
                {},
                { $set: { cvUrl: urlData.publicUrl } },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            );

            res.json({
                message: 'CV updated successfully',
                cvUrl: profile.cvUrl,
            });
        } catch (error) {
            console.error('Update CV error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

export default router;
