import express, { Request, Response, NextFunction } from 'express';
import Contact from '../models/Contact';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: 'Too many messages sent from this IP, please try again after an hour',
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/', contactLimiter, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'Tous les champs sont requis' });
        }

        const contact = new Contact({
            name,
            email,
            subject,
            message,
            isRead: false,
        });

        await contact.save();

        const { sendContactNotification, sendAutoReply } = await import('../lib/email');

        await sendContactNotification({
            name,
            email,
            subject,
            message,
            date: contact.createdAt || new Date(),
        });

        await sendAutoReply({
            name,
            email
        });

        res.status(201).json({
            message: 'Message envoyé avec succès',
            contact
        });
    } catch (error) {
        next(error);
    }
});

router.get('/', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const messages = await Contact.find()
            .sort({ createdAt: -1 })
            .select('-__v');
        res.json(messages);
    } catch (error) {
        next(error);
    }
});

router.patch('/:id/read', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const message = await Contact.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        ).select('-__v');

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.json(message);
    } catch (error) {
        next(error);
    }
});

router.patch('/:id/unread', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const message = await Contact.findByIdAndUpdate(
            req.params.id,
            { isRead: false },
            { new: true }
        ).select('-__v');

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.json(message);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const message = await Contact.findByIdAndDelete(req.params.id);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        next(error);
    }
});

export default router;
