import express, { Request, Response } from 'express';
import Contact from '../models/Contact';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Submit contact form (public)
router.post('/', async (req: Request, res: Response) => {
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

        // Envoyer email de notification à l'admin
        // Envoyer email de notification à l'admin
        const { sendContactNotification, sendAutoReply } = await import('../lib/email');
        await sendContactNotification({
            name,
            email,
            subject,
            message,
            date: contact.createdAt || new Date(),
        });

        // Envoyer accusé de réception au visiteur
        await sendAutoReply({
            name,
            email
        });

        res.status(201).json({
            message: 'Message envoyé avec succès',
            contact
        });
    } catch (error: any) {
        console.error('Error creating contact:', error);
        res.status(500).json({ message: 'Erreur lors de l\'envoi du message' });
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

// Mark message as unread (admin only)
router.patch('/:id/unread', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const message = await Contact.findByIdAndUpdate(
            req.params.id,
            { isRead: false },
            { new: true }
        ).select('-__v');

        if (!message) {
            res.status(404).json({ message: 'Message not found' });
            return;
        }

        res.json(message);
    } catch (error) {
        console.error('Mark as unread error:', error);
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
