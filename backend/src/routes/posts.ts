import express, { Response, NextFunction } from 'express';
import multer from 'multer';
import Post from '../models/Post';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import supabaseAdmin from '../lib/supabase';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function generateUniqueSlug(title: string, excludeId?: string): Promise<string> {
  const base = slugify(title);
  let counter = 0;
  while (true) {
    const candidate = counter === 0 ? base : `${base}-${counter}`;
    const query: any = { slug: candidate };
    if (excludeId) query._id = { $ne: excludeId };
    const existing = await Post.findOne(query);
    if (!existing) return candidate;
    counter++;
  }
}

function calculateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

async function uploadImageToSupabase(file: Express.Multer.File): Promise<string> {
  if (!supabaseAdmin) {
    throw new Error('Storage service not configured');
  }
  const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
  const fileName = `${Date.now()}-${sanitizedName}`;
  const { data, error } = await supabaseAdmin.storage
    .from('images')
    .upload(`blog/${fileName}`, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    console.error('Supabase upload error:', error);
    throw new Error('Image upload failed');
  }

  const { data: urlData } = supabaseAdmin.storage.from('images').getPublicUrl(data.path);
  return urlData.publicUrl;
}

// GET /api/posts — public, paginated, filtered
router.get('/', async (req, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 6;
    const skip = (page - 1) * limit;
    const { category, tag, search } = req.query;

    const query: any = { status: 'published' };
    if (category) query.category = category;
    if (tag) query.tags = tag;
    if (search) query.$text = { $search: search as string };

    const [posts, total] = await Promise.all([
      Post.find(query)
        .populate('category', 'name slug color')
        .sort({ isPinned: -1, publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments(query),
    ]);

    res.json({
      posts,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/posts/latest — 3 latest for home page
router.get('/latest', async (req, res: Response, next: NextFunction) => {
  try {
    const posts = await Post.find({ status: 'published' })
      .populate('category', 'name slug color')
      .sort({ publishedAt: -1 })
      .limit(3)
      .lean();
    res.json(posts);
  } catch (error) {
    next(error);
  }
});

// GET /api/posts/admin/all — admin, all posts
router.get('/admin/all', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const posts = await Post.find()
      .populate('category', 'name slug color')
      .sort({ createdAt: -1 })
      .lean();
    res.json(posts);
  } catch (error) {
    next(error);
  }
});

// GET /api/posts/admin/:id — admin, single post for editing
router.get('/admin/:id', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const post = await Post.findById(req.params.id).populate('category', 'name slug color');
    if (!post) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }
    res.json(post);
  } catch (error) {
    next(error);
  }
});

// GET /api/posts/slug/:slug — public, increments views
router.get('/slug/:slug', async (req, res: Response, next: NextFunction) => {
  try {
    const post = await Post.findOneAndUpdate(
      { slug: req.params.slug, status: 'published' },
      { $inc: { views: 1 } },
      { new: true }
    ).populate('category', 'name slug color');

    if (!post) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }
    res.json(post);
  } catch (error) {
    next(error);
  }
});

// GET /api/posts/:slug/related — related posts
router.get('/:slug/related', async (req, res: Response, next: NextFunction) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug, status: 'published' });
    if (!post) {
      return res.json([]);
    }
    const related = await Post.find({
      status: 'published',
      _id: { $ne: post._id },
      $or: [{ category: post.category }, { tags: { $in: post.tags } }],
    })
      .populate('category', 'name slug color')
      .sort({ publishedAt: -1 })
      .limit(3)
      .lean();
    res.json(related);
  } catch (error) {
    next(error);
  }
});

// POST /api/posts — admin, create post with optional image
router.post(
  '/',
  authMiddleware,
  upload.single('coverImage'),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      let coverImageUrl = '';

      if (req.file) {
        try {
          coverImageUrl = await uploadImageToSupabase(req.file);
        } catch (err: any) {
          return res.status(500).json({ message: err.message });
        }
      }

      const { title, content, status } = req.body;
      if (!title || !content) {
        return res.status(400).json({ message: 'Le titre et le contenu sont requis' });
      }

      const slug = await generateUniqueSlug(title);
      const readTime = calculateReadTime(content);

      const postData: any = {
        ...req.body,
        slug,
        readTime,
        coverImage: coverImageUrl || req.body.coverImage || '',
      };

      if (postData.tags && typeof postData.tags === 'string') {
        postData.tags = postData.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
      }
      if (postData.isPinned === 'true') postData.isPinned = true;
      if (postData.isPinned === 'false') postData.isPinned = false;

      if (status === 'published' && !postData.publishedAt) {
        postData.publishedAt = new Date();
      }

      const post = new Post(postData);
      await post.save();
      await post.populate('category', 'name slug color');

      res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/posts/:id — admin, update post with optional image
router.put(
  '/:id',
  authMiddleware,
  upload.single('coverImage'),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      let coverImageUrl: string | undefined;

      if (req.file) {
        try {
          coverImageUrl = await uploadImageToSupabase(req.file);
        } catch (err: any) {
          return res.status(500).json({ message: err.message });
        }
      }

      const updateData: any = { ...req.body };

      if (updateData.title) {
        updateData.slug = await generateUniqueSlug(updateData.title, req.params.id);
      }
      if (updateData.content) {
        updateData.readTime = calculateReadTime(updateData.content);
      }
      if (coverImageUrl) {
        updateData.coverImage = coverImageUrl;
      }
      if (updateData.tags && typeof updateData.tags === 'string') {
        updateData.tags = updateData.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
      }
      if (updateData.isPinned === 'true') updateData.isPinned = true;
      if (updateData.isPinned === 'false') updateData.isPinned = false;

      if (updateData.status === 'published') {
        const existing = await Post.findById(req.params.id);
        if (existing && !existing.publishedAt) {
          updateData.publishedAt = new Date();
        }
      }

      const post = await Post.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      }).populate('category', 'name slug color');

      if (!post) {
        return res.status(404).json({ message: 'Article non trouvé' });
      }

      res.json(post);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/posts/:id — admin
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }
    res.json({ message: 'Article supprimé' });
  } catch (error) {
    next(error);
  }
});

export default router;
