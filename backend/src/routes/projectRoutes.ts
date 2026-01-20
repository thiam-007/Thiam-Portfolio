import express, { Response } from 'express';
import multer from 'multer';
import Project from '../models/Project';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import supabaseAdmin from '../lib/supabase';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Get all projects (public - only visible)
router.get('/', async (req, res: Response) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single project
router.get('/:id', async (req, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create project with image upload (admin only)
router.post(
  '/',
  authMiddleware,
  upload.single('image'),
  async (req: AuthRequest, res: Response) => {
    try {
      let imageUrl = '';

      // Upload image to Supabase if provided
      if (req.file) {
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
          res.status(500).json({ message: 'Image upload failed' });
          return;
        }

        // Get public URL
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
      console.error('Create project error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update project (admin only)
router.put(
  '/:id',
  authMiddleware,
  upload.single('image'),
  async (req: AuthRequest, res: Response) => {
    try {
      let imageUrl: string | undefined;

      // Upload new image if provided
      if (req.file) {
        if (!supabaseAdmin) {
          console.warn('Supabase not configured - skipping upload');
          // If we strictly require upload, we could return 400 here.
          // But to prevent crash we just log it or return error if critical.
          res.status(400).json({ message: 'Storage service not configured' });
          return;
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
          res.status(500).json({ message: 'Image upload failed' });
          return;
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
        res.status(404).json({ message: 'Project not found' });
        return;
      }

      res.json(project);
    } catch (error) {
      console.error('Update project error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete project (admin only)
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Optionally delete image from Supabase
    // You can extract the path from cover_url and delete it

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;