import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/login', loginLimiter, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res.status(500).json({ message: 'Server configuration error' });
        }

        const token = jwt.sign({ id: admin._id }, jwtSecret, { expiresIn: '7d' });

        res.json({
            message: 'Login successful',
            token,
            admin: {
                id: admin._id,
                email: admin.email,
                name: admin.name,
            },
        });
    } catch (error) {
        next(error);
    }
});

router.get('/me', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const admin = await Admin.findById(req.adminId).select('-password -__v');
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.json(admin);
    } catch (error) {
        next(error);
    }
});

router.put('/profile', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { name, email } = req.body;

        const admin = await Admin.findById(req.adminId);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        if (email && email !== admin.email) {
            const existingAdmin = await Admin.findOne({ email });
            if (existingAdmin) {
                return res.status(400).json({ message: 'Email already in use' });
            }
            admin.email = email;
        }

        if (name) {
            admin.name = name;
        }

        await admin.save();

        res.json({
            message: 'Profile updated successfully',
            admin: {
                id: admin._id,
                email: admin.email,
                name: admin.name,
            },
        });
    } catch (error) {
        next(error);
    }
});

router.put('/password', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current password and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters' });
        }

        const admin = await Admin.findById(req.adminId);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        admin.password = await bcrypt.hash(newPassword, 10);
        await admin.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        next(error);
    }
});

export default router;
