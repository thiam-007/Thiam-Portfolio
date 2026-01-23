import AdminSessionManager from '@/components/AdminSessionManager';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <AdminSessionManager>{children}</AdminSessionManager>;
}
