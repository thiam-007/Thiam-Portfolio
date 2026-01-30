import express, { Response, NextFunction } from 'express';
import multer from 'multer';
import Profile from '../models/Profile';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import supabaseAdmin from '../lib/supabase';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', async (req, res: Response, next: NextFunction) => {
    try {
        let profile = await Profile.findOne().select('-__v');

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
        next(error);
    }
});

router.put('/', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
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
        next(error);
    }
});

router.post(
    '/image',
    authMiddleware,
    upload.single('image'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'Image file is required' });
            }

            if (!supabaseAdmin) {
                return res.status(400).json({ message: 'Storage service not configured' });
            }

            const fileName = `profile-${Date.now()}.${req.file.originalname.split('.').pop()}`;
            const { data, error } = await supabaseAdmin.storage
                .from('images')
                .upload(`profile/${fileName}`, req.file.buffer, {
                    contentType: req.file.mimetype,
                    upsert: true,
                });

            if (error) {
                console.error('Supabase upload error:', error);
                return res.status(500).json({ message: 'Image upload failed' });
            }

            const { data: urlData } = supabaseAdmin.storage
                .from('images')
                .getPublicUrl(data.path);

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
            next(error);
        }
    }
);

router.post(
    '/cv',
    authMiddleware,
    upload.single('cv'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'CV file is required' });
            }

            if (req.file.mimetype !== 'application/pdf') {
                return res.status(400).json({ message: 'Only PDF files are allowed' });
            }

            if (!supabaseAdmin) {
                return res.status(500).json({ message: 'Storage not configured' });
            }

            const fileName = `cv-${Date.now()}.pdf`;
            const { data, error } = await supabaseAdmin.storage
                .from('images')
                .upload(`cv/${fileName}`, req.file.buffer, {
                    contentType: 'application/pdf',
                    upsert: true,
                });

            if (error) {
                console.error('Supabase CV upload error:', error);
                return res.status(500).json({ message: 'CV upload failed' });
            }

            const { data: urlData } = supabaseAdmin.storage
                .from('images')
                .getPublicUrl(data.path);

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
            next(error);
        }
    }
);

export default router;
