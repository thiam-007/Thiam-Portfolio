import express, { Response, NextFunction } from 'express';
import Experience from '../models/Experience';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

router.get('/', async (req, res: Response, next: NextFunction) => {
    try {
        const experiences = await Experience.find({ isVisible: true })
            .sort({ order: 1 })
            .select('-__v');
        res.json(experiences);
    } catch (error) {
        next(error);
    }
});

router.get('/all', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const experiences = await Experience.find()
            .sort({ order: 1 })
            .select('-__v');
        res.json(experiences);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res: Response, next: NextFunction) => {
    try {
        const experience = await Experience.findById(req.params.id).select('-__v');
        if (!experience) {
            return res.status(404).json({ message: 'Experience not found' });
        }
        res.json(experience);
    } catch (error) {
        next(error);
    }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const experience = new Experience(req.body);
        await experience.save();
        res.status(201).json(experience);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const experience = await Experience.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).select('-__v');

        if (!experience) {
            return res.status(404).json({ message: 'Experience not found' });
        }

        res.json(experience);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const experience = await Experience.findByIdAndDelete(req.params.id);
        if (!experience) {
            return res.status(404).json({ message: 'Experience not found' });
        }
        res.json({ message: 'Experience deleted successfully' });
    } catch (error) {
        next(error);
    }
});

export default router;
