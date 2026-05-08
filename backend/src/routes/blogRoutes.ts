import express, { Response, NextFunction } from 'express';
import multer from 'multer';
import Blog from '../models/Blog';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import supabaseAdmin from '../lib/supabase';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// GET all published blogs (public)
router.get('/', async (req, res: Response, next: NextFunction) => {
  try {
    const { category, tag, limit } = req.query;
    const filter: any = { status: 'published' };

    if (category) filter.category = category;
    if (tag) filter.tags = { $in: [tag] };

    const query = Blog.find(filter).sort({ publishedAt: -1, createdAt: -1 });
    if (limit) query.limit(Number(limit));

    const blogs = await query;
    res.json(blogs);
  } catch (error) {
    next(error);
  }
});

// GET all blogs including drafts (admin only)
router.get('/all', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    next(error);
  }
});

// GET single blog by slug (public)
router.get('/:slug', async (req, res: Response, next: NextFunction) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, status: 'published' });
    if (!blog) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }
    res.json(blog);
  } catch (error) {
    next(error);
  }
});

// GET single blog by ID (admin only)
router.get('/admin/:id', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }
    res.json(blog);
  } catch (error) {
    next(error);
  }
});

// POST create blog (admin only)
router.post(
  '/',
  authMiddleware,
  upload.single('coverImage'),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      let coverImageUrl = '';

      if (req.file) {
        if (!supabaseAdmin) {
          return res.status(400).json({ message: 'Storage service not configured' });
        }

        const sanitizedName = req.file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
        const fileName = `${Date.now()}-${sanitizedName}`;
        const { data, error } = await supabaseAdmin.storage
          .from('images')
          .upload(`blogs/${fileName}`, req.file.buffer, {
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

        coverImageUrl = urlData.publicUrl;
      }

      const { title, excerpt, content, category, tags, status, readTime } = req.body;
      const slug = req.body.slug || generateSlug(title);

      const existingSlug = await Blog.findOne({ slug });
      const finalSlug = existingSlug ? `${slug}-${Date.now()}` : slug;

      const parsedTags = Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t: string) => t.trim()) : []);

      const blog = new Blog({
        title,
        slug: finalSlug,
        excerpt,
        content,
        coverImage: coverImageUrl || req.body.coverImage,
        category: category || 'General',
        tags: parsedTags,
        status: status || 'draft',
        readTime: Number(readTime) || 5,
        publishedAt: status === 'published' ? new Date() : undefined,
      });

      await blog.save();
      res.status(201).json(blog);
    } catch (error) {
      next(error);
    }
  }
);

// PUT update blog (admin only)
router.put(
  '/:id',
  authMiddleware,
  upload.single('coverImage'),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      let coverImageUrl: string | undefined;

      if (req.file) {
        if (!supabaseAdmin) {
          return res.status(400).json({ message: 'Storage service not configured' });
        }

        const sanitizedName = req.file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
        const fileName = `${Date.now()}-${sanitizedName}`;
        const { data, error } = await supabaseAdmin.storage
          .from('images')
          .upload(`blogs/${fileName}`, req.file.buffer, {
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

        coverImageUrl = urlData.publicUrl;
      }

      const existing = await Blog.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({ message: 'Article non trouvé' });
      }

      const { title, excerpt, content, category, tags, status, readTime } = req.body;
      const parsedTags = Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t: string) => t.trim()) : []);

      const updateData: any = {
        excerpt,
        content,
        category,
        tags: parsedTags,
        status,
        readTime: Number(readTime) || 5,
        ...(title && { title }),
        ...(coverImageUrl && { coverImage: coverImageUrl }),
      };

      if (status === 'published' && existing.status !== 'published') {
        updateData.publishedAt = new Date();
      }

      const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      });

      res.json(blog);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE blog (admin only)
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }
    res.json({ message: 'Article supprimé avec succès' });
  } catch (error) {
    next(error);
  }
});

export default router;
