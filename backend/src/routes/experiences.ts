import express, { Response } from 'express';
import Experience from '../models/Experience';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all visible experiences (public)
router.get('/', async (req, res: Response) => {
    try {
        const experiences = await Experience.find({ isVisible: true })
            .sort({ order: 1 })
            .select('-__v');
        res.json(experiences);
    } catch (error) {
        console.error('Get experiences error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all experiences including hidden (admin only)
router.get('/all', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const experiences = await Experience.find()
            .sort({ order: 1 })
            .select('-__v');
        res.json(experiences);
    } catch (error) {
        console.error('Get all experiences error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single experience
router.get('/:id', async (req, res: Response) => {
    try {
        const experience = await Experience.findById(req.params.id).select('-__v');
        if (!experience) {
            res.status(404).json({ message: 'Experience not found' });
            return;
        }
        res.json(experience);
    } catch (error) {
        console.error('Get experience error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create experience (admin only)
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const experience = new Experience(req.body);
        await experience.save();
        res.status(201).json(experience);
    } catch (error) {
        console.error('Create experience error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update experience (admin only)
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const experience = await Experience.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).select('-__v');

        if (!experience) {
            res.status(404).json({ message: 'Experience not found' });
            return;
        }

        res.json(experience);
    } catch (error) {
        console.error('Update experience error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete experience (admin only)
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const experience = await Experience.findByIdAndDelete(req.params.id);
        if (!experience) {
            res.status(404).json({ message: 'Experience not found' });
            return;
        }
        res.json({ message: 'Experience deleted successfully' });
    } catch (error) {
        console.error('Delete experience error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
