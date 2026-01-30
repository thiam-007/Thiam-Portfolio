import express, { Response, NextFunction } from 'express';
import multer from 'multer';
import Certification from '../models/Certification';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import supabaseAdmin from '../lib/supabase';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', async (req, res: Response, next: NextFunction) => {
    try {
        const certifications = await Certification.find()
            .sort({ createdAt: -1 })
            .select('-__v');
        res.json(certifications);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res: Response, next: NextFunction) => {
    try {
        const certification = await Certification.findById(req.params.id).select('-__v');
        if (!certification) {
            return res.status(404).json({ message: 'Certification not found' });
        }
        res.json(certification);
    } catch (error) {
        next(error);
    }
});

router.get('/:id/download', async (req, res: Response, next: NextFunction) => {
    try {
        const certification = await Certification.findById(req.params.id);
        if (!certification) {
            return res.status(404).json({ message: 'Certification not found' });
        }

        if (!supabaseAdmin) {
            return res.status(500).json({ message: 'Storage service not configured' });
        }

        const { data, error } = await supabaseAdmin.storage
            .from('certifications')
            .createSignedUrl(certification.file_path, 3600);

        if (error || !data) {
            console.error('Supabase download error:', error);
            return res.status(500).json({ message: 'File download failed' });
        }

        res.redirect(data.signedUrl);
    } catch (error) {
        next(error);
    }
});

router.post(
    '/',
    authMiddleware,
    upload.fields([
        { name: 'file', maxCount: 1 },
        { name: 'cover_image', maxCount: 1 }
    ]),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            if (!files || !files['file']) {
                return res.status(400).json({ message: 'Certification file is required' });
            }

            if (!supabaseAdmin) {
                return res.status(500).json({ message: 'Storage service not configured' });
            }

            const certFile = files['file'][0];
            const sanitizedCertName = certFile.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
            const certFileName = `${Date.now()}-${sanitizedCertName}`;
            const { data: certData, error: certError } = await supabaseAdmin.storage
                .from('certifications')
                .upload(certFileName, certFile.buffer, {
                    contentType: certFile.mimetype,
                    upsert: false,
                });

            if (certError) {
                console.error('Supabase upload error (file):', certError);
                return res.status(500).json({ message: 'File upload failed' });
            }

            let coverImagePath = '';
            if (files['cover_image']) {
                const coverFile = files['cover_image'][0];
                const sanitizedCoverName = coverFile.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
                const coverFileName = `${Date.now()}-cover-${sanitizedCoverName}`;
                const { data: coverData, error: coverError } = await supabaseAdmin.storage
                    .from('images')
                    .upload(`certifications/${coverFileName}`, coverFile.buffer, {
                        contentType: coverFile.mimetype,
                        upsert: false,
                    });

                if (!coverError) {
                    const { data: publicUrlData } = supabaseAdmin.storage
                        .from('images')
                        .getPublicUrl(coverData.path);
                    coverImagePath = publicUrlData.publicUrl;
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
            next(error);
        }
    }
);

router.put(
    '/:id',
    authMiddleware,
    upload.fields([
        { name: 'file', maxCount: 1 },
        { name: 'cover_image', maxCount: 1 }
    ]),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
            let filePath: string | undefined;
            let coverImagePath: string | undefined;

            if (files && files['file']) {
                if (!supabaseAdmin) {
                    return res.status(500).json({ message: 'Storage service not configured' });
                }

                const certFile = files['file'][0];
                const sanitizedCertName = certFile.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
                const fileName = `${Date.now()}-${sanitizedCertName}`;
                const { data, error } = await supabaseAdmin.storage
                    .from('certifications')
                    .upload(fileName, certFile.buffer, {
                        contentType: certFile.mimetype,
                        upsert: false,
                    });

                if (error) {
                    console.error('Supabase upload error:', error);
                    return res.status(500).json({ message: 'File upload failed' });
                }

                filePath = data.path;
            }

            if (files && files['cover_image']) {
                if (supabaseAdmin) {
                    const coverFile = files['cover_image'][0];
                    const sanitizedCoverName = coverFile.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
                    const coverFileName = `${Date.now()}-cover-${sanitizedCoverName}`;
                    const { data: coverData, error: coverError } = await supabaseAdmin.storage
                        .from('images')
                        .upload(`certifications/${coverFileName}`, coverFile.buffer, {
                            contentType: coverFile.mimetype,
                            upsert: false,
                        });

                    if (!coverError && coverData) {
                        const { data: publicUrlData } = supabaseAdmin.storage
                            .from('images')
                            .getPublicUrl(coverData.path);
                        coverImagePath = publicUrlData.publicUrl;
                    }
                }
            }

            const updateData = {
                ...req.body,
                ...(filePath && { file_path: filePath }),
                ...(coverImagePath && { cover_image: coverImagePath }),
            };

            const certification = await Certification.findByIdAndUpdate(
                req.params.id,
                updateData,
                { new: true, runValidators: true }
            ).select('-__v');

            if (!certification) {
                return res.status(404).json({ message: 'Certification not found' });
            }

            res.json(certification);
        } catch (error) {
            next(error);
        }
    }
);

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const certification = await Certification.findByIdAndDelete(req.params.id);
        if (!certification) {
            return res.status(404).json({ message: 'Certification not found' });
        }

        if (supabaseAdmin) {
            const { error } = await supabaseAdmin.storage
                .from('certifications')
                .remove([certification.file_path]);

            if (error) console.error('Supabase delete error:', error);
        }

        res.json({ message: 'Certification deleted successfully' });
    } catch (error) {
        next(error);
    }
});

export default router;
