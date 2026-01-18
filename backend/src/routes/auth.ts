import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Login
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }

        const admin = await Admin.findOne({ email });
        if (!admin) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            res.status(500).json({ message: 'Server configuration error' });
            return;
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
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get current admin info (protected)
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const admin = await Admin.findById(req.adminId).select('-password -__v');
        if (!admin) {
            res.status(404).json({ message: 'Admin not found' });
            return;
        }
        res.json(admin);
    } catch (error) {
        console.error('Get admin error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update admin profile (name, email) - protected
router.put('/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { name, email } = req.body;

        const admin = await Admin.findById(req.adminId);
        if (!admin) {
            res.status(404).json({ message: 'Admin not found' });
            return;
        }

        // Check if email is being changed to one that already exists
        if (email && email !== admin.email) {
            const existingAdmin = await Admin.findOne({ email });
            if (existingAdmin) {
                res.status(400).json({ message: 'Email already in use' });
                return;
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
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Change password (protected)
router.put('/password', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            res.status(400).json({ message: 'Current password and new password are required' });
            return;
        }

        if (newPassword.length < 6) {
            res.status(400).json({ message: 'New password must be at least 6 characters' });
            return;
        }

        const admin = await Admin.findById(req.adminId);
        if (!admin) {
            res.status(404).json({ message: 'Admin not found' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Current password is incorrect' });
            return;
        }

        admin.password = await bcrypt.hash(newPassword, 10);
        await admin.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
