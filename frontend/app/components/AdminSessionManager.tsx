'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const TIMEOUT_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

export default function AdminSessionManager({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const logout = () => {
        sessionStorage.removeItem('admin_token');
        sessionStorage.removeItem('admin_name');
        localStorage.removeItem('admin_token'); // Clear old ones too
        localStorage.removeItem('admin_name');

        // Notify other components (like Footer)
        window.dispatchEvent(new Event('admin-state-change'));

        router.push('/admin/login');
        toast('Session expirée (10 min d\'inactivité)', { icon: '⏰' });
    };

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(logout, TIMEOUT_DURATION);
    };

    useEffect(() => {
        const token = sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token');

        if (!token) {
            // Not logged in or session expired
            return;
        }

        // Initialize timeout
        resetTimeout();

        // Activity listeners
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

        const handleActivity = () => {
            resetTimeout();
        };

        events.forEach(event => {
            window.addEventListener(event, handleActivity);
        });

        // Cleanup
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            events.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
        };
    }, [router]);

    return <>{children}</>;
}
