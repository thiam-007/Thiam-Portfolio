import express, { Response, NextFunction } from 'express';
import Category from '../models/Category';
import Post from '../models/Post';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// GET all categories with article count
router.get('/', async (req, res: Response, next: NextFunction) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    const withCounts = await Promise.all(
      categories.map(async (cat) => {
        const count = await Post.countDocuments({ category: cat._id, status: 'published' });
        return { ...cat.toObject(), articleCount: count };
      })
    );
    res.json(withCounts);
  } catch (error) {
    next(error);
  }
});

// POST create category (admin)
router.post('/', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, description, color } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Le nom est requis' });
    }
    const slug = slugify(name);
    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(409).json({ message: 'Une catégorie avec ce nom existe déjà' });
    }
    const category = new Category({ name, slug, description, color });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
});

// PUT update category (admin)
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, description, color } = req.body;
    const updateData: any = {};
    if (description !== undefined) updateData.description = description;
    if (color) updateData.color = color;
    if (name) {
      updateData.name = name;
      updateData.slug = slugify(name);
    }
    const category = await Category.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }
    res.json(category);
  } catch (error) {
    next(error);
  }
});

// DELETE category (admin)
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }
    res.json({ message: 'Catégorie supprimée' });
  } catch (error) {
    next(error);
  }
});

export default router;
