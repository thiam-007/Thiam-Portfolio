import express, { Response } from 'express';
import multer from 'multer';
import Certification from '../models/Certification';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import supabaseAdmin from '../lib/supabase';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Get all certifications (public)
router.get('/', async (req, res: Response) => {
    try {
        const certifications = await Certification.find()
            .sort({ createdAt: -1 })
            .select('-__v');
        res.json(certifications);
    } catch (error) {
        console.error('Get certifications error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single certification
router.get('/:id', async (req, res: Response) => {
    try {
        const certification = await Certification.findById(req.params.id).select('-__v');
        if (!certification) {
            res.status(404).json({ message: 'Certification not found' });
            return;
        }
        res.json(certification);
    } catch (error) {
        console.error('Get certification error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Download certification file
router.get('/:id/download', async (req, res: Response) => {
    try {
        const certification = await Certification.findById(req.params.id);
        if (!certification) {
            res.status(404).json({ message: 'Certification not found' });
            return;
        }

        // Create signed URL for download (valid for 1 hour)
        const { data, error } = await supabaseAdmin.storage
            .from('certifications')
            .createSignedUrl(certification.file_path, 3600);

        if (error || !data) {
            console.error('Supabase download error:', error);
            res.status(500).json({ message: 'File download failed' });
            return;
        }

        res.json({ downloadUrl: data.signedUrl });
    } catch (error) {
        console.error('Download certification error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create certification with file upload (admin only)
router.post(
    '/',
    authMiddleware,
    upload.single('file'),
    async (req: AuthRequest, res: Response) => {
        try {
            if (!req.file) {
                res.status(400).json({ message: 'Certification file is required' });
                return;
            }

            // Upload file to Supabase
            const fileName = `${Date.now()}-${req.file.originalname}`;
            const { data, error } = await supabaseAdmin.storage
                .from('certifications')
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype,
                    upsert: false,
                });

            if (error) {
                console.error('Supabase upload error:', error);
                res.status(500).json({ message: 'File upload failed' });
                return;
            }

            const certificationData = {
                ...req.body,
                file_path: data.path,
            };

            const certification = new Certification(certificationData);
            await certification.save();

            res.status(201).json(certification);
        } catch (error) {
            console.error('Create certification error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

// Update certification (admin only)
router.put(
    '/:id',
    authMiddleware,
    upload.single('file'),
    async (req: AuthRequest, res: Response) => {
        try {
            let filePath: string | undefined;

            // Upload new file if provided
            if (req.file) {
                const fileName = `${Date.now()}-${req.file.originalname}`;
                const { data, error } = await supabaseAdmin.storage
                    .from('certifications')
                    .upload(fileName, req.file.buffer, {
                        contentType: req.file.mimetype,
                        upsert: false,
                    });

                if (error) {
                    console.error('Supabase upload error:', error);
                    res.status(500).json({ message: 'File upload failed' });
                    return;
                }

                filePath = data.path;
            }

            const updateData = {
                ...req.body,
                ...(filePath && { file_path: filePath }),
            };

            const certification = await Certification.findByIdAndUpdate(
                req.params.id,
                updateData,
                { new: true, runValidators: true }
            ).select('-__v');

            if (!certification) {
                res.status(404).json({ message: 'Certification not found' });
                return;
            }

            res.json(certification);
        } catch (error) {
            console.error('Update certification error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

// Delete certification (admin only)
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const certification = await Certification.findByIdAndDelete(req.params.id);
        if (!certification) {
            res.status(404).json({ message: 'Certification not found' });
            return;
        }

        // Delete file from Supabase
        const { error } = await supabaseAdmin.storage
            .from('certifications')
            .remove([certification.file_path]);

        if (error) {
            console.error('Supabase delete error:', error);
        }

        res.json({ message: 'Certification deleted successfully' });
    } catch (error) {
        console.error('Delete certification error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
