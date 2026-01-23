'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import toast from 'react-hot-toast';

const TIMEOUT_DURATION = 10 * 60 * 1000; // 10 minutes

export default function AdminSessionManager({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastActivityRef = useRef<number>(Date.now());

    const logout = (message = 'Session expirée (Inactivité)') => {
        const token = sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token');
        if (!token) return;

        sessionStorage.removeItem('admin_token');
        sessionStorage.removeItem('admin_name');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_name');

        window.dispatchEvent(new Event('admin-state-change'));

        router.push('/admin/login');
        toast.error(message, { icon: '⏰' });
    };

    const resetTimeout = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => logout(), TIMEOUT_DURATION);
    };

    useEffect(() => {
        // Don't manage session on login page
        if (pathname === '/admin/login') {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            return;
        }

        const token = sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token');
        if (!token) return;

        resetTimeout();

        const handleActivity = () => {
            const now = Date.now();
            // Throttle activity updates to once every 2 seconds
            if (now - lastActivityRef.current > 2000) {
                lastActivityRef.current = now;
                resetTimeout();
            }
        };

        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        events.forEach(event => window.addEventListener(event, handleActivity));

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            events.forEach(event => window.removeEventListener(event, handleActivity));
        };
    }, [pathname, router]);

    return <>{children}</>;
}
