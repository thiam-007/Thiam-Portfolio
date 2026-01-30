import express, { Response, NextFunction } from 'express';
import multer from 'multer';
import Project from '../models/Project';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import supabaseAdmin from '../lib/supabase';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', async (req, res: Response, next: NextFunction) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res: Response, next: NextFunction) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    next(error);
  }
});

router.post(
  '/',
  authMiddleware,
  upload.single('image'),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      let imageUrl = '';

      if (req.file) {
        if (!supabaseAdmin) {
          return res.status(400).json({ message: 'Storage service not configured' });
        }

        const sanitizedOriginalName = req.file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
        const fileName = `${Date.now()}-${sanitizedOriginalName}`;
        const { data, error } = await supabaseAdmin.storage
          .from('images')
          .upload(`projects/${fileName}`, req.file.buffer, {
            contentType: req.file.mimetype,
            upsert: false,
          });

        if (error) {
          console.error('Supabase upload error:', error);
          return res.status(500).json({ message: 'Image upload failed' });
        }

        const { data: urlData } = supabaseAdmin.storage
          .from('images')
          .getPublicUrl(data.path);

        imageUrl = urlData.publicUrl;
      }

      const projectData = {
        ...req.body,
        cover_url: imageUrl || req.body.cover_url,
      };

      const project = new Project(projectData);
      await project.save();

      res.status(201).json(project);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/:id',
  authMiddleware,
  upload.single('image'),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      let imageUrl: string | undefined;

      if (req.file) {
        if (!supabaseAdmin) {
          return res.status(400).json({ message: 'Storage service not configured' });
        }

        const sanitizedOriginalName = req.file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
        const fileName = `${Date.now()}-${sanitizedOriginalName}`;
        const { data, error } = await supabaseAdmin.storage
          .from('images')
          .upload(`projects/${fileName}`, req.file.buffer, {
            contentType: req.file.mimetype,
            upsert: false,
          });

        if (error) {
          console.error('Supabase upload error:', error);
          return res.status(500).json({ message: 'Image upload failed' });
        }

        const { data: urlData } = supabaseAdmin.storage
          .from('images')
          .getPublicUrl(data.path);

        imageUrl = urlData.publicUrl;
      }

      const updateData = {
        ...req.body,
        ...(imageUrl && { cover_url: imageUrl }),
      };

      const project = await Project.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      res.json(project);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;