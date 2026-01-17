import express, { Request, Response } from 'express';
import Contact from '../models/Contact';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Submit contact form (public)
router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }

        const contact = new Contact({
            name,
            email,
            subject,
            message,
        });

        await contact.save();

        res.status(201).json({
            message: 'Message sent successfully',
            contact: {
                id: contact._id,
                name: contact.name,
                createdAt: contact.createdAt,
            },
        });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all messages (admin only)
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const messages = await Contact.find()
            .sort({ createdAt: -1 })
            .select('-__v');
        res.json(messages);
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Mark message as read (admin only)
router.patch('/:id/read', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const message = await Contact.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        ).select('-__v');

        if (!message) {
            res.status(404).json({ message: 'Message not found' });
            return;
        }

        res.json(message);
    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete message (admin only)
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const message = await Contact.findByIdAndDelete(req.params.id);
        if (!message) {
            res.status(404).json({ message: 'Message not found' });
            return;
        }
        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Delete message error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
