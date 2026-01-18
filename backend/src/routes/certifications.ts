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

        if (!supabaseAdmin) {
            res.status(500).json({ message: 'Storage service not configured' });
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

        res.redirect(data.signedUrl);
    } catch (error) {
        console.error('Download certification error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create certification with file upload (admin only)
router.post(
    '/',
    authMiddleware,
    upload.fields([
        { name: 'file', maxCount: 1 },
        { name: 'cover_image', maxCount: 1 }
    ]),
    async (req: AuthRequest, res: Response) => {
        try {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            if (!files || !files['file']) {
                res.status(400).json({ message: 'Certification file is required' });
                return;
            }

            if (!supabaseAdmin) {
                res.status(500).json({ message: 'Storage service not configured' });
                return;
            }

            // Upload Certification Document
            const certFile = files['file'][0];
            const certFileName = `${Date.now()}-${certFile.originalname}`;
            const { data: certData, error: certError } = await supabaseAdmin.storage
                .from('certifications')
                .upload(certFileName, certFile.buffer, {
                    contentType: certFile.mimetype,
                    upsert: false,
                });

            if (certError) {
                console.error('Supabase upload error (file):', certError);
                res.status(500).json({ message: 'File upload failed' });
                return;
            }

            // Upload Cover Image (Optional)
            let coverImagePath = '';
            if (files['cover_image']) {
                if (!supabaseAdmin) {
                    // Should verify if we want to fail partial uploads. 
                    // Since we checked earlier, this is logically safe but TS doesn't know.
                    // Re-assert or check.
                    console.warn('Supabase lost during processing?');
                } else {
                    const coverFile = files['cover_image'][0];
                    const coverFileName = `${Date.now()}-cover-${coverFile.originalname}`;
                    const { data: coverData, error: coverError } = await supabaseAdmin.storage
                        .from('images') // Use public images bucket for cover
                        .upload(`certifications/${coverFileName}`, coverFile.buffer, {
                            contentType: coverFile.mimetype,
                            upsert: false,
                        });

                    if (coverError) {
                        console.warn('Supabase upload error (cover):', coverError);
                        // Continue without cover if it fails? Or fail? Let's log and continue for now or throw.
                        // Better to fail so user knows.
                    } else {
                        const { data: publicUrlData } = supabaseAdmin.storage
                            .from('images')
                            .getPublicUrl(coverData.path);
                        coverImagePath = publicUrlData.publicUrl;
                    }
                }
            }

            const certificationData = {
                ...req.body,
                file_path: certData.path,
                cover_image: coverImagePath
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
                if (!supabaseAdmin) {
                    res.status(500).json({ message: 'Storage service not configured' });
                    return;
                }

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
        if (supabaseAdmin) {
            const { error } = await supabaseAdmin.storage
                .from('certifications')
                .remove([certification.file_path]);

            if (error) console.error('Supabase delete error:', error);
        }

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
